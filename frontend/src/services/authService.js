const API_URL = "http://localhost:8080/api/auth";

export async function registrarUsuario(registerRequest) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerRequest),
  });

  if (!response.ok) {
    throw new Error("No se pudo completar el registro");
  }

  return response;
}

export async function loginUsuario(credenciales) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });

  if (!response.ok) {
    throw new Error("Email o contraseña incorrectos");
  }

  return response.text();
}