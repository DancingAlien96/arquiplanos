import Image from "next/image";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="relative overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fondo1.png')" }}
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
              <span className="ml-2 text-lg">→</span>
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

      <section className="relative z-10 mx-auto w-full max-w-7xl bg-white px-6 pb-20 pt-10 text-slate-950 sm:px-10">
        <div className="flex flex-col gap-10 lg:gap-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-amber-700/90">Nuestros</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                Servicios
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-700 sm:text-base">
              Ofrecemos soluciones arquitectónicas completas, desde planos personalizados hasta visualizaciones
              3D fotorrealistas. Cada proyecto es diseñado con precisión y estilo.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/50">
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <Image
                  src="/personalizados.jpg"
                  alt="Planos Personalizados"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-4 px-6 py-6 text-left">
                <p className="text-base font-semibold text-slate-950">Planos Personalizados</p>
                <p className="text-sm leading-7 text-slate-700">
                  Diseños arquitectónicos adaptados a tus necesidades específicas, terreno y presupuesto.
                  Trabajamos contigo para crear la casa perfecta.
                </p>
                <a
                  href="#"
                  className="inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Saber Más
                </a>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/50">
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <Image
                  src="/planoslistos.png"
                  alt="Planos Listos"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-4 px-6 py-6 text-left">
                <p className="text-base font-semibold text-slate-950">Planos Listos</p>
                <p className="text-sm leading-7 text-slate-700">
                  Colección de diseños pre-diseñados listos para construir. Elige entre estilos modernos,
                  mediterráneos, industriales y más.
                </p>
                <a
                  href="#"
                  className="inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Saber Más
                </a>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/50">
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <Image
                  src="/asesoria3d.jpg"
                  alt="Asesoría 3D"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-4 px-6 py-6 text-left">
                <p className="text-base font-semibold text-slate-950">Asesoría 3D</p>
                <p className="text-sm leading-7 text-slate-700">
                  Visualizaciones en 3D fotorrealistas de tu proyecto antes de construir. Recorre virtualmente
                  cada espacio y toma decisiones informadas.
                </p>
                <a
                  href="#"
                  className="inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Saber Más
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl bg-white px-6 pb-24 pt-16 text-slate-950 sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-700/90">Galería</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Galería de Proyectos
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              Explora nuestra colección de diseños arquitectónicos modernos y funcionales.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ver Todo
            <span className="ml-2 text-lg">→</span>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Todos', 'Moderna', 'Mediterránea', 'Industrial', 'Sustentable', 'Montaña', 'Playa'].map((item, index) => (
            <button
              key={item}
              className={
                index === 0
                  ? 'rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-200/20'
                  : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-4 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/40">
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <Image
                src="/fondo1.png"
                alt="Casa Moderna Minimalista"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="space-y-4 px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Casa Moderna Minimalista</h3>
                  <p className="text-sm text-slate-500">Moderna</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-950">$1299</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">USD</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Cocina integrada</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Terraza privada</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">+2</span>
              </div>
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver Detalles
              </a>
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/40">
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <Image
                src="/personalizados.jpg"
                alt="Villa Mediterránea"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="space-y-4 px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Villa Mediterránea</h3>
                  <p className="text-sm text-slate-500">Mediterránea</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-950">$1899</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">USD</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Patio central</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Bodega</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">+2</span>
              </div>
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver Detalles
              </a>
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/40">
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <Image
                src="/planoslistos.png"
                alt="Loft Industrial"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="space-y-4 px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Loft Industrial</h3>
                  <p className="text-sm text-slate-500">Industrial</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-950">$999</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">USD</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Doble altura</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Vigas expuestas</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">+2</span>
              </div>
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver Detalles
              </a>
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/40">
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <Image
                src="/asesoria3d.jpg"
                alt="Casa Sustentable"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="space-y-4 px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Casa Sustentable</h3>
                  <p className="text-sm text-slate-500">Sustentable</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-950">$1599</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">USD</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Paneles solares</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">Cisterna de agua</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">+2</span>
              </div>
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver Detalles
              </a>
            </div>
          </article>
        </div>
      </section>

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
                <span className="ml-2 text-lg">→</span>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
            <div className="relative h-80 sm:h-[36rem]">
              <Image
                src="/personalizados.jpg"
                alt="Interior arquitectónico"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
