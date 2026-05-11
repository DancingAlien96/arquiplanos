"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Moderna", "Mediterránea", "Industrial", "Sustentable", "Montaña", "Playa"];

export default function NuevoProyectoPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim() || !price) {
      setError("Completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("price", price);
      formData.append("currency", currency);
      formData.append("features", features);
      images.forEach((img) => formData.append("images", img));

      const res = await fetch("/api/projects", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al guardar");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <a href="/admin" className="text-sm text-slate-500 hover:text-slate-800 transition">
            ← Volver
          </a>
          <h1 className="text-xl font-semibold text-slate-950">Nuevo Proyecto</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Imágenes */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-950">
              Imágenes del proyecto
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-2xl bg-slate-100 aspect-video">
                    <Image src={src} alt={`Imagen ${i + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <span className="text-2xl">📁</span>
              <span>Haz clic para seleccionar imágenes</span>
              <span className="text-xs text-slate-400">JPG, PNG, WEBP (múltiples permitidas)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleImages}
            />
          </div>

          {/* Datos básicos */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-950 mb-2">
                Nombre del proyecto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Casa Moderna Minimalista"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-950 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe las características principales del proyecto..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-950 mb-2">
                Categoría / Estilo <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-950 mb-2">
                Precio <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1299"
                  min="0"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm focus:border-slate-950 focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-950 mb-2">
                Características / Tags
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Ej: Cocina integrada, Terraza privada, Jardín"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950/10"
              />
              <p className="mt-1.5 text-xs text-slate-500">Separa cada característica con una coma</p>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <a
              href="/admin"
              className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Publicar Proyecto"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
