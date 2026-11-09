/**
 * recargo: se suma solo el recargo (la hora ya está dentro del salario).
 * extra: se paga la hora completa más el recargo (queda fuera del salario).
 * incapacidad: se paga ese % de la hora y esas horas se descuentan del salario base.
 */
export type Modo = 'recargo' | 'extra' | 'incapacidad';

export interface TipoHora {
  id: string;
  nombre: string;
  ayuda: string;
  pct: number;
  modo: Modo;
  grupo: string;
}

export interface Persona {
  id: number;
  nombre: string;
  salario: number;
  /** Horas mensuales de la jornada (168): definen el valor por hora. */
  horasMes: number;
  /** Horas ordinarias trabajadas en la quincena (84 por defecto, editable). */
  horasOrd: number;
  horas: Record<string, number>;
  comision: number;
  /** Bono extralegal: pago no salarial pactado por escrito (art. 128 CST). */
  bono: number;
  /** Días de la quincena con derecho a auxilio de transporte y días que asistió. */
  diasAuxilio: number;
  diasAsistio: number;
}

export interface Linea {
  id: string;
  nombre: string;
  detalle: string;
  valor: number;
}

export interface Liquidacion {
  persona: Persona;
  valorHora: number;
  base: Linea;
  lineas: Linea[];
  comision: number;
  /** Siempre presente: vale $0 y explica por qué cuando no aplica o no asistió. */
  auxilio: Linea;
  bono: number;
  /** Todo lo que gana en la quincena, antes de deducciones. */
  devengado: number;
  /** Ingreso base de cotización de la quincena. */
  ibc: number;
  deducciones: Linea[];
  totalDeducciones: number;
  /** Neto a pagar: devengado menos deducciones. */
  total: number;
}

export interface Parametros {
  salud: number;
  pension: number;
  smmlv: number;
  auxilio: number;
}

/** Vigentes a nov-2026: aportes del trabajador, salario mínimo (Decreto 1469/2025) y auxilio de transporte (Decreto 1470/2025). Editables en pantalla. */
export const PARAMETROS: Parametros = { salud: 4, pension: 4, smmlv: 1750905, auxilio: 249095 };

/** El auxilio de transporte es para quien gana hasta 2 salarios mínimos al mes. */
export const aplicaAuxilio = (salario: number, par: Parametros) => salario > 0 && salario <= 2 * par.smmlv;

/** Fondo de solidaridad pensional (Ley 797/2003, art. 8): % sobre el IBC, según el IBC mensual en salarios mínimos. */
export function tasaSolidaridad(ibcMensual: number, smmlv: number): number {
  const r = smmlv > 0 ? ibcMensual / smmlv : 0;
  if (r < 4) return 0;
  if (r < 16) return 1;
  if (r <= 17) return 1.2;
  if (r <= 18) return 1.4;
  if (r <= 19) return 1.6;
  if (r <= 20) return 1.8;
  return 2;
}

export const GRUPOS = ['Recargos', 'Horas extras', 'Incapacidades y licencias'] as const;

// Valores vigentes a oct-2026 (Ley 2101/2021, Ley 2466/2025). Son editables en pantalla.
export const TIPOS: TipoHora[] = [
  { id: 'recNocturno', nombre: 'Recargo nocturno', ayuda: 'Entre 7 p. m. y 6 a. m.', pct: 35, modo: 'recargo', grupo: 'Recargos' },
  { id: 'domDiurno', nombre: 'Dominical / festivo diurno', ayuda: 'Vigente desde jul-2026', pct: 90, modo: 'recargo', grupo: 'Recargos' },
  { id: 'domNocturno', nombre: 'Dominical / festivo nocturno', ayuda: '90 % + 35 %', pct: 125, modo: 'recargo', grupo: 'Recargos' },
  { id: 'extDiurna', nombre: 'Extra diurna', ayuda: 'Entre 6 a. m. y 7 p. m.', pct: 25, modo: 'extra', grupo: 'Horas extras' },
  { id: 'extNocturna', nombre: 'Extra nocturna', ayuda: 'Entre 7 p. m. y 6 a. m.', pct: 75, modo: 'extra', grupo: 'Horas extras' },
  { id: 'extDomDiurna', nombre: 'Extra diurna dominical / festiva', ayuda: '90 % + 25 %', pct: 115, modo: 'extra', grupo: 'Horas extras' },
  { id: 'extDomNocturna', nombre: 'Extra nocturna dominical / festiva', ayuda: '90 % + 75 %', pct: 165, modo: 'extra', grupo: 'Horas extras' },
  { id: 'incGeneral', nombre: 'Incapacidad enfermedad general', ayuda: 'Se paga 66,67 % de la hora', pct: 66.67, modo: 'incapacidad', grupo: 'Incapacidades y licencias' },
  { id: 'incLaboral', nombre: 'Incapacidad accidente laboral', ayuda: 'ARL: se paga 100 %', pct: 100, modo: 'incapacidad', grupo: 'Incapacidades y licencias' },
  { id: 'licencia', nombre: 'Licencia maternidad / paternidad', ayuda: 'Se paga 100 %', pct: 100, modo: 'incapacidad', grupo: 'Incapacidades y licencias' },
];

