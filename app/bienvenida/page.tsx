"use client";
import { useSearchParams } from "next/navigation";

export default function BienvenidaPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    let message = "";
    let color = "";

    if (error === "OAuthAccountNotLinked") {
        message = "Ya existe una cuenta con este correo pero con otro método de inicio de sesión.";
        color = "text-red-500";
    } else if (error) {
        message = "Error al iniciar sesión con Google.";
        color = "text-red-500";
    } else {
        message = "¡Inicio de sesión con Google exitoso!";
        color = "text-green-600";
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
            {message && (
                <div className={`mb-4 ${color}`}>
                    {message}
                </div>
            )}
        </div>
    );
}