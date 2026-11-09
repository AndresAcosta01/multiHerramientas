import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import {
  Agente,
  AgenteBorrador,
  DIAS,
  Dia,
  PARAMETROS,
  PASO,
  Parametros,
  Pendiente,
  Salida,
  Tipo,
  aMinutos,
  asignar,
  cobertura,
  colocarForzado,
  desplazar,
  hhmm,
  hora,
  leerLista,
  nuevoId,
} from './descansos.calc';
import { crearXlsx } from './xlsx';

interface DiaDatos {
  req: Record<number, number>;
  agentes: Agente[];
  salidas: Salida[];
  pendientes: Pendiente[];
}

type Tabla = Record<Dia, DiaDatos>;

const vacio = (): DiaDatos => ({ req: {}, agentes: [], salidas: [], pendientes: [] });
const tablaVacia = () => Object.fromEntries(DIAS.map((d) => [d, vacio()])) as Tabla;

/** Todo el estado vive en esta instancia: al recargar o cambiar de herramienta se destruye. No se guarda nada. */
@Component({
  selector: 'app-descansos',
  templateUrl: './descansos.html',
  styleUrl: './descansos.css',
})
export class Descansos {
  protected readonly DIAS = DIAS;
  protected readonly hora = hora;
  protected readonly hhmm = hhmm;

  protected readonly dia = signal<Dia>('Lun');
  protected readonly pestana = signal<'cobertura' | 'agentes'>('cobertura');
  protected readonly paramAbierto = signal(false);
  protected readonly p = signal<Parametros>({ ...PARAMETROS });
  private readonly datos = signal<Tabla>(tablaVacia());
  protected readonly seleccion = signal<number | null>(null);
  protected readonly aviso = signal<{ texto: string; deshacer?: () => void } | null>(null);
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  protected readonly actual = computed(() => this.datos()[this.dia()]);
  protected readonly filas = computed(() => cobertura(this.actual().req, this.actual().agentes, this.actual().salidas, this.p()));
  protected readonly conteo = computed(() => {
    const f = this.filas();
    return {
      deficit: f.filter((x) => x.estado === 'Déficit').length,
      revisar: f.filter((x) => x.estado === 'Revisar').length,
      cumple: f.filter((x) => x.estado === 'Cumple').length,
    };
  });
  protected readonly resumen = computed(() => `Descanso ${this.p().descanso} min · Almuerzo ${this.p().almuerzo} min`);

  /** Posición horizontal (%) de un minuto del día dentro de la ventana de operación. */
  protected pos = (m: number) => ((m - this.p().desde) / (this.p().hasta - this.p().desde)) * 100;
  protected ancho = (ini: number, fin: number) => ((fin - ini) / (this.p().hasta - this.p().desde)) * 100;
  protected readonly eje = computed(() => {
    const { desde, hasta } = this.p();
    const r: { h: number; left: number }[] = [];
    for (let h = Math.ceil(desde / 60); h * 60 < hasta; h++) r.push({ h: h % 12 === 0 ? 12 : h % 12, left: this.pos(h * 60) });
    return r;
  });

  protected readonly agentes = computed(() =>
    this.actual().agentes.map((a) => ({
      a,
      turno: `${hora(a.entrada)} – ${hora(a.salida)}`,
      salidas: this.actual().salidas.filter((s) => s.agente === a.id).sort((x, y) => x.inicio - y.inicio),
      pendientes: this.actual().pendientes.filter((pd) => pd.agente === a.id),
    })).map((x) => ({
      ...x,
      resumen: x.salidas.length
        ? x.salidas.map((s) => `${s.tipo === 'descanso' ? 'Descanso' : 'Almuerzo'} ${hora(s.inicio)}`).join(' · ')
        : 'Sin descansos todavía. Usa "+ Descanso" o "Asignar descansos".',
    })),
  );

  protected readonly sel = computed(() => {
    const id = this.seleccion();
    const s = this.actual().salidas.find((x) => x.id === id);
    if (!s) return null;
    const a = this.actual().agentes.find((x) => x.id === s.agente);
    if (!a) return null;
    const salidas = this.actual().salidas;
    return { s, a, antes: desplazar(s, -PASO, a, salidas), despues: desplazar(s, PASO, a, salidas) };
  });

  private readonly dlgAgente = viewChild.required<ElementRef<HTMLDialogElement>>('dlgAgente');
  private readonly dlgLista = viewChild.required<ElementRef<HTMLDialogElement>>('dlgLista');

