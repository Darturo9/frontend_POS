"use client"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [repeatError, setRepeatError] = useState("")
    const [googleMessage, setGoogleMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Expresión regular: mínimo 1 mayúscula, 1 minúscula, 1 número, 1 signo especial, mínimo 8 caracteres
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    useEffect(() => {
        const error = searchParams.get("error");
        const success = searchParams.get("success");
        if (error === "OAuthAccountNotLinked") {
            setGoogleMessage("Ya existe una cuenta con este correo pero con otro método de inicio de sesión.");
        } else if (error) {
            setGoogleMessage("Error al registrarse con Google.");
        } else if (success) {
            setGoogleMessage("¡Registro con Google exitoso!");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setPasswordError("")
        setRepeatError("")

        if (!passwordRegex.test(password)) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un signo especial.")
            return;
        }
        if (password !== repeatPassword) {
            setRepeatError("Las contraseñas no coinciden.")
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username, role: "client" }),
            })
            if (res.ok) {
                setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.")
                setEmail("")
                setPassword("")
                setRepeatPassword("")
                setUsername("")
                router.push("/"); // Redirige a la pantalla principal (store)
            } else {
                let msg = "No se pudo registrar. Intenta con otro correo o usuario.";
                try {
                    const data = await res.json();
                    if (data.message) msg = data.message;
                } catch { }
                setError(msg);
            }
        } catch (err) {
            setError("Error de red: " + (err instanceof Error ? err.message : String(err)));
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="p-2 border rounded w-full pr-10"
                        required
                    />
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-500"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>
                <div className="relative">
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        placeholder="Repite la contraseña"
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
                        className="p-2 border rounded w-full pr-10"
                        required
                    />
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-500"
                        onClick={() => setShowRepeatPassword((v) => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label={showRepeatPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showRepeatPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                {repeatError && <p className="text-red-500 text-sm">{repeatError}</p>}
                <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Registrarse
                </button>
                <div className="flex justify-center my-2">o</div>
                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/bienvenida?success=1" })}
                    className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 w-full"
                >
                    <FcGoogle className="text-xl" />
                    Registrarse con Google
                </button>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}
                {googleMessage && (
                    <div className={`my-2 text-center ${googleMessage.includes("exitoso") ? "text-green-600" : "text-red-500"}`}>
                        {googleMessage}
                    </div>
                )}
            </form>
            <div className="text-center mt-4 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Inicia sesión
                </Link>
            </div>
        </div>
    )
}