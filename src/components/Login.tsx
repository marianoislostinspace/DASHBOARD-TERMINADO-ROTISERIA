import { useState } from "react";
import '../assets/styles/login.css'

export default function Login({ onLogin }: { onLogin: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("https://backend-crud-firebase-production.up.railway.app/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError("Credenciales inválidas");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            onLogin(); // avisamos que ya está logueado
        } catch (err) {
            setError("Error en el servidor");
        }
    };

    return (
        <div className="LoginDiv">
            <form onSubmit={handleSubmit}>
                <h2 className="titulo">Panel de Administracion</h2>

                {error && <p>{error}</p>}

                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="userInput"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="passInput"
                />

                <button
                    type="submit"
                    className="botonsuelo"
                >
                    Acceder
                </button>
            </form>
        </div>
    );
}
