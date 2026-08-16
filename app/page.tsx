import Image from "next/image";
import QuoteAssistant from "./QuoteAssistant";

const whatsapp =
  "https://wa.me/41767748710?text=Bonjour%20Helnet%20Services%2C%20j%E2%80%99aimerais%20recevoir%20un%20devis.";

const services = [
  {
    number: "01",
    title: "Nettoyage professionnel",
    text: "Logements, bureaux, fins de bail, fins de chantier et remises en état soignées.",
    items: ["Nettoyage courant", "Fin de bail", "Fin de chantier", "Haute pression"],
    href: "#devis",
  },
  {
    number: "02",
    title: "Conciergerie et immeubles",
    text: "Un suivi régulier des parties communes et de la maintenance courante.",
    items: ["Parties communes", "Contrôles réguliers", "Sorties de conteneurs", "Petite maintenance"],
    href: "#devis",
  },
  {
    number: "03",
    title: "Espaces verts",
    text: "Entretien de jardins, tailles saisonnières, cours, terrasses et extérieurs.",
    items: ["Entretien de jardin", "Travaux de taille", "Cours et terrasses", "Évacuation"],
    href: "#devis",
  },
  {
    number: "04",
    title: "Rénovation",
    text: "Remise en état, transformations intérieures, carrelage et travaux sur mesure.",
    items: ["Remise en état", "Démolition", "Carrelage", "Étude personnalisée"],
    href: "#devis",
  },
];

const methods = [
  {
    number: "01",
    title: "Vous décrivez le besoin",
    text: "Quelques informations suffisent pour cerner la prestation, la surface, l’accès et le délai souhaité.",
  },
  {
    number: "02",
    title: "Helnet prépare le devis",
    text: "Les informations sont vérifiées avec vous, puis complétées par des photos ou une visite si nécessaire.",
  },
  {
    number: "03",
    title: "L’équipe intervient",
    text: "Vous gardez un interlocuteur clair avant, pendant et après l’intervention.",
  },
];

const faqs = [
  {
    question: "La demande en ligne donne-t-elle directement un prix ?",
    answer:
      "Non. Elle prépare un message complet pour gagner du temps. Helnet confirme ensuite le montant après vérification des informations, des photos ou de l’accès.",
  },
  {
    question: "Dans quelle zone Helnet intervient-il ?",
    answer:
      "Helnet Services est basé à Yens et intervient dans toute la Suisse romande. La disponibilité et le déplacement sont confirmés selon la commune.",
  },
  {
    question: "Puis-je envoyer des photos ?",
    answer:
      "Oui. Pour une demande précise, vous pouvez continuer par WhatsApp ou par e-mail et joindre les photos utiles.",
  },
  {
    question: "Travaillez-vous avec les régies et entreprises ?",
    answer:
      "Oui. Helnet accompagne les particuliers, propriétaires, régies immobilières et entreprises pour des interventions ponctuelles ou régulières.",
  },
];

