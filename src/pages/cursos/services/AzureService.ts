const AZURE_API_URL = "http://localhost:8083/api/azure";

export async function getSasUploadUrl(
  id_seccion: number
): Promise<{ sas_url: string; url: string }> {
  const resp = await fetch(`${AZURE_API_URL}/sas-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_seccion, tipo_contenido: "video/mp4" }),
  });
  if (!resp.ok) throw new Error("No se pudo obtener SAS URL");
  return await resp.json();
}

export async function uploadVideoToAzure(sasUrl: string, file: File) {
  const resp = await fetch(sasUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!resp.ok) throw new Error("Error al subir video a Azure");
}