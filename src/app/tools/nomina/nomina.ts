import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import {
  CONCEPTOS,
  HORAS_MES,
  HORAS_QUINCENA,
  Liquidacion,
  PARAMETROS,
  Parametros,
  Persona,
  TIPOS,
  aplicaAuxilio,
  cop,
  liquidar,
  num,
  segmentos,
} from './nomina.calc';

const sinTildes = (t: string) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Todo el estado vive en esta instancia: al recargar o cambiar de herramienta se destruye. */
@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.html',
  styleUrl: './nomina.css',
})
export class Nomina {
  protected readonly cop = cop;
  protected readonly num = num;
  protected readonly tipos = TIPOS;

  protected readonly pcts = signal<Record<string, number>>(
    Object.fromEntries(TIPOS.map((t) => [t.id, t.pct])),
  );

  /** Aportes del trabajador, salario mínimo y auxilio de transporte: editables. */
  protected readonly parametros = signal<Parametros>({ ...PARAMETROS });

  protected readonly personas = signal<Persona[]>([]);
  protected readonly abiertas = signal<ReadonlySet<number>>(new Set());
  protected readonly saliendo = signal<number | null>(null);
  protected readonly filtro = signal('');
  /** Concepto resaltado desde la leyenda (hover, foco o clic). */
  private readonly sobre = signal<string | null>(null);
  private readonly fijado = signal<string | null>(null);
  protected readonly resaltado = computed(() => this.sobre() ?? this.fijado());
  protected readonly deshacer = signal<{ persona: Persona; indice: number } | null>(null);

  private readonly todas = computed(() => this.personas().map((p) => liquidar(p, this.pcts(), this.parametros())));
  /** Personas que coinciden con lo escrito en la búsqueda. */
  protected readonly liquidaciones = computed(() => {
    const q = sinTildes(this.filtro().trim());
    return q ? this.todas().filter((l) => sinTildes(l.persona.nombre).includes(q)) : this.todas();
  });

  /** Colores que hay en pantalla, para la leyenda. */
  protected readonly leyenda = computed(() => {
    const ids = new Set<string>();
    for (const l of this.liquidaciones()) {
      for (const s of segmentos(l)) ids.add(s.id);
      ids.add('transporte');
      for (const d of l.deducciones) ids.add(d.id);
    }
    return CONCEPTOS.filter((c) => ids.has(c.id));
  });

  // Borrador del modal
  protected readonly nombre = signal('');
  protected readonly salario = signal(0);
  protected readonly horasOrd = signal(HORAS_QUINCENA);
  protected readonly horas = signal<Record<string, number>>({});
  protected readonly aplicaComision = signal(false);
  protected readonly comision = signal(0);
  protected readonly aplicaBono = signal(false);
  protected readonly bono = signal(0);
  protected readonly diasAuxilio = signal(15);
  protected readonly diasAsistio = signal(15);
  protected readonly intento = signal(false);

  private readonly borrador = computed<Persona>(() => ({
    id: 0,
    nombre: this.nombre(),
    salario: this.salario(),
    horasMes: HORAS_MES,
    horasOrd: this.horasOrd(),
    horas: this.horas(),
    comision: this.aplicaComision() ? this.comision() : 0,
    bono: this.aplicaBono() ? this.bono() : 0,
    diasAuxilio: this.diasAuxilio(),
    diasAsistio: this.diasAsistio(),
  }));
  protected readonly vistaPrevia = computed(() => liquidar(this.borrador(), this.pcts(), this.parametros()));
  protected readonly muestraAuxilio = computed(() => aplicaAuxilio(this.salario(), this.parametros()));
  protected readonly valorQuincenal = computed(() => Math.round(this.salario() / 2));

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly campoNombre = viewChild<ElementRef<HTMLInputElement>>('campoNombre');
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');
  private siguienteId = 1;
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  /** Deja solo dígitos, los muestra con separador de miles y devuelve el número. */
  protected moneda(ev: Event): number {
    const el = ev.target as HTMLInputElement;
    const n = Number(el.value.replace(/\D/g, ''));
    el.value = n ? n.toLocaleString('es-CO') : '';
    return n;
  }