/** Jornada de 42 h semanales (desde 15-jul-2026): 84 h por quincena, 168 h al mes. */
export const HORAS_QUINCENA = 84;
export const HORAS_MES = HORAS_QUINCENA * 2;

const fmtNum = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });
const fmtCop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Sin espacio tras el signo: "$2.500.000". */
export const cop = (n: number) => fmtCop.format(n).replace(/\s/g, '');
export const num = (n: number) => fmtNum.format(n);

export interface Concepto {
  id: string;
  nombre: string;
}

/** Salario base, cada tipo de hora, comisión, auxilio, bono y deducciones: lo que tiene color en la pantalla. */
export const CONCEPTOS: Concepto[] = [
  { id: 'salario', nombre: 'Salario base' },
  ...TIPOS.map((t) => ({ id: t.id, nombre: t.nombre })),
  { id: 'comision', nombre: 'Comisión' },
  { id: 'transporte', nombre: 'Auxilio de transporte' },
  { id: 'bono', nombre: 'Bono extralegal' },
  { id: 'salud', nombre: 'Salud' },
  { id: 'pension', nombre: 'Pensión' },
  { id: 'fsp', nombre: 'Fondo de solidaridad' },
];

export interface Segmento {
  id: string;
  valor: number;
}

/** Partes de lo devengado en una liquidación, en el orden de CONCEPTOS. */
export function segmentos(l: Liquidacion): Segmento[] {
  return [
    { id: 'salario', valor: l.base.valor },
    ...l.lineas.map((x) => ({ id: x.id, valor: x.valor })),
    ...(l.comision ? [{ id: 'comision', valor: l.comision }] : []),
    { id: 'transporte', valor: l.auxilio.valor },
    ...(l.bono ? [{ id: 'bono', valor: l.bono }] : []),
  ].filter((s) => s.valor > 0);
}

export function liquidar(p: Persona, pcts: Record<string, number>, par: Parametros): Liquidacion {
  const valorHora = p.horasMes > 0 ? p.salario / p.horasMes : 0;
  const lineas: Linea[] = [];
  let horasIncap = 0;

  for (const t of TIPOS) {
    const h = p.horas[t.id] ?? 0;
    if (h <= 0) continue;
    const pct = pcts[t.id] ?? t.pct;
    const factor = t.modo === 'extra' ? 1 + pct / 100 : pct / 100;
    if (t.modo === 'incapacidad') horasIncap += h;
    lineas.push({
      id: t.id,
      nombre: t.nombre,
      detalle: `${num(h)} h × ${cop(valorHora)} × ${num(factor * 100)} %`,
      valor: Math.round(h * valorHora * factor),
    });
  }

  const horasBase = Math.max(0, p.horasOrd - horasIncap);
  const base: Linea = {
    id: 'salario',
    nombre: 'Salario base',
    detalle: `${num(horasBase)} h × ${cop(valorHora)}${horasIncap ? ` (${num(p.horasOrd)} − ${num(horasIncap)} de incapacidad)` : ''}`,
    valor: Math.round(horasBase * valorHora),
  };
  const salarial = base.valor + lineas.reduce((s, l) => s + l.valor, 0) + p.comision;

  // El auxilio se paga por días: la parte de la quincena que corresponde a los días que asistió.
  const quincena = par.auxilio / 2;
  const dias = Math.min(p.diasAsistio, p.diasAuxilio);
  const auxilio: Linea = aplicaAuxilio(p.salario, par)
    ? {
        id: 'transporte',
        nombre: 'Auxilio de transporte',
        detalle: `${num(dias)} de ${num(p.diasAuxilio)} días × ${cop(quincena)}`,
        valor: p.diasAuxilio > 0 ? Math.round((quincena * dias) / p.diasAuxilio) : 0,
      }
    : { id: 'transporte', nombre: 'Auxilio de transporte', detalle: 'No aplica: gana más de 2 salarios mínimos', valor: 0 };

  // IBC: lo salarial más lo que el bono pase del 40 % de la remuneración total (Ley 1393/2010, art. 30),
  // con piso de 1 salario mínimo y techo de 25 al mes (la mitad en cada quincena). El auxilio no cotiza.
  const excedente = Math.max(0, p.bono - 0.4 * (salarial + p.bono));
  const piso = par.smmlv / 2;
  const bruto = salarial + excedente;
  const ibc = bruto > 0 ? Math.min(25 * piso, Math.max(piso, bruto)) : 0;
  const aporte = (id: string, nombre: string, pct: number): Linea => ({
    id,
    nombre,
    detalle: `${num(pct)} % de ${cop(ibc)}`,
    valor: Math.round((ibc * pct) / 100),
  });
  const deducciones = [aporte('salud', 'Salud', par.salud), aporte('pension', 'Pensión', par.pension)];
  const tasa = tasaSolidaridad(ibc * 2, par.smmlv);
  if (tasa > 0) deducciones.push(aporte('fsp', 'Fondo de solidaridad', tasa));
  const totalDeducciones = deducciones.reduce((s, d) => s + d.valor, 0);

  const devengado = salarial + auxilio.valor + p.bono;
  return {
    persona: p,
    valorHora,
    base,
    lineas,
    comision: p.comision,
    auxilio,
    bono: p.bono,
    devengado,
    ibc,
    deducciones,
    totalDeducciones,
    total: devengado - totalDeducciones,
  };
}
