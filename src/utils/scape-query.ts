export function escapeSpecialCharacters(query: string) {
  // Coloca aspas duplas ao redor da query e escapa aspas duplas internas
  return `"${query.replace(/["]/g, '\\"')}"`;
}