  protected decimal(ev: Event): number {
    const n = parseFloat((ev.target as HTMLInputElement).value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  protected setPct(id: string, ev: Event) {
    this.pcts.update((p) => ({ ...p, [id]: this.decimal(ev) }));
  }

  protected setHoras(id: string, ev: Event) {
    this.horas.update((h) => ({ ...h, [id]: this.decimal(ev) }));
  }

  protected setParametro(clave: keyof Parametros, ev: Event, dinero = false) {
    const valor = dinero ? this.moneda(ev) : this.decimal(ev);
    this.parametros.update((p) => ({ ...p, [clave]: valor }));
  }

  protected abrir() {
    this.nombre.set('');
    this.salario.set(0);
    this.horasOrd.set(HORAS_QUINCENA);
    this.horas.set({});
    this.aplicaComision.set(false);
    this.comision.set(0);
    this.aplicaBono.set(false);
    this.bono.set(0);
    this.diasAuxilio.set(15);
    this.diasAsistio.set(15);
    this.intento.set(false);
    this.dialogo().nativeElement.showModal();
    this.campoNombre()?.nativeElement.focus();
  }

  protected cerrar() {
    this.dialogo().nativeElement.close();
  }

  protected alFondo(ev: MouseEvent) {
    if (ev.target === this.dialogo().nativeElement) this.cerrar();
  }

  protected guardar(ev: Event) {
    ev.preventDefault();
    this.intento.set(true);
    if (!this.nombre().trim() || this.salario() <= 0) return;

    const p = { ...this.borrador(), id: this.siguienteId++, nombre: this.nombre().trim() };
    this.personas.update((l) => [...l, p]);
    this.filtro.set('');
    this.cerrar();
  }

  protected alternar(id: number) {
    this.abiertas.update((s) => {
      const n = new Set(s);
      if (!n.delete(id)) n.add(id);
      return n;
    });
  }

  protected alternarTodo() {
    const visibles = this.liquidaciones().map((l) => l.persona.id);
    const todas = visibles.every((id) => this.abiertas().has(id));
    this.abiertas.set(todas ? new Set() : new Set(visibles));
  }

  protected todasAbiertas(): boolean {
    const v = this.liquidaciones();
    return v.length > 0 && v.every((l) => this.abiertas().has(l.persona.id));
  }

  protected quitar(id: number) {
    const indice = this.personas().findIndex((p) => p.id === id);
    if (indice < 0) return;
    const persona = this.personas()[indice];
    this.saliendo.set(id);
    setTimeout(() => {
      this.personas.update((l) => l.filter((p) => p.id !== id));
      this.saliendo.set(null);
      this.deshacer.set({ persona, indice });
      clearTimeout(this.temporizador);
      this.temporizador = setTimeout(() => this.deshacer.set(null), 6000);
    }, 200);
  }

  protected restaurar() {
    const d = this.deshacer();
    if (!d) return;
    this.personas.update((l) => {
      const n = [...l];
      n.splice(Math.min(d.indice, n.length), 0, d.persona);
      return n;
    });
    this.deshacer.set(null);
    clearTimeout(this.temporizador);
  }

  /** En celular y tablet el panel queda debajo de la lista: este acceso baja hasta él. */
  protected irAPorcentajes() {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rail().nativeElement.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
  }

  /** Ratón o teclado resaltan de forma temporal; el toque táctil solo fija con clic. */
  protected resaltar(id: string | null, ev?: PointerEvent) {
    if (ev && ev.pointerType !== 'mouse') return;
    this.sobre.set(id);
  }

  protected fijar(id: string) {
    this.fijado.update((r) => (r === id ? null : id));
  }

  protected segs(l: Liquidacion) {
    return segmentos(l);
  }
}
