/** Converts a Google Drive share/view link to a direct download URL. */
export function driveToDownloadUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "drive.google.com") return url;

    const idParam = parsed.searchParams.get("id");
    if (idParam) return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(idParam)}`;

    const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(match[1])}`;
  } catch {
    // invalid URL — fall through
  }
  return url;
}
