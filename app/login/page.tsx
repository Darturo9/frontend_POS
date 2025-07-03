"use client"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        if (res.ok) {
            const { access_token } = await res.json()
            localStorage.setItem("token", access_token)
            window.location.href = "/"
        } else {
            setError("Credenciales incorrectas")
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Ingresar
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <div className="text-center mt-4 text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Crea una
                </Link>
            </div>
        </div>
    )
}