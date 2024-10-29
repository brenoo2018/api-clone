export function normalize(text: string) {
  if (!text) return;
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase(); // Para tornar a busca case insensitive
}
