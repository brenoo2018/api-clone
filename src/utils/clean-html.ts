export const cleanHTML = (html: string) => {
  // Remove todas as tags HTML usando uma expressão regular
  const text = html.replace(/<[^>]*>/g, '');

  // Substitui entidades HTML comuns por seus equivalentes de texto
  const decodedText = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return decodedText;
}