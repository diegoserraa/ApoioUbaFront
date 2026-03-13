export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  // Só adiciona Content-Type se NÃO for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // adiciona token automaticamente se existir
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Se body for objeto normal, transforma em JSON automaticamente
  let body = options.body;
  if (
    body &&
    typeof body === "object" &&
    !(body instanceof FormData)
  ) {
    body = JSON.stringify(body);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}${endpoint}`,
    {
      ...options,
      headers,
      body,
    }
  );

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return response;
}