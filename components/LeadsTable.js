"use client";

import { useState } from "react";
import Link from "next/link";
import EstadoPill from "./EstadoPill";

const ESTADOS = ["todos", "nuevo", "contactado", "agendado", "cerrado"];

export default function LeadsTable({ leads }) {
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const filtrados = leads.filter((l) => {
    const pasaEstado = filtro === "todos" || l.estado === filtro;
    const pasaBusqueda =
      !busqueda ||
      l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.telefono.includes(busqueda);
    return pasaEstado && pasaBusqueda;
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                filtro === e ? "border-ink bg-ink text-white" : "border-line text-ink-faint hover:border-ink/50"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
        <input
          placeholder="Buscar por nombre o teléfono…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="ml-auto rounded-[3px] border border-line px-3.5 py-1.5 text-sm outline-none focus:border-ink"
        />
      </div>

      <div className="border border-line bg-white">
        {filtrados.length === 0 && (
          <div className="p-8 text-center text-sm text-ink-faint">No hay leads que coincidan.</div>
        )}
        {filtrados.map((l) => (
          <Link
            key={l.id}
            href={`/admin/leads/${l.id}`}
            className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 last:border-b-0 hover:bg-paper-2/50"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-bold text-ink">
                {l.nombre}
                {l.urgente && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">URGENTE</span>}
              </div>
              <div className="truncate text-xs text-ink-faint">
                {l.telefono} · {l.canalOrigen} · {new Date(l.createdAt).toLocaleString("en-US")}
              </div>
            </div>
            <EstadoPill estado={l.estado} />
          </Link>
        ))}
      </div>
    </div>
  );
}
