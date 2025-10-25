export function generateFormData(data: Record<string, string | Blob>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));

  return formData;
}
