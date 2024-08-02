export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = window.localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const optionsWithAuth = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token,
    },
  };

  const response = await fetch(url, optionsWithAuth);

  // User session has expired and must login again
  if (response.status === 440) {
    window.location.href = "/suppliers/login";
    return response;
  } else {
    return response;
  }
}
