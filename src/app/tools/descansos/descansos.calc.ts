export const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
export type Dia = (typeof DIAS)[number];

/** Todos los tiempos son minutos desde las 00:00. Los valores iniciales son de ejemplo y se editan en pantalla. */
export interface Parametros {
  /** Minutos después del inicio del intervalo en que arranca cada salida (6:05, 6:35…). */
  desfase: number;
  descanso: number;
  /** Descansos por agente. */
  descansos: number;
  almuerzo: number;
  almuerzoDesde: number;
  almuerzoHasta: number;
  desde: number;
  hasta: number;
  /** Una salida cuenta en un intervalo si lo ocupa al menos estos minutos. */
  minFuera: number;
  /** Minutos libres entre dos salidas del mismo agente. */
  separacion: number;
  /** Los descansos no caen en los primeros ni en los últimos minutos del turno. */
  margenDescanso: number;
  /** Lo mismo para el almuerzo. */
  margenAlmuerzo: number;
}

export const PARAMETROS: Parametros = {
  desfase: 5,
  descanso: 15,
  descansos: 2,
  almuerzo: 60,
  almuerzoDesde: 11 * 60,
  almuerzoHasta: 15 * 60,
  desde: 6 * 60,
  hasta: 21 * 60,
  minFuera: 15,
  separacion: 60,
  margenDescanso: 60,
  margenAlmuerzo: 120,
};

export interface Agente {
  id: number;
  codigo: string;
  entrada: number;
  salida: number;
  almuerzoFijo: number | null;
}

export type Tipo = 'descanso' | 'almuerzo';

export interface Salida {
  id: number;
  agente: number;
  tipo: Tipo;
  inicio: number;
  fin: number;
}

export interface Pendiente {
  agente: number;
  tipo: Tipo;
  motivo: string;
}

export type Estado = 'Cumple' | 'Revisar' | 'Déficit';

export interface Fila {
  inicio: number;
  req: number;
  conectados: number;
  descanso: number;
  almuerzo: number;
  disponibles: number;
  puedeSalir: number;
  /** null mientras no se escriba un requerimiento para el intervalo. */
  estado: Estado | null;
}

export interface AgenteBorrador {
  codigo: string;
  entrada: number;
  salida: number;
  almuerzoFijo: number | null;
}

export const PASO = 30;

let contador = 0;
export const nuevoId = () => ++contador;

