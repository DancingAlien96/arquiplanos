// ISR: la página se sirve pre-renderizada (rápida como estática) y se
// regenera en segundo plano cada 60s para reflejar cambios del admin.
export const revalidate = 60;

import Image from "next/image";
import Header from "./components/Header";
import GallerySection from "./components/GallerySection";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { ArrowRight, PenLine, Download, BookOpen, SlidersHorizontal } from "lucide-react";

export default async function Home() {
  await connectDB();
  const projectDocs = await Project.find().sort({ createdAt: -1 }).lean();
  // Serializar para pasar como props al cliente
  const projects = JSON.parse(JSON.stringify(projectDocs));

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div id="inicio" className="relative overflow-hidden bg-black text-white">
        <Image
          src="/fondo1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-black/55" />

        <Header />

        <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            Diseña la <span className="italic text-amber-100">Casa</span> de tus Sueños
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
            Planos arquitectónicos modernos listos para construir. Diseños funcionales,
            elegantes y adaptados a tu estilo de vida.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
            >
              Explorar Colección
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Conocer Servicios
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-4 text-center text-sm sm:grid-cols-3">
          <div className="rounded-3xl border border-white/15 bg-white/10 px-6 py-6 backdrop-blur-md">
            <div className="text-3xl font-semibold text-white">200+</div>
            <div className="mt-2 text-white/70">Planos Vendidos</div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-6 py-6 backdrop-blur-md">
            <div className="text-3xl font-semibold text-white">50+</div>
            <div className="mt-2 text-white/70">Diseños Únicos</div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-6 py-6 backdrop-blur-md">
            <div className="text-3xl font-semibold text-white">98%</div>
            <div className="mt-2 text-white/70">Clientes Felices</div>
          </div>
        </div>
      </main>
      <div className="relative z-10 pb-8">
        <div className="mx-auto flex w-full max-w-7xl justify-center">
          <div className="flex h-14 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[10px] uppercase tracking-[0.3em] text-white/80">
            Scroll
          </div>
        </div>
      </div>
    </div>

      <section id="servicios" className="relative z-10 mx-auto w-full max-w-7xl bg-white px-6 pb-20 pt-16 text-slate-950 sm:px-10">
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-amber-700/90">Nuestros beneficios</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              ¿Por qué elegir nuestros planos?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="flex items-start gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg shadow-slate-200/50 transition hover:shadow-slate-200">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                <PenLine className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-950">Diseños profesionales</p>
                <p className="text-sm leading-7 text-slate-600">
                  Planos arquitectónicos funcionales elaborados con precisión técnica y medidas detalladas listas para construir.
                </p>
              </div>
            </article>

            <article className="flex items-start gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg shadow-slate-200/50 transition hover:shadow-slate-200">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                <Download className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-950">Descarga inmediata</p>
                <p className="text-sm leading-7 text-slate-600">
                  Recibe tus planos al instante en formato digital. Sin esperas, disponibles desde el momento de tu compra.
                </p>
              </div>
            </article>

            <article className="flex items-start gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg shadow-slate-200/50 transition hover:shadow-slate-200">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-950">Fáciles de entender</p>
                <p className="text-sm leading-7 text-slate-600">
                  Cada plano incluye nombres de espacios, dimensiones claras y especificaciones técnicas comprensibles para todos.
                </p>
              </div>
            </article>

            <article className="flex items-start gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg shadow-slate-200/50 transition hover:shadow-slate-200">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-950">Personalización</p>
                <p className="text-sm leading-7 text-slate-600">
                  Adaptamos cualquier plano a tus necesidades, terreno y presupuesto para que sea exactamente lo que imaginas.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div id="galeria">
        <GallerySection projects={projects} />
      </div>

      <section className="mx-auto w-full max-w-7xl bg-slate-950 px-6 py-20 text-white sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8 lg:max-w-xl">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80">
              Sobre Nosotros
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Arquitectura que transforma espacios
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Con más de 10 años de experiencia en diseño arquitectónico, hemos ayudado a cientos de familias a construir sus hogares ideales. Nuestro equipo de arquitectos apasionados combina funcionalidad con estética en cada diseño.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <div>
                <p className="text-5xl font-semibold text-white">200+</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Proyectos completados con éxito</p>
                <p className="mt-2 max-w-xs text-sm text-slate-500">En más de 15 países alrededor del mundo</p>
              </div>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Conocer Más
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
            <div className="relative h-80 sm:h-[36rem]">
              <Image
                src="/personalizados.jpg"
                alt="Interior arquitectónico"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="testimonios" className="mx-auto w-full max-w-7xl bg-slate-50 px-6 pb-24 pt-16 text-slate-950 sm:px-10">
        <div className="flex flex-col gap-6 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white">
            Testimonios
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Conoce las experiencias de quienes ya confiaron en ArquiPlanos para construir proyectos excepcionales.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-950">
                CM
              </div>
              <div>
                <p className="font-semibold text-slate-950">Carlos Mendoza</p>
                <p className="text-sm text-slate-500">Constructor Independiente</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-amber-500">
              {'★★★★★'.split('').map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              "Los planos de ArquiPlanos son excepcionales. La calidad del diseño y la precisión técnica me han ahorrado semanas de trabajo. Mis clientes quedan encantados con los resultados finales."
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-950">
                MF
              </div>
              <div>
                <p className="font-semibold text-slate-950">María Fernández</p>
                <p className="text-sm text-slate-500">Diseñadora de Interiores</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-amber-500">
              {'★★★★★'.split('').map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              "Como profesional del diseño, valoro la atención al detalle en cada plano. Los espacios están perfectamente distribuidos y la documentación es completa y fácil de seguir."
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40 md:col-span-2">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_0.95fr] lg:items-center">
              <div className="overflow-hidden rounded-[2rem] bg-slate-100">
                <div className="relative h-64 w-full">
                  <Image
                    src="/fondo1.png"
                    alt="Cliente satisfecho"
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Roberto Silva</p>
                <p className="text-sm text-slate-500">Propietario de Vivienda</p>
                <div className="mt-4 flex items-center gap-1 text-amber-500">
                  {'★★★★★'.split('').map((star, index) => (
                    <span key={index}>{star}</span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-slate-600">
                  "Compré el plano de la Casa Moderna Minimalista y fue la mejor decisión. El proceso de construcción fue fluido, gracias a la claridad de los planos. Mi casa quedó tal como la imaginé."
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>


      <footer className="mx-auto w-full max-w-7xl px-6 pb-16 pt-14 text-slate-700 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-950">ArquiPlanos</h3>
            <p className="max-w-sm text-sm leading-7 text-slate-600">
              Diseños arquitectónicos modernos y funcionales para construir la casa de tus sueños.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">IG</a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">FB</a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">IN</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="transition hover:text-slate-950">Sobre Nosotros</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Nuestro Equipo</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Carreras</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Blog</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950">Servicios</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="transition hover:text-slate-950">Planos Personalizados</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Planos Listos</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Asesoría 3D</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Consultoría</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-950">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="/terminos" className="transition hover:text-slate-950">Términos de Servicio</a></li>
              <li><a href="/privacidad" className="transition hover:text-slate-950">Política de Privacidad</a></li>
              <li><a href="#" className="transition hover:text-slate-950">Licencias</a></li>
              <li><a href="/admin/login" className="transition hover:text-slate-950">Iniciar Sesión</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ArquiPlanos. Todos los derechos reservados.</p>
          <p>Diseños arquitectónicos de calidad para todo el mundo.</p>
        </div>
      </footer>

    </div>
  );
}
