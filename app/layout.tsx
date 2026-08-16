import type { Metadata } from "next";
import "./globals.css";
import "./responsive-fixes.css";
import SiteChrome from "./SiteChrome";

const title = "Helnet Services | Nettoyage, conciergerie, espaces verts et rénovation";
const description = "Helnet Services intervient en Suisse romande pour le nettoyage professionnel, la conciergerie, les espaces verts et la rénovation. Demande de devis par WhatsApp ou e-mail.";

export const metadata: Metadata = {
  metadataBase: new URL("https://helnetservices.ch"),
  title,
  description,
  applicationName: "Helnet Services",
  alternates: { canonical: "/" },
  keywords: ["Helnet Services", "nettoyage professionnel", "conciergerie", "entretien d’immeubles", "espaces verts", "rénovation", "Suisse romande", "Yens"],
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  openGraph: { title, description, url: "/", siteName: "Helnet Services", locale: "fr_CH", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Helnet Services" }], type: "website" },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}
