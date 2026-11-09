export interface Herramienta {
  id: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  /** Trazo SVG (viewBox 24x24) del icono del menú. */
  icono: string;
}

/** Registro de herramientas: agregar una entrada aquí y su ruta en app.routes.ts la suma al menú. */
export const HERRAMIENTAS: Herramienta[] = [
  {
    id: 'nomina',
    nombre: 'Nómina',
    descripcion: 'Horas extras, recargos y total a pagar',
    ruta: '/nomina',
    icono: 'M5 3.5h14v17l-3-2-2 2-2-2-2 2-2-2-3 2z M9 8.5h6 M9 12.5h4',
  },
  {
    id: 'descansos',
    nombre: 'Descansos y almuerzos',
    descripcion: 'Cobertura por intervalo y asignación de salidas',
    ruta: '/descansos',
    icono: 'M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  },
];
