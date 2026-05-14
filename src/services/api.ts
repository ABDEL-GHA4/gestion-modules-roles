const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

type ApiErrorResponse = {
  message?: string;
};

export const apiRequest = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const data = (await response.json().catch(() => null)) as ApiErrorResponse | T | null;

  if (!response.ok) {
    const message = data && "message" in data && data.message ? data.message : "API request failed";
    throw new Error(message);
  }

  return data as T;
};
