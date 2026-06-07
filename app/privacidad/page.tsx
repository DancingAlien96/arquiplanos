import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | ArquiPlanos",
  description: "Política de privacidad y tratamiento de datos personales de ArquiPlanos.",
};

export default function PrivacidadPage() {
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
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Política de Privacidad</h1>
          <p className="text-sm text-slate-500 mt-3">Última actualización: mayo de 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-10 text-sm leading-7 text-slate-700">

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">1. Responsable del tratamiento</h2>
            <p>
              ArquiPlanos, con domicilio en Guatemala, es el responsable del tratamiento de sus datos personales recopilados a través de este sitio web y del proceso de compra de planos arquitectónicos digitales.
            </p>
            <p>
              Para cualquier consulta relacionada con esta política, puede contactarnos en <a href="mailto:hola@arquiplanos.com" className="text-amber-700 hover:underline">hola@arquiplanos.com</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">2. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos personales:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Datos de contacto:</strong> nombre completo, correo electrónico y número de teléfono, proporcionados a través del formulario de contacto o al realizar una compra.</li>
              <li><strong>Datos de transacción:</strong> información necesaria para procesar el pago, como dirección de facturación. Los datos de tarjeta de crédito son procesados directamente por la pasarela de pago y ArquiPlanos no los almacena.</li>
              <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia, recopilados mediante cookies y herramientas analíticas.</li>
              <li><strong>Comunicaciones:</strong> contenido de los mensajes que nos envía a través del formulario de contacto o por correo electrónico.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">3. Finalidad del tratamiento</h2>
            <p>Utilizamos sus datos para las siguientes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Procesar y gestionar la compra y entrega de planos arquitectónicos digitales.</li>
              <li>Enviar confirmaciones de pedido y los archivos adquiridos al correo registrado.</li>
              <li>Responder consultas y solicitudes de soporte técnico o postventa.</li>
              <li>Enviar comunicaciones comerciales y novedades de ArquiPlanos, previa aceptación del usuario (puede darse de baja en cualquier momento).</li>
              <li>Mejorar la experiencia de navegación y el rendimiento del sitio web.</li>
              <li>Cumplir con obligaciones legales y fiscales aplicables.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">4. Base legal del tratamiento</h2>
            <p>El tratamiento de sus datos se basa en:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Ejecución de un contrato:</strong> para procesar sus compras y entregarle el producto adquirido.</li>
              <li><strong>Consentimiento:</strong> para el envío de comunicaciones comerciales y el uso de cookies no esenciales.</li>
              <li><strong>Interés legítimo:</strong> para mejorar nuestros servicios y prevenir el fraude.</li>
              <li><strong>Obligación legal:</strong> para cumplir con normativas fiscales y contables.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">5. Compartición de datos con terceros</h2>
            <p>
              ArquiPlanos no vende ni alquila sus datos personales a terceros. Podemos compartir información con:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Pasarelas de pago:</strong> para procesar transacciones de forma segura (ej. Stripe, PayPal). Estos proveedores cuentan con sus propias políticas de privacidad.</li>
              <li><strong>Proveedores de servicios:</strong> plataformas de correo electrónico transaccional y analítica web, bajo acuerdos de confidencialidad.</li>
              <li><strong>Autoridades competentes:</strong> cuando sea requerido por ley o resolución judicial.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">6. Conservación de los datos</h2>
            <p>
              Conservamos sus datos personales durante el tiempo necesario para cumplir con las finalidades descritas y, como mínimo, durante el plazo exigido por la legislación fiscal y mercantil aplicable (generalmente 5 años para registros de transacciones).
            </p>
            <p>
              Los datos de contacto para comunicaciones comerciales se conservan hasta que el usuario retire su consentimiento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">7. Sus derechos</h2>
            <p>Como titular de sus datos, usted tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre usted.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Cancelación/Supresión:</strong> solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos para fines de marketing.</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
              <li><strong>Limitación:</strong> solicitar la suspensión del tratamiento en determinadas circunstancias.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, envíe su solicitud a <a href="mailto:hola@arquiplanos.com" className="text-amber-700 hover:underline">hola@arquiplanos.com</a> indicando su nombre completo y el derecho que desea ejercer. Responderemos en un plazo máximo de 20 días hábiles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">8. Seguridad de los datos</h2>
            <p>
              ArquiPlanos adopta medidas técnicas y organizativas apropiadas para proteger sus datos contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Las transmisiones de datos en nuestro sitio se realizan mediante cifrado SSL/TLS.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">9. Cookies</h2>
            <p>
              Nuestro sitio utiliza cookies propias y de terceros para mejorar la experiencia de navegación y analizar el tráfico. Las cookies esenciales son necesarias para el funcionamiento del sitio. Las cookies analíticas y de marketing requieren su consentimiento.
            </p>
            <p>
              Puede configurar su navegador para rechazar las cookies, aunque esto puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">10. Transferencias internacionales</h2>
            <p>
              Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Guatemala. En tales casos, nos aseguramos de que dichas transferencias se realicen conforme a mecanismos legales adecuados y con niveles de protección equivalentes a los exigidos por la legislación guatemalteca.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">11. Cambios en esta política</h2>
            <p>
              ArquiPlanos puede actualizar esta Política de Privacidad ocasionalmente. Notificaremos los cambios sustanciales publicando la nueva versión en esta página con la fecha de actualización. Le recomendamos revisarla periódicamente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">12. Contacto</h2>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-1">
              <p><strong>ArquiPlanos</strong></p>
              <p>Guatemala</p>
              <p>Email: <a href="mailto:hola@arquiplanos.com" className="text-amber-700 hover:underline">hola@arquiplanos.com</a></p>
              <p>Teléfono: +502 5749-4629</p>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-8 sm:px-10 mt-16">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <span className="text-sm font-semibold text-slate-950">ArquiPlanos</span>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/terminos" className="hover:text-slate-800 transition">Términos de Servicio</Link>
            <Link href="/privacidad" className="hover:text-slate-800 transition font-medium text-slate-700">Política de Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
