export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/50257494629"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.417.638 4.683 1.752 6.647L2 30l7.583-1.726A13.934 13.934 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 25.5a11.45 11.45 0 0 1-5.83-1.593l-.418-.248-4.5 1.023 1.048-4.385-.272-.45A11.468 11.468 0 0 1 4.5 16C4.5 9.648 9.648 4.5 16 4.5S27.5 9.648 27.5 16 22.352 27.5 16 27.5Zm6.29-8.606c-.344-.172-2.038-1.005-2.354-1.12-.317-.115-.547-.172-.778.172-.23.344-.892 1.12-1.093 1.35-.2.23-.402.259-.746.086-.344-.172-1.453-.535-2.767-1.708-1.023-.912-1.714-2.038-1.914-2.382-.2-.344-.021-.53.15-.702.154-.153.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.431-.029-.603-.086-.172-.778-1.878-1.066-2.57-.28-.674-.566-.583-.778-.593l-.662-.011c-.23 0-.603.086-.919.431-.316.344-1.207 1.179-1.207 2.875s1.236 3.335 1.408 3.565c.172.23 2.432 3.714 5.891 5.208.823.355 1.465.567 1.966.726.826.262 1.578.225 2.171.137.662-.099 2.038-.833 2.326-1.637.287-.803.287-1.492.2-1.636-.086-.144-.316-.23-.66-.402Z" />
      </svg>
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
        +502 5749-4629
      </span>
    </a>
  );
}
