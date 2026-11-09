/** Libro de Excel (.xlsx) de una sola hoja, sin librerías: un zip sin comprimir con los XML mínimos. */

const enc = new TextEncoder();

const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (d: Uint8Array) => {
  let c = 0xffffffff;
  for (const b of d) c = TABLA_CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

function zip(archivos: { nombre: string; datos: Uint8Array }[]): Uint8Array {
  const locales: Uint8Array[] = [];
  const centrales: Uint8Array[] = [];
  let desplazamiento = 0;
  for (const a of archivos) {
    const nombre = enc.encode(a.nombre);
    const crc = crc32(a.datos);

    const l = new DataView(new ArrayBuffer(30));
    l.setUint32(0, 0x04034b50, true);
    l.setUint16(4, 20, true);
    l.setUint16(6, 0x0800, true);
    l.setUint16(12, 0x21, true); // 1980-01-01
    l.setUint32(14, crc, true);
    l.setUint32(18, a.datos.length, true);
    l.setUint32(22, a.datos.length, true);
    l.setUint16(26, nombre.length, true);
    locales.push(new Uint8Array(l.buffer), nombre, a.datos);

    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true);
    c.setUint16(14, 0x21, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, a.datos.length, true);
    c.setUint32(24, a.datos.length, true);
    c.setUint16(28, nombre.length, true);
    c.setUint32(42, desplazamiento, true);
    centrales.push(new Uint8Array(c.buffer), nombre);

    desplazamiento += 30 + nombre.length + a.datos.length;
  }
  const tamCentral = centrales.reduce((s, x) => s + x.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, archivos.length, true);
  fin.setUint16(10, archivos.length, true);
  fin.setUint32(12, tamCentral, true);
  fin.setUint32(16, desplazamiento, true);

  const partes = [...locales, ...centrales, new Uint8Array(fin.buffer)];
  const salida = new Uint8Array(partes.reduce((s, x) => s + x.length, 0));
  let o = 0;
  for (const p of partes) {
    salida.set(p, o);
    o += p.length;
  }
  return salida;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const columna = (i: number) => String.fromCharCode(65 + i);
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

export function crearXlsx(hoja: string, filas: (string | number)[][]): Blob {
  const columnas = Math.max(...filas.map((f) => f.length));
  const datos = filas
    .map(
      (fila, r) =>
        `<row r="${r + 1}">` +
        fila.map((v, c) => (typeof v === 'number' ? `<c r="${columna(c)}${r + 1}"><v>${v}</v></c>` : `<c r="${columna(c)}${r + 1}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`)).join('') +
        '</row>',
    )
    .join('');

  const archivos = [
    { nombre: '[Content_Types].xml', xml: `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>` },
    { nombre: '_rels/.rels', xml: `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { nombre: 'xl/workbook.xml', xml: `${XML}<workbook xmlns="${NS}" xmlns:r="${REL}"><sheets><sheet name="${esc(hoja)}" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { nombre: 'xl/_rels/workbook.xml.rels', xml: `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>` },
    { nombre: 'xl/worksheets/sheet1.xml', xml: `${XML}<worksheet xmlns="${NS}"><cols><col min="1" max="${columnas}" width="16" customWidth="1"/></cols><sheetData>${datos}</sheetData></worksheet>` },
  ].map((a) => ({ nombre: a.nombre, datos: enc.encode(a.xml) }));

  return new Blob([zip(archivos) as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
