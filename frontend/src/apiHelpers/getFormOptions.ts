export async function getFormOptions() {
  const response = await fetch("/api/form-options");
  const data = await response.json();

  return data;
}
