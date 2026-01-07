const API_BASE = "https://watchli-api.onrender.com";
const API_URL = "${API_BASE}/api/auth";

async function parseResponse(response) {
  // Try JSON version (using clone so body isn't consumed)
  try {
    return await response.clone().json();
  } catch {
    // If JSON fails, return plain text safely
    return await response.text();
  }
}

export async function signup(email, password) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(response);

  if (response.ok) {
    localStorage.setItem("token", data.token);
    return { success: true };
  }

  return { success: false, message: data };
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(response);

  if (response.ok) {
    localStorage.setItem("token", data.token);
    return { success: true };
  }

  return { success: false, message: data };
}

export function logout() {
  localStorage.removeItem("token");

  if (window.location.pathname.includes("/html/")) {
    window.location.href = "../index.html";
  } else {
    window.location.href = "./index.html";
  }
}
