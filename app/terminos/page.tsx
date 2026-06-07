import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Servicio | ArquiPlanos",
  description: "Términos y condiciones para la compra y uso de planos arquitectónicos de ArquiPlanos.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white px-6 py-4 sm:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-950">
            ArquiPlanos
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <div className="space-y-2 mb-12">
          <p className="text-sm uppercase tracking-widest text-amber-700/90">Legal</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Términos de Servicio</h1>
          <p className="text-sm text-slate-500 mt-3">Última actualización: mayo de 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-10 text-sm leading-7 text-slate-700">

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">1. Aceptación de los términos</h2>
            <p>
              Al acceder y realizar una compra en ArquiPlanos, usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice nuestros servicios ni realice ninguna compra.
            </p>
            <p>
              ArquiPlanos se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor a partir de su publicación en este sitio. El uso continuado del servicio después de dichas modificaciones constituye la aceptación de los nuevos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">2. Descripción del servicio</h2>
            <p>
              ArquiPlanos comercializa planos arquitectónicos digitales en formato PDF y/o DWG para uso en proyectos de construcción residencial. Los planos incluyen: plantas arquitectónicas, cortes, alzados, detalles constructivos y especificaciones técnicas, según el paquete adquirido.
            </p>
            <p>
              Los diseños son creados por arquitectos certificados y sirven como base de referencia para la construcción. ArquiPlanos no presta servicios de dirección de obra, inspección, supervisión ni gestión de licencias de construcción.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">3. Licencia de uso</h2>
            <p>
              Al adquirir un plano, usted obtiene una <strong>licencia personal, no exclusiva e intransferible</strong> para construir el diseño una sola vez en un único terreno de su propiedad o bajo su autorización legal. Esta licencia no le otorga derechos de propiedad intelectual sobre el diseño.
            </p>
            <p>Queda expresamente prohibido:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Revender, redistribuir o sublicenciar los planos a terceros.</li>
              <li>Publicar los planos en plataformas digitales, redes sociales o sitios web sin autorización escrita.</li>
              <li>Utilizar los diseños para construir más de una unidad sin adquirir una licencia comercial adicional.</li>
              <li>Modificar y comercializar los planos como trabajos propios.</li>
            </ul>
            <p>
              Para proyectos de desarrollo inmobiliario, conjuntos habitacionales o cualquier uso comercial a mayor escala, es necesario adquirir una <strong>licencia comercial</strong>. Contáctenos para obtener una cotización.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">4. Responsabilidad técnica y legal de la construcción</h2>
            <p>
              Los planos de ArquiPlanos son diseños de referencia arquitectónica. Es responsabilidad exclusiva del comprador y/o del profesional a cargo de la obra:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Verificar que el diseño cumple con las normas de construcción locales, municipales y nacionales vigentes en su país o región.</li>
              <li>Obtener los permisos, licencias y aprobaciones de construcción requeridos por las autoridades competentes.</li>
              <li>Contratar a un arquitecto o ingeniero certificado para adaptar, sellar y firmar los planos conforme a la reglamentación local.</li>
              <li>Realizar los estudios de suelo, estructurales, hidráulicos, eléctricos y de cualquier otra especialidad necesaria para la seguridad de la obra.</li>
            </ul>
            <p>
              ArquiPlanos no asume ninguna responsabilidad por daños, pérdidas, lesiones o incumplimientos normativos derivados del uso de los planos en una obra de construcción.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">5. Entrega del producto</h2>
            <p>
              Una vez confirmado el pago, recibirá los archivos digitales en su correo electrónico en un plazo máximo de <strong>24 horas hábiles</strong>. Los archivos se entregan en formato PDF de alta resolución; los formatos DWG o editable pueden solicitarse como servicio adicional.
            </p>
            <p>
              ArquiPlanos no realiza envíos físicos. El producto es 100% digital.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">6. Política de reembolsos</h2>
            <p>
              Dado que los planos son productos digitales que se entregan de forma inmediata, <strong>no se realizan reembolsos</strong> una vez que los archivos han sido descargados o enviados. Sin embargo, ofrecemos garantía de satisfacción en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Si el archivo entregado está corrupto o incompleto, lo reemplazaremos sin costo adicional.</li>
              <li>Si el producto adquirido no corresponde a lo descrito en la ficha del proyecto, gestionaremos un reembolso o cambio dentro de los 7 días naturales siguientes a la compra.</li>
            </ul>
            <p>
              Para iniciar una solicitud de soporte o reembolso, contáctenos en <a href="mailto:designhabitio@gmail.com" className="text-amber-700 hover:underline">designhabitio@gmail.com</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">7. Propiedad intelectual</h2>
            <p>
              Todos los diseños, imágenes, textos y contenidos publicados en ArquiPlanos son propiedad de ArquiPlanos o de sus colaboradores y están protegidos por las leyes de propiedad intelectual aplicables. La compra de un plano no transfiere derechos de autor al comprador.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">8. Limitación de responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, ArquiPlanos no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de uso de los planos, incluyendo pero no limitado a: pérdidas económicas, defectos estructurales, incumplimiento normativo o retrasos en la obra.
            </p>
            <p>
              La responsabilidad total de ArquiPlanos ante el cliente no excederá el monto pagado por el producto específico en cuestión.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">9. Ley aplicable y jurisdicción</h2>
            <p>
              Estos términos se rigen por las leyes de Guatemala. Cualquier disputa que surja en relación con estos términos se someterá a la jurisdicción de los tribunales competentes de Guatemala, renunciando las partes a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">10. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos, puede contactarnos en:
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-1">
              <p><strong>ArquiPlanos</strong></p>
              <p>Guatemala</p>
              <p>Email: <a href="mailto:designhabitio@gmail.com" className="text-amber-700 hover:underline">designhabitio@gmail.com</a></p>
              <p>Teléfono: +502 5749-4629</p>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-8 sm:px-10 mt-16">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <span className="text-sm font-semibold text-slate-950">ArquiPlanos</span>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/terminos" className="hover:text-slate-800 transition font-medium text-slate-700">Términos de Servicio</Link>
            <Link href="/privacidad" className="hover:text-slate-800 transition">Política de Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
