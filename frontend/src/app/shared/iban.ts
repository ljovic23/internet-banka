export function cleanIban(v: string) { return (v||'').replace(/\s+/g,'').toUpperCase(); }
export function isValidIban(raw: string) {
  const iban = cleanIban(raw);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(iban)) return false;
  const s = iban.slice(4) + iban.slice(0,4);
  let r = 0;
  for (const ch of s) {
    const v = (ch >= 'A' && ch <= 'Z') ? (ch.charCodeAt(0)-55).toString() : ch;
    for (const d of v) r = (r*10 + (d.charCodeAt(0)-48)) % 97;
  }
  return r === 1;
}
export function formatIban(raw: string) { return cleanIban(raw).replace(/(.{4})/g,'$1 ').trim(); }
