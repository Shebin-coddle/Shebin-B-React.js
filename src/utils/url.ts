export function getReceiptUrl(link?: string | null, baseUrl: string = "") {
  if (!link) return "";

  if (link.startsWith("http")) return link;

  return `${baseUrl}${link.startsWith("/") ? "" : "/"}${link}`;
}