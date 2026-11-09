# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Personas que liquidan una nómina pequeña (las que necesiten, sin tope fijo) y consultan cuando quieran, sin cuenta ni inicio de sesión. Uso mixto: celular y computador. Sesiones cortas, ocasionales, cada quincena o ante una consulta puntual.

## Product Purpose
MultiHerramientas es una colección de herramientas web que se agregan a medida que se piden. Todo corre en el navegador: sin backend, sin base de datos, sin persistencia. Recargar, cambiar de herramienta o salir borra todo. La primera herramienta es Nómina: liquidación quincenal con la norma laboral colombiana (recargos, horas extras, incapacidades, comisión). Éxito: ver el total a pagar de cada persona y entender de dónde sale cada valor.

## Positioning
Calculadora de nómina quincenal colombiana que explica cada línea (tipo de hora, horas, valor) y no pide cuenta ni guarda nada.

## Operating Context
- Salario mensual por persona; valor hora = salario ÷ 168 h (jornada de 42 h semanales desde 15-jul-2026, 84 h por quincena).
- Se liquida por quincena: horas ordinarias de la quincena (84 por defecto, editables por persona) más recargos, extras, incapacidades y comisión.
- Porcentajes legales editables (ver Capabilities).

## Capabilities and Constraints
- Solo frontend (Angular 22, standalone, signals). Sin persistencia de ningún tipo.
- Menú para cambiar de herramienta; hoy solo Nómina.
- Panel editable de porcentajes: recargo nocturno 35 %, dominical/festivo diurno 90 % (desde jul-2026), dominical nocturno 125 %, extra diurna 25 %, extra nocturna 75 %, extra diurna dominical 115 %, extra nocturna dominical 165 %, incapacidad enfermedad general 66,67 %, accidente laboral 100 %, licencia 100 %.
- Modal para agregar persona: nombre, salario (valor quincenal y valor por hora al lado), horas ordinarias de la quincena, horas por tipo, ¿aplica comisión? (la comisión se pregunta a cada persona; no hay valor general)
- Una sola lista expandible por persona, con leyenda de colores y búsqueda por nombre; solo datos individuales, sin totales ni gráficas generales; cada tipo de hora resaltado con su color pastel.

## Brand Commitments
Paleta pastel, un color por concepto (salario base, cada tipo de hora, comisión). Conservar: modal de agregar, lista única expandible con leyenda, panel de porcentajes editable.

## Evidence on Hand
Sin datos reales ni clientes. Los ejemplos de personas son de prueba.

## Product Principles
1. Cada valor se explica: tipo de hora × horas × valor hora × porcentaje.
2. Nada se guarda; el estado vive solo mientras la página está abierta.
3. Funciona igual de bien en celular y en computador.
4. Cada herramienta es independiente y se puede agregar sin tocar las demás.

## Accessibility & Inclusion
Uso en celular; contraste AA, foco visible, teclado completo, respeta reducción de movimiento.
