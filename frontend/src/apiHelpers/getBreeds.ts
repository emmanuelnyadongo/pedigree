import { authenticatedFetch } from ".";

export async function getBreeds() {
  const response = await authenticatedFetch("/api/breeds");
  const breeds = await response.json();

  return breeds;
}
