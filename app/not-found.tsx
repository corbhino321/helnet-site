import Link from "next/link";
export default function NotFound() { return <main id="contenu" className="not-found"><div><h1>Page introuvable.</h1><p>La page demandée n’existe pas ou a été déplacée.</p><Link href="/">Retourner à l’accueil</Link></div></main>; }
