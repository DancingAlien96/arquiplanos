"use client";

import { useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Beneficios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Testimonios", href: "#testimonios" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 sm:px-10">
      <div className="flex items-center justify-between gap-4">
        <a href="#inicio">
          <Image src="/logo.png" alt="ArquiPlanos" width={340} height={120} className="h-20 w-auto object-contain brightness-0 invert md:h-28" priority />
        </a>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Abrir menú</span>
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="block h-[2px] w-6 rounded-full bg-white" />
            <span className="block h-[2px] w-6 rounded-full bg-white" />
            <span className="block h-[2px] w-6 rounded-full bg-white" />
          </div>
        </button>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.25em] text-white/80 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#galeria"
          className="hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20 md:inline-flex"
        >
          Ver Planos
        </a>
      </div>

      <div className={`mt-4 space-y-4 rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl md:hidden ${isOpen ? "block" : "hidden"}`}>
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
          >
            {item.label}
          </a>
        ))}
        <a
          href="#galeria"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
        >
          Ver Planos
        </a>
      </div>
    </header>
  );
}
