import { authenticatedFetch } from ".";

export async function getCultivars() {
  const response = await authenticatedFetch("/api/cultivars");
  const cultivars = await response.json();

  return cultivars;
}
