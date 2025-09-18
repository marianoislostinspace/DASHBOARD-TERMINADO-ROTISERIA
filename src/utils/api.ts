const API_URL = import.meta.env.VITE_API_URL;

export const fetchApi = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  isFormData: boolean = false
) => {
  try {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : null,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, options);

    console.log("🔹 FETCH URL:", `${API_URL}/${endpoint}`);
    console.log("🔹 FETCH OPTIONS:", options);
    console.log("🔹 RESPONSE STATUS:", response.status);

    if (!response.ok) {
      // Manejo de expiración de token
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      const errorResponse = await response.text();
      console.error("🔴 ERROR DEL SERVIDOR:", errorResponse);
      throw new Error(errorResponse || "Error en la petición");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
