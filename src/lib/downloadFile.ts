export async function downloadViaSignedUrl(getUrl: () => Promise<{ url: string }>, filename: string) {
  try {
    const { url } = await getUrl();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download error:", err);
  }
}

export async function openViaSignedUrl(getUrl: () => Promise<{ url: string }>) {
  try {
    const { url } = await getUrl();
    window.open(url, "_blank");
  } catch (err) {
    console.error("Open error:", err);
  }
}