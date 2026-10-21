"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(res.status === 429 ? "Demasiados intentos. Espera unos minutos." : data.error || "Contraseña incorrecta.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-white/10 bg-white p-9">
        <div className="mb-1 font-display text-2xl font-bold uppercase text-ink">Maykar Professional Painting</div>
        <div className="mb-7 text-sm text-ink-faint">Panel de administración</div>
        <input
          type="password"
          autoFocus
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-[3px] border border-line px-4 py-3 text-[15px] outline-none focus:border-ink"
        />
        <button type="submit" className="btn-primary w-full justify-center">Entrar</button>
        {error && <div className="mt-3 text-sm font-semibold text-red-600">{error}</div>}
      </form>
    </div>
  );
}