export function hora(m: number): string {
  const h = Math.floor(m / 60) % 24;
  const min = String(m % 60).padStart(2, '0'); // taste-skill-ignore: formato de hora, no numeración
  return `${h % 12 === 0 ? 12 : h % 12}:${min} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

/** "HH:MM" para los campos de hora del navegador. */
export const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; // taste-skill-ignore: formato de hora

/** Entiende "6", "6:00", "06:00", "3:00 pm", "15:00"… y devuelve minutos, o null. */
export function aMinutos(texto: string): number | null {
  const m = texto.trim().toLowerCase().replace(/\./g, '').match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (min > 59 || h > 24 || (h === 24 && min > 0)) return null;
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

export function intervalos(p: Parametros): number[] {
  const r: number[] = [];
  for (let t = p.desde; t + PASO <= p.hasta; t += PASO) r.push(t);
  return r;
}

const solape = (a1: number, a2: number, b1: number, b2: number) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));

const conectado = (a: Agente, inicio: number, p: Parametros) => {
  const ov = solape(a.entrada, a.salida, inicio, inicio + PASO);
  return ov > 0 && ov >= Math.min(p.minFuera, PASO);
};

/** Una salida cuenta en el intervalo que ocupa minFuera minutos o más (o toda su duración si es más corta). */
const cuentaFuera = (ini: number, fin: number, intervalo: number, p: Parametros) => {
  const ov = solape(ini, fin, intervalo, intervalo + PASO);
  return ov > 0 && ov >= Math.min(p.minFuera, fin - ini);
};

export function cobertura(req: Record<number, number>, agentes: Agente[], salidas: Salida[], p: Parametros): Fila[] {
  return intervalos(p).map((inicio) => {
    const r = req[inicio] ?? 0;
    const conectados = agentes.filter((a) => conectado(a, inicio, p)).length;
    const fuera = (tipo: Tipo) => salidas.filter((s) => s.tipo === tipo && cuentaFuera(s.inicio, s.fin, inicio, p)).length;
    const descanso = fuera('descanso');
    const almuerzo = fuera('almuerzo');
    const disponibles = conectados - descanso - almuerzo;
    const estado: Estado | null = r <= 0 ? null : conectados < r ? 'Déficit' : disponibles < r ? 'Revisar' : 'Cumple';
    return { inicio, req: r, conectados, descanso, almuerzo, disponibles, puedeSalir: Math.max(0, disponibles - r), estado };
  });
}

const holguraPorIntervalo = (req: Record<number, number>, agentes: Agente[], salidas: Salida[], p: Parametros) =>
  intervalos(p).map((t) => agentes.filter((a) => conectado(a, t, p)).length - (req[t] ?? 0) - salidas.filter((s) => cuentaFuera(s.inicio, s.fin, t, p)).length);

/** Mejor inicio para una salida de `dur` minutos. Con `respetar`, solo los que no dejan ningún intervalo por debajo del requerimiento. */
function mejorHueco(
  a: Agente,
  tipo: Tipo,
  dur: number,
  idx: number,
  req: Record<number, number>,
  agentes: Agente[],
  salidas: Salida[],
  p: Parametros,
  respetar: boolean,
): { inicio: number; motivo: string } {
  const propias = salidas.filter((s) => s.agente === a.id);
  const base = holguraPorIntervalo(req, agentes, salidas, p);
  const inicios = intervalos(p);
  const fijo = tipo === 'almuerzo' && a.almuerzoFijo != null;
  const candidatos = fijo
    ? [a.almuerzoFijo as number]
    : inicios.map((t) => t + p.desfase).filter((i) => tipo === 'descanso' || (i >= p.almuerzoDesde && i <= p.almuerzoHasta));
  // Ni los descansos ni el almuerzo pueden caer pegados a la entrada o a la salida (salvo con hora fija).
  const margen = fijo ? 0 : tipo === 'almuerzo' ? p.margenAlmuerzo : p.margenDescanso;
  const enTurno = candidatos.filter((i) => i >= a.entrada + margen && i + dur <= a.salida - margen);
  // Entre dos salidas del mismo agente debe quedar al menos `separacion` minutos libres.
  let validos = enTurno.filter((i) => propias.every((s) => i >= s.fin + p.separacion || i + dur <= s.inicio - p.separacion));
  if (!enTurno.length) return { inicio: -1, motivo: 'No cabe en el turno' };
  if (!validos.length) return { inicio: -1, motivo: 'Sin espacio entre sus otras salidas' };

  // Los descansos se reparten antes y después del almuerzo: se prefiere un almuerzo que deje sitio para todos.
  const antes = Math.ceil(p.descansos / 2);
  const zonaAntes = (alm: number) => [a.entrada + p.margenDescanso, alm - p.separacion - p.descanso] as const;
  const zonaDespues = (alm: number) => [alm + p.almuerzo + p.separacion, a.salida - p.margenDescanso - p.descanso] as const;
  const caben = ([z0, z1]: readonly [number, number], m: number) => m === 0 || (z1 >= z0 && (m - 1) * (p.descanso + p.separacion) <= z1 - z0);
  if (tipo === 'almuerzo' && !fijo) {
    const conSitio = validos.filter((i) => caben(zonaAntes(i), antes) && caben(zonaDespues(i), p.descansos - antes));
    if (conSitio.length) validos = conSitio;
  }

  const almuerzoPropio = propias.find((s) => s.tipo === 'almuerzo');
  const idealDescanso = () => {
    if (!almuerzoPropio) return a.entrada + ((idx + 1) * (a.salida - a.entrada)) / (p.descansos + 1) - dur / 2;
    const enAntes = idx < antes;
    const [a0, a1] = zonaAntes(almuerzoPropio.inicio);
    const [d0, d1] = zonaDespues(almuerzoPropio.inicio);
    const usaAntes = enAntes ? a1 >= a0 : d1 < d0;
    const [z0, z1] = usaAntes ? [a0, a1] : [d0, d1];
    const k = enAntes ? idx : idx - antes;
    const m = enAntes ? antes : p.descansos - antes;
    return z0 + ((k + 1) * (z1 - z0)) / (m + 1);
  };
  const ideal =
    tipo === 'almuerzo'
      ? (Math.max(p.almuerzoDesde, a.entrada + margen) + Math.min(p.almuerzoHasta, a.salida - dur - margen)) / 2
      : idealDescanso();

  let mejor: { inicio: number; holgura: number; dist: number } | null = null;
  for (const i of validos) {
    const afectados = inicios.map((t, k) => ({ t, k })).filter(({ t }) => cuentaFuera(i, i + dur, t, p));
    const holgura = afectados.length ? Math.min(...afectados.map(({ k }) => base[k] - 1)) : 0;
    if (respetar && holgura < 0) continue;
    const dist = Math.abs(i - ideal);
    const mejorQue = !mejor || Math.min(holgura, 3) > Math.min(mejor.holgura, 3) || (Math.min(holgura, 3) === Math.min(mejor.holgura, 3) && dist < mejor.dist);
    if (mejorQue) mejor = { inicio: i, holgura, dist };
  }
  return mejor ? { inicio: mejor.inicio, motivo: '' } : { inicio: -1, motivo: 'Sin capacidad' };
}

const largo = (a: Agente) => a.salida - a.entrada;

/** Asigna sin dejar ningún intervalo por debajo del requerimiento; lo que no cabe queda pendiente con su motivo. */
export function asignar(
  req: Record<number, number>,
  agentes: Agente[],
  p: Parametros,
  previas: Salida[] = [],
  solo?: Set<number>,
): { salidas: Salida[]; pendientes: Pendiente[] } {
  const salidas: Salida[] = [...previas];
  const pendientes: Pendiente[] = [];
  const objetivo = solo ? agentes.filter((a) => solo.has(a.id)) : agentes;
  const poner = (a: Agente, tipo: Tipo, dur: number, idx: number) => {
    const r = mejorHueco(a, tipo, dur, idx, req, agentes, salidas, p, true);
    if (r.inicio >= 0) salidas.push({ id: nuevoId(), agente: a.id, tipo, inicio: r.inicio, fin: r.inicio + dur });
    else pendientes.push({ agente: a.id, tipo, motivo: r.motivo });
  };

  const porRestriccion = [...objetivo].sort((x, y) => Number(y.almuerzoFijo != null) - Number(x.almuerzoFijo != null) || largo(x) - largo(y));
  for (const a of porRestriccion) {
    const r = mejorHueco(a, 'almuerzo', p.almuerzo, 0, req, agentes, salidas, p, false);
    // Con hora fija siempre se intenta: si no cabe en el turno queda pendiente con su motivo.
    if (a.almuerzoFijo != null || r.motivo !== 'No cabe en el turno') poner(a, 'almuerzo', p.almuerzo, 0);
  }
  for (let j = 0; j < p.descansos; j++) for (const a of objetivo) poner(a, 'descanso', p.descanso, j);
  return { salidas, pendientes };
}

/** Coloca una salida pendiente en el mejor hueco, aunque deje un intervalo por debajo del requerimiento. */
export function colocarForzado(a: Agente, tipo: Tipo, req: Record<number, number>, agentes: Agente[], salidas: Salida[], p: Parametros): Salida | null {
  const dur = tipo === 'descanso' ? p.descanso : p.almuerzo;
  const idx = salidas.filter((s) => s.agente === a.id && s.tipo === 'descanso').length;
  const r = mejorHueco(a, tipo, dur, idx, req, agentes, salidas, p, false);
  return r && r.inicio >= 0 ? { id: nuevoId(), agente: a.id, tipo, inicio: r.inicio, fin: r.inicio + dur } : null;
}

/** Desplaza una salida; null si se sale del turno o choca con otra salida del mismo agente. */
export function desplazar(s: Salida, delta: number, a: Agente, salidas: Salida[]): Salida | null {
  const inicio = s.inicio + delta;
  const fin = s.fin + delta;
  if (inicio < a.entrada || fin > a.salida) return null;
  if (salidas.some((o) => o.id !== s.id && o.agente === s.agente && solape(o.inicio, o.fin, inicio, fin) > 0)) return null;
  return { ...s, inicio, fin };
}

/** Lee líneas "código, entrada, salida[, almuerzo hora]" (también separadas por tabulación o punto y coma). */
export function leerLista(texto: string): { agentes: AgenteBorrador[]; errores: string[] } {
  const agentes: AgenteBorrador[] = [];
  const errores: string[] = [];
  texto.split(/\r?\n/).forEach((linea, i) => {
    if (!linea.trim()) return;
    const n = i + 1;
    const t = linea.split(/[,;\t]+/).map((x) => x.trim()).filter(Boolean);
    if (t.length < 2) return void errores.push(`Línea ${n}: falta la hora de entrada.`);
    if (t.length < 3) return void errores.push(`Línea ${n}: falta la hora de salida.`);
    const entrada = aMinutos(t[1]);
    let salida = aMinutos(t[2]);
    if (entrada == null) return void errores.push(`Línea ${n}: la hora de entrada no se entiende.`);
    if (salida == null) return void errores.push(`Línea ${n}: la hora de salida no se entiende.`);
    if (salida <= entrada && salida < 12 * 60) salida += 12 * 60;
    if (salida <= entrada) return void errores.push(`Línea ${n}: la salida debe ser después de la entrada.`);
    let fijo: number | null = null;
    if (t[3]) {
      fijo = aMinutos(t[3].replace(/^almuerzo\s*/i, ''));
      if (fijo == null) return void errores.push(`Línea ${n}: la hora de almuerzo no se entiende.`);
      if (fijo < 6 * 60) fijo += 12 * 60;
    }
    agentes.push({ codigo: t[0], entrada, salida, almuerzoFijo: fijo });
  });
  return { agentes, errores };
}
