import Image from "next/image";
import Link from "next/link";

const whatsapp = "https://wa.me/41767748710?text=Bonjour%20Helnet%20Services%2C%20j%E2%80%99aimerais%20vous%20parler%20d%E2%80%99un%20projet.";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return <>
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <header className="site-header">
      <Link className="header-brand" href="/#accueil" aria-label="Helnet Services — accueil">
        <Image src="/helnet-symbol-official.png" alt="" width={402} height={365} />
        <Image className="header-wordmark" src="/helnet-wordmark-official.png" alt="Helnet Services" width={586} height={222} />
      </Link>
      <nav className="desktop-nav" aria-label="Navigation principale">
        <Link href="/#services">Services</Link>
        <Link href="/#methode">Méthode</Link>
        <Link href="/#faq">Questions</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <a className="header-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Contacter Helnet Services sur WhatsApp">
        <span>WhatsApp</span><strong>076 774 87 10</strong>
      </a>
      <details className="mobile-menu">
        <summary aria-label="Ouvrir le menu">Menu</summary>
        <nav aria-label="Navigation mobile">
          <Link href="/#services">Services</Link><Link href="/#devis">Devis</Link><Link href="/#faq">Questions</Link><Link href="/#contact">Contact</Link>
        </nav>
      </details>
    </header>
    {children}
    <footer className="site-footer">
      <div className="footer-brand"><Image src="/helnet-logo-official-exact.png" alt="Helnet Services" width={586} height={592} /></div>
      <div><strong>Helnet Services</strong><p>Basé à Yens · Interventions en Suisse romande</p></div>
      <div className="footer-links"><a href="mailto:contact@helnetservices.ch">contact@helnetservices.ch</a><a href="/confidentialite/">Confidentialité</a><span>© {new Date().getFullYear()} Helnet Services</span></div>
    </footer>
    <nav className="mobile-contact-bar" aria-label="Contact rapide">
      <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
      <a href="mailto:contact@helnetservices.ch?subject=Demande%20de%20devis">E-mail</a>
    </nav>
  </>;
}