export default function Home() {
  return (
    <main id="contenu">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Helnet Services",
            url: "https://helnetservices.ch/",
            inLanguage: "fr-CH",
          }),
        }}
      />

      <section className="hero" id="accueil">
        <div className="hero-content">
          <p className="eyebrow light">RÉNOVATION · NETTOYAGE · ESPACES VERTS</p>
          <h1>
            Votre partenaire
            <br />
            <em>de confiance.</em>
          </h1>
          <p className="hero-lead">
            Helnet Services entretient, nettoie et remet en état vos biens en Suisse romande avec une approche claire,
            fiable et soignée.
          </p>
          <div className="hero-actions">
            <a className="button whatsapp" href={whatsapp} target="_blank" rel="noreferrer">
              Demander un devis
            </a>
            <a className="button outline" href="#services">
              Voir les services
            </a>
          </div>
          <div className="hero-facts">
            <span>Réponse rapide</span>
            <span>Offre sur mesure</span>
            <span>Interlocuteur unique</span>
          </div>
        </div>
        <div className="hero-visual" role="img" aria-label="Illustration des prestations Helnet Services">
          <span>Illustration de nos prestations</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="Engagements Helnet Services">
        <p>Une solution complète pour prendre soin de vos biens.</p>
        <div>
          <span>Service fiable</span>
          <span>Qualité durable</span>
          <span>Intervention rapide</span>
          <span>Suivi personnalisé</span>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow blue">NOS SERVICES</p>
            <h2>Des savoir-faire complémentaires. Une seule exigence.</h2>
          </div>
          <p>
            Helnet Services coordonne l’entretien quotidien et les interventions ponctuelles pour simplifier la gestion
            de vos locaux, immeubles et extérieurs.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={service.href}>Préparer ma demande</a>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase" aria-label="Prestations mises en avant">
        <article>
          <Image
            src="/helnet-pressure-washing-final-v3.webp"
            alt="Illustration du nettoyage haute pression d’une surface extérieure"
            fill
            sizes="(max-width: 800px) 100vw, 60vw"
          />
          <div>
            <p>NETTOYAGE SPÉCIALISÉ</p>
            <h2>Terrasses, cours, accès et façades retrouvent une surface nette.</h2>
            <a href="#devis">Préparer la demande</a>
          </div>
        </article>
        <article>
          <Image
            src="/helnet-renovation-remise-etat-final-v3.webp"
            alt="Illustration d’une remise en état et rénovation intérieure"
            fill
            sizes="(max-width: 800px) 100vw, 38vw"
          />
          <div>
            <p>RÉNOVATION</p>
            <h2>Remettre en état, améliorer et valoriser durablement.</h2>
            <a href="#devis">Préparer la demande</a>
          </div>
        </article>
        <p className="showcase-note">Visuels de présentation — chaque projet est validé selon le besoin réel.</p>
      </section>

      <section className="quote-section" id="devis">
        <QuoteAssistant />
      </section>

      <section className="section method" id="methode">
        <div className="section-heading">
          <div>
            <p className="eyebrow blue">NOTRE MÉTHODE</p>
            <h2>Simple, clair et suivi.</h2>
          </div>
          <p>Un processus direct pour passer d’une demande rapide à une intervention organisée.</p>
        </div>
        <div className="method-grid">
          {methods.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="zone-section">
        <div>
          <p className="eyebrow light">ZONE D’INTERVENTION</p>
          <h2>Basé à Yens, interventions dans toute la Suisse romande.</h2>
        </div>
        <div className="zone-card">
          <strong>Particuliers, propriétaires, régies et entreprises.</strong>
          <p>
            Helnet répond aux demandes ponctuelles comme aux besoins réguliers. Le périmètre, le prix et le délai sont
            confirmés avant l’intervention.
          </p>
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="faq-intro">
          <p className="eyebrow blue">QUESTIONS FRÉQUENTES</p>
          <h2>Les points importants avant de demander un devis.</h2>
          <p>Pour une réponse précise, le plus simple reste d’envoyer quelques informations ou photos.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow light">CONTACT DIRECT</p>
          <h2>Parlons de votre projet.</h2>
          <p>
            Décrivez le besoin, la commune, le délai souhaité et joignez des photos si utile. Helnet vous répond avec une
            proposition adaptée.
          </p>
        </div>
        <div className="contact-options">
          <a href={whatsapp} target="_blank" rel="noreferrer">
            <small>WHATSAPP</small>
            <strong>076 774 87 10</strong>
            <span>Ouvrir WhatsApp</span>
          </a>
          <a href="mailto:contact@helnetservices.ch?subject=Demande%20de%20devis">
            <small>E-MAIL</small>
            <strong>contact@helnetservices.ch</strong>
            <span>Envoyer un e-mail</span>
          </a>
        </div>
      </section>
    </main>
  );
}