  // Borrador del modal de agente
  protected readonly agCodigo = signal('');
  protected readonly agEntrada = signal(6 * 60);
  protected readonly agSalida = signal(15 * 60);
  protected readonly agFijo = signal(false);
  protected readonly agFijoHora = signal(13 * 60);
  protected readonly intento = signal(false);
  protected readonly errorAgente = computed(() => {
    if (this.agSalida() <= this.agEntrada()) return 'La salida debe ser después de la entrada.';
    if (this.agFijo() && (this.agFijoHora() < this.agEntrada() || this.agFijoHora() + this.p().almuerzo > this.agSalida())) return 'El almuerzo fijo debe caber dentro del turno.';
    return '';
  });
  protected readonly resumenAgente = computed(() => {
    const horas = (this.agSalida() - this.agEntrada()) / 60;
    const { descansos, descanso, almuerzo } = this.p();
    return `Turno de ${horas.toLocaleString('es-CO', { maximumFractionDigits: 1 })} horas: ${descansos} descansos de ${descanso} min y 1 almuerzo de ${almuerzo} min.`;
  });

  // Modal de lista
  protected readonly texto = signal('');
  protected readonly lectura = computed(() => leerLista(this.texto()));

  protected setDia(d: Dia) {
    this.dia.set(d);
    this.seleccion.set(null);
  }

  protected setReq(inicio: number, ev: Event) {
    const n = Math.max(0, Math.floor(parseFloat((ev.target as HTMLInputElement).value) || 0));
    this.cambiar((d) => ({ ...d, req: { ...d.req, [inicio]: n } }));
  }

  protected setNum(clave: 'desfase' | 'descanso' | 'descansos' | 'almuerzo' | 'minFuera' | 'separacion' | 'margenDescanso' | 'margenAlmuerzo', ev: Event) {
    const n = Math.max(0, parseFloat((ev.target as HTMLInputElement).value) || 0);
    this.p.update((p) => ({ ...p, [clave]: n }));
  }

  protected setHora(clave: 'almuerzoDesde' | 'almuerzoHasta' | 'desde' | 'hasta', ev: Event) {
    const m = aMinutos((ev.target as HTMLInputElement).value);
    if (m == null) return;
    this.p.update((p) => ({ ...p, [clave]: m }));
  }

  private cambiar(fn: (d: DiaDatos) => DiaDatos) {
    const dia = this.dia();
    this.datos.update((t) => ({ ...t, [dia]: fn(t[dia]) }));
  }

  protected asignar() {
    const d = this.actual();
    if (!d.agentes.length) {
      this.pestana.set('agentes');
      return this.avisar('Primero agrega agentes en la pestaña "Por agente".');
    }
    const r = asignar(d.req, d.agentes, this.p());
    this.cambiar((x) => ({ ...x, salidas: r.salidas, pendientes: r.pendientes }));
    this.seleccion.set(null);
    this.pestana.set('agentes');
    this.avisar(r.pendientes.length ? `Asignado. Quedaron ${r.pendientes.length} salidas sin asignar: sin capacidad o fuera del turno.` : 'Asignado: todos los descansos y almuerzos caben.');
  }

  // Selección y ajuste manual
  protected seleccionar(id: number) {
    this.seleccion.update((x) => (x === id ? null : id));
  }

  protected mover(delta: number) {
    const v = this.sel();
    const n = v && desplazar(v.s, delta, v.a, this.actual().salidas);
    if (!n) return;
    this.cambiar((d) => ({ ...d, salidas: d.salidas.map((s) => (s.id === n.id ? n : s)) }));
  }

  protected quitarSalida() {
    const id = this.seleccion();
    if (id == null) return;
    this.cambiar((d) => ({ ...d, salidas: d.salidas.filter((s) => s.id !== id) }));
    this.seleccion.set(null);
  }

  protected asignarPendiente(pd: Pendiente) {
    const d = this.actual();
    const a = d.agentes.find((x) => x.id === pd.agente);
    const s = a && colocarForzado(a, pd.tipo, d.req, d.agentes, d.salidas, this.p());
    if (!s) return this.avisar('No cabe dentro del turno de ese agente.');
    this.cambiar((x) => ({ ...x, salidas: [...x.salidas, s], pendientes: x.pendientes.filter((y) => y !== pd) }));
    this.seleccion.set(s.id);
  }

  protected quitarAgente(id: number) {
    this.cambiar((d) => ({
      ...d,
      agentes: d.agentes.filter((a) => a.id !== id),
      salidas: d.salidas.filter((s) => s.agente !== id),
      pendientes: d.pendientes.filter((pd) => pd.agente !== id),
    }));
  }

  // Modal de agente
  protected abrirAgente() {
    const { desde } = this.p();
    this.agCodigo.set('');
    this.agEntrada.set(desde);
    this.agSalida.set(desde + 9 * 60);
    this.agFijo.set(false);
    this.agFijoHora.set(13 * 60);
    this.intento.set(false);
    this.dlgAgente().nativeElement.showModal();
  }

  protected guardarAgente(ev: Event) {
    ev.preventDefault();
    this.intento.set(true);
    if (this.errorAgente()) return;
    this.sumar([{ codigo: this.agCodigo().trim(), entrada: this.agEntrada(), salida: this.agSalida(), almuerzoFijo: this.agFijo() ? this.agFijoHora() : null }]);
    this.dlgAgente().nativeElement.close();
  }

  protected abrirLista() {
    this.texto.set('');
    this.dlgLista().nativeElement.showModal();
  }

