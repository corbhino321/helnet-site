import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const home = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
const privacy = await readFile(new URL("../out/confidentialite/index.html", import.meta.url), "utf8");
const quoteAssistant = await readFile(new URL("../app/QuoteAssistant.tsx", import.meta.url), "utf8");

test("publie une page d’accueil orientée WhatsApp et e-mail", () => {
  assert.match(home, /Votre partenaire/);
  assert.doesNotMatch(home, /Visuels de présentation/);
  assert.match(home, /https:\/\/wa\.me\/41767748710/);
  assert.match(home, /mailto:contact@helnetservices\.ch/);
  assert.match(home, /ESTIMATION RAPIDE/);
  assert.match(home, /Tonte de gazon/);
  assert.match(home, /Nettoyage du jardin/);
  assert.match(home, /Aucune donnée enregistrée par Helnet/);
  assert.match(home, /Estimation indicative/);
  assert.match(home, /Zone du chantier/);
  assert.match(home, /Choisir une zone/);
  assert.doesNotMatch(home, /Choisir la zone la plus proche/);
  assert.match(home, /Commune ou adresse — obligatoire/);
  assert.match(home, /Votre nom — obligatoire/);
  assert.match(home, /Précisions utiles — obligatoires/);
  assert.doesNotMatch(home, /Votre nom — facultatif/);
  assert.doesNotMatch(home, /Précisions utiles — facultatif/);
  assert.match(home, /Photos du chantier — facultatif/);
  assert.match(home, /JPEG, PNG ou WebP/);
  assert.match(home, /Le site ne stocke aucun fichier/);
  assert.match(home, /service cartographique officiel de la Confédération/);
  assert.match(home, /Nyon ou Genève/);
  assert.match(home, /Vevey ou Montreux/);
  assert.doesNotMatch(home, /Nyon, Genève, Vevey ou Montreux/);
  assert.match(home, /class="button whatsapp" href="#devis">Demander un devis/);
  assert.doesNotMatch(home, /Rénovation \/ remise en état/);
  assert.doesNotMatch(home, /Pose de terrasse/);
  assert.doesNotMatch(home, /\/api\/quotes/);
  assert.doesNotMatch(home, /nominatim\.openstreetmap\.org/);
  assert.doesNotMatch(home, /router\.project-osrm\.org/);
});

test("propose les adresses suisses sans clé privée", () => {
  assert.match(quoteAssistant, /https:\/\/api3\.geo\.admin\.ch\/rest\/services\/api\/SearchServer/);
  assert.match(quoteAssistant, /origins: "address,zipcode,gg25"/);
  assert.match(quoteAssistant, /role="combobox"/);
  assert.match(quoteAssistant, /role="listbox"/);
  assert.match(quoteAssistant, /limit: "8"/);
});

test("reconstruit les photos avant leur partage", () => {
  assert.match(quoteAssistant, /ALLOWED_PHOTO_EXTENSION/);
  assert.match(quoteAssistant, /MAX_PHOTO_PIXELS/);
  assert.match(quoteAssistant, /createImageBitmap/);
  assert.match(quoteAssistant, /canvas\.toBlob/);
  assert.match(quoteAssistant, /new File\(\[safeBlob\]/);
  assert.match(home, /chaque photo est sécurisée avant le partage/);
});

test("n’affiche aucune numérotation décorative", () => {
  assert.doesNotMatch(home, /class="service-number"/);
  assert.doesNotMatch(home, /(?:01|02|03|04)\s*·/);
});

test("regroupe la surface et la complexité avant les traitements sur petit écran", () => {
  const surface = quoteAssistant.indexOf("Surface approximative");
  const antiMoss = quoteAssistant.indexOf("Traitement anti-mousse — supplément de 4 CHF/m²");
  const condition = quoteAssistant.indexOf("<label className={pressureCleaning ? \"pressure-condition\" : undefined}><span>État / complexité</span>");
  const waterRepellent = quoteAssistant.indexOf("Protection hydrofuge — supplément de 8 CHF/m²");

  assert.ok(surface < condition);
  assert.ok(condition < antiMoss);
  assert.ok(condition < waterRepellent);
});

test("publie les informations de confidentialité", () => {
  assert.match(privacy, /Vos informations restent sous votre contrôle/);
  assert.match(privacy, /Responsable du site et du traitement/);
  assert.match(privacy, /activité indépendante en lancement/);
  assert.match(privacy, /geo\.admin\.ch/);
  assert.match(privacy, /reconstruites directement dans votre navigateur/);
  assert.match(privacy, /le fichier original n’est ni envoyé ni stocké/);
  assert.doesNotMatch(privacy, /n’envoie pas la commune saisie/);
});

test("prépare le domaine personnalisé", async () => {
  const cname = await readFile(new URL("../out/CNAME", import.meta.url), "utf8");
  assert.equal(cname.trim(), "helnetservices.ch");
});
