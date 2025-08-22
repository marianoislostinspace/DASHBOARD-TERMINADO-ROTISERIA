const API_URL = import.meta.env.VITE_API_URL;

export const fetchApi = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  isFormData: boolean = false
) => {
  try {
    const options: RequestInit = {
      method,
      headers: isFormData
        ? {} // No se establece Content-Type si es FormData
        : { "Content-Type": "application/json" },
      body: body ? (isFormData ? body : JSON.stringify(body)) : null,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, options);

    // 📌 Agregar logs para depuración
    console.log("🔹 FETCH URL:", `${API_URL}/${endpoint}`);
    console.log("🔹 FETCH OPTIONS:", options);
    console.log("🔹 RESPONSE STATUS:", response.status);

    if (!response.ok) {
      const errorResponse = await response.text(); // Obtener el mensaje de error del servidor
      console.error("🔴 ERROR DEL SERVIDOR:", errorResponse);
      throw new Error(errorResponse || "Error en la petición");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
