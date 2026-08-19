export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "Erro na requisição";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignora se não for JSON
    }
    throw new Error(errorMessage);
  }

  // Permite requisições sem retorno JSON (ex: DELETE 200 OK vazio)
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
}
