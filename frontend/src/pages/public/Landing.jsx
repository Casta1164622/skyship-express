/**
 * src/pages/public/Landing.jsx
 *
 * Pagina de inicio publica con:
 *   - Hero
 *   - Servicios
 *   - Historia/Mision/Vision/Valores
 *   - FAQ
 *   - Formulario de contacto
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../../services/otherServices';

const SERVICES = [
  { icon: '📦', title: 'Envíos nacionales', desc: 'Cobertura en los 22 departamentos con entrega en 24-72 horas.' },
  { icon: '⚡', title: 'Express same-day', desc: 'Entrega el mismo día dentro del área metropolitana.' },
  { icon: '🏢', title: 'Soluciones empresa', desc: 'Planes corporativos con tarifas preferenciales y atención dedicada.' }
];

const ABOUT_ITEMS = [
  { title: 'Historia', desc: 'Fundada en 2015, llevamos una década moviendo paquetes a lo largo de Guatemala.' },
  { title: 'Misión', desc: 'Conectar personas y negocios mediante envíos rápidos, seguros y accesibles.' },
  { title: 'Visión', desc: 'Ser la empresa de paquetería líder en Centroamérica para 2030.' },
  { title: 'Valores', desc: 'Puntualidad, seguridad, transparencia y atención al cliente.' }
];

const FAQS = [
  { q: '¿Cuánto tarda un envío nacional?', a: 'Entre 24 y 72 horas dependiendo del destino y tipo de servicio elegido.' },
  { q: '¿Cómo rastreo mi paquete?', a: 'Con tu código de guía puedes rastrearlo desde tu panel de usuario en cualquier momento.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos pago en efectivo en sucursales, tarjeta de crédito/débito y transferencia bancaria.' },
  { q: '¿Hacen envíos internacionales?', a: 'Por el momento solo operamos a nivel nacional. Próximamente expandiremos a Centroamérica.' }
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: '' });
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: null }));
  }

  function validate() {
    const errs = {};
    if (form.name.trim().length < 3) errs.name = 'Mínimo 3 caracteres';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Email inválido';
    if (form.subject.trim().length < 3) errs.subject = 'Mínimo 3 caracteres';
    if (form.message.trim().length < 10) errs.message = 'Mínimo 10 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    if (!validate()) return;

    try {
      setSending(true);
      await contactService.send(form);
      setStatus({ type: 'success', message: '¡Mensaje enviado! Te contactaremos pronto.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Error al enviar el mensaje' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="landing">

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-tag">PAQUETERÍA NACIONAL</div>
            <h1>Tus envíos llegan más rápido, seguros y a tiempo</h1>
            <p>Conectamos toda Guatemala con un servicio de paquetería confiable y tecnología moderna para rastrear tus paquetes en tiempo real.</p>
            <div className="hero-cta">
              <Link to="/registro" className="btn btn-primary">Comenzar →</Link>
              <a href="#servicios" className="btn btn-ghost-light">Conocer más</a>
            </div>
          </div>
          <div className="hero-illustration">📦</div>
        </div>
      </section>

      <section id="servicios" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">NUESTROS SERVICIOS</div>
            <h2>Soluciones de envío para cada necesidad</h2>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">SOBRE NOSOTROS</div>
            <h2>SkyShip Express en pocas palabras</h2>
          </div>
          <div className="about-grid">
            {ABOUT_ITEMS.map((item, i) => (
              <div key={i} className="about-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">PREGUNTAS FRECUENTES</div>
            <h2>¿Cómo podemos ayudarte?</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">CONTACTO</div>
            <h2>¿Tienes una pregunta? Escríbenos</h2>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {status.type === 'success' && <div className="alert alert-success">{status.message}</div>}
            {status.type === 'error' && <div className="alert alert-error">{status.message}</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Correo</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Asunto</label>
              <input className="form-input" name="subject" value={form.subject} onChange={handleChange} />
              {errors.subject && <div className="form-error">{errors.subject}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>
            <div className="text-right">
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar mensaje →'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <div className="footer-brand">
              <span className="brand-logo-small">S</span>
              <span>SkyShip Express</span>
            </div>
            <p className="footer-desc">Tu socio confiable en paquetería nacional desde 2015.</p>
          </div>
          <div>
            <div className="footer-title">Contacto</div>
            <div className="footer-text">+502 0000-0000</div>
            <div className="footer-text">info@skyship.gt</div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 SkyShip Express. Todos los derechos reservados.</div>
      </footer>

      <style>{`
        .hero {
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, #1E3A8A 100%);
          color: white;
          padding: 80px 0;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .hero-tag {
          font-size: 12px;
          color: #93C5FD;
          letter-spacing: 1.5px;
          font-weight: 500;
          margin-bottom: 14px;
        }
        .hero h1 {
          font-size: 42px;
          font-weight: 600;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .hero p {
          font-size: 16px;
          opacity: 0.85;
          margin-bottom: 26px;
          line-height: 1.6;
          max-width: 520px;
        }
        .hero-cta {
          display: flex;
          gap: 10px;
        }
        .btn-ghost-light {
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
        }
        .btn-ghost-light:hover { background: rgba(255, 255, 255, 0.1); text-decoration: none; }
        .hero-illustration {
          font-size: 180px;
          text-align: center;
          opacity: 0.7;
        }
        .section { padding: 70px 0; background: white; }
        .section-alt { background: var(--color-bg); }
        .section-header { text-align: center; margin-bottom: 40px; }
        .section-tag {
          font-size: 11px;
          color: var(--color-primary-light);
          letter-spacing: 1.5px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .section-header h2 {
          font-size: 28px;
          color: var(--color-primary-dark);
          font-weight: 600;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .service-card {
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 28px;
        }
        .service-icon {
          width: 44px; height: 44px;
          background: var(--color-primary-bg);
          color: var(--color-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 14px;
        }
        .service-card h3 {
          font-size: 16px;
          color: var(--color-primary-dark);
          margin-bottom: 8px;
        }
        .service-card p {
          font-size: 13px;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .about-card {
          background: white;
          border-left: 3px solid var(--color-primary-light);
          border-radius: 10px;
          padding: 20px;
        }
        .about-card h3 {
          font-size: 14px;
          color: var(--color-primary-dark);
          margin-bottom: 8px;
        }
        .about-card p {
          font-size: 13px;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
        .faq-list { max-width: 700px; margin: 0 auto; }
        .faq-item {
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .faq-item.open {
          background: var(--color-primary-bg-soft);
          border-color: var(--color-primary-light);
        }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--color-primary-dark);
          font-weight: 500;
        }
        .faq-toggle {
          color: var(--color-primary-light);
          font-size: 18px;
        }
        .faq-answer {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-top: 10px;
          line-height: 1.6;
        }
        .contact-form {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 28px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .footer {
          background: var(--color-primary-dark);
          color: white;
          padding: 36px 0 0;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          padding-bottom: 26px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .brand-logo-small {
          width: 26px; height: 26px;
          background: var(--color-primary-light);
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }
        .footer-desc {
          font-size: 12px;
          opacity: 0.7;
          line-height: 1.6;
        }
        .footer-title {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .footer-text {
          font-size: 12px;
          opacity: 0.7;
          line-height: 1.8;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding: 16px 24px;
          font-size: 11px;
          opacity: 0.6;
          text-align: center;
        }
        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero h1 { font-size: 32px; }
          .hero-illustration { display: none; }
          .services-grid { grid-template-columns: 1fr; }
          .about-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