  protected guardarLista(ev: Event) {
    ev.preventDefault();
    const { agentes } = this.lectura();
    if (!agentes.length) return;
    this.sumar(agentes);
    this.dlgLista().nativeElement.close();
  }

  /** Agrega los agentes y les asigna al instante sus descansos y almuerzo, sin tocar lo ya asignado. */
  private sumar(nuevos: AgenteBorrador[]) {
    this.cambiar((d) => {
      const lista = [...d.agentes];
      const ids = new Set<number>();
      for (const n of nuevos) {
        const a = { id: nuevoId(), ...n, codigo: n.codigo || `A-${String(lista.length + 1).padStart(2, '0')}` }; // taste-skill-ignore: código de agente, no numeración
        ids.add(a.id);
        lista.push(a);
      }
      const r = asignar(d.req, lista, this.p(), d.salidas, ids);
      return { ...d, agentes: lista, salidas: r.salidas, pendientes: [...d.pendientes, ...r.pendientes] };
    });
    this.avisar(nuevos.length === 1 ? 'Agente agregado con sus descansos y almuerzo.' : `${nuevos.length} agentes agregados con sus descansos y almuerzos.`);
  }

  /** Pone un descanso o un almuerzo más a un agente, en el mejor hueco libre de su turno. */
  protected agregarSalida(id: number, tipo: Tipo) {
    const d = this.actual();
    const a = d.agentes.find((x) => x.id === id);
    const s = a && colocarForzado(a, tipo, d.req, d.agentes, d.salidas, this.p());
    if (!s) return this.avisar('No hay espacio libre dentro del turno de ese agente.');
    this.cambiar((x) => ({ ...x, salidas: [...x.salidas, s] }));
    this.seleccion.set(s.id);
  }

  protected cerrar(dlg: HTMLDialogElement) {
    dlg.close();
  }

  protected alFondo(ev: MouseEvent, dlg: HTMLDialogElement) {
    if (ev.target === dlg) dlg.close();
  }

  /** Minutos de un campo de hora del navegador; 0 si está vacío. */
  protected minutos(ev: Event) {
    return aMinutos((ev.target as HTMLInputElement).value) ?? 0;
  }

  // Copiar a otros días, con deshacer
  protected copiarADias() {
    const anterior = this.datos();
    const origen = anterior[this.dia()];
    this.datos.set(Object.fromEntries(DIAS.map((d) => [d, d === this.dia() ? origen : structuredClone(origen)])) as Tabla);
    this.avisar(`Copiado a los otros ${DIAS.length - 1} días.`, () => this.datos.set(anterior));
  }

  // Exportar
  private tabla(): (string | number)[][] {
    if (this.pestana() === 'cobertura') {
      return [
        ['Hora', 'Requeridos', 'Conectados', 'En descanso', 'En almuerzo', 'Disponibles', 'Puede salir', 'Estado'],
        ...this.filas().map((f) => [hora(f.inicio), f.req, f.conectados, f.descanso, f.almuerzo, f.disponibles, f.puedeSalir, f.estado ?? '']),
      ];
    }
    return [
      ['Agente', 'Entrada', 'Salida', 'Descanso 1', 'Descanso 2', 'Descanso 3', 'Almuerzo', 'Sin asignar'],
      ...this.agentes().map(({ a, salidas, pendientes }) => {
        const d = salidas.filter((s) => s.tipo === 'descanso').map((s) => hora(s.inicio));
        const alm = salidas.find((s) => s.tipo === 'almuerzo');
        return [a.codigo, hora(a.entrada), hora(a.salida), d[0] ?? '', d[1] ?? '', d[2] ?? '', alm ? hora(alm.inicio) : '', pendientes.map((x) => x.tipo).join(' y ')];
      }),
    ];
  }

  protected async copiar() {
    const tsv = this.tabla().map((f) => f.join('\t')).join('\n');
    try {
      await navigator.clipboard.writeText(tsv);
      this.avisar('Copiado. Pégalo en Excel.');
    } catch {
      this.avisar('El navegador no permitió copiar. Usa "Descargar Excel".');
    }
  }

  protected descargar() {
    const cobertura = this.pestana() === 'cobertura';
    const url = URL.createObjectURL(crearXlsx(cobertura ? 'Cobertura' : 'Por agente', this.tabla()));
    const a = document.createElement('a');
    a.href = url;
    a.download = `descansos-${this.dia().toLowerCase()}-${cobertura ? 'cobertura' : 'agentes'}.xlsx`;
    document.body.append(a);
    a.click();
    a.remove();
    // Liberar el archivo de inmediato hace que el navegador lo guarde sin nombre ni extensión.
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  protected avisar(texto: string, deshacer?: () => void) {
    this.aviso.set({ texto, deshacer });
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.aviso.set(null), deshacer ? 6000 : 4000);
  }

  protected deshacerAviso() {
    this.aviso()?.deshacer?.();
    this.aviso.set(null);
    clearTimeout(this.temporizador);
  }
}
