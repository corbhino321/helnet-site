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
  assert.match(home, /Aucune donnée envoyée/);
  assert.match(home, /Estimation indicative/);
  assert.match(home, /Zone du chantier/);
  assert.match(home, /Choisir une zone/);
  assert.doesNotMatch(home, /Choisir la zone la plus proche/);
  assert.match(home, /Commune — obligatoire/);
  assert.match(home, /Votre nom — obligatoire/);
  assert.match(home, /Précisions utiles — obligatoires/);
  assert.doesNotMatch(home, /Votre nom — facultatif/);
  assert.doesNotMatch(home, /Précisions utiles — facultatif/);
  assert.match(home, /Photos du chantier — facultatif/);
  assert.match(home, /JPEG, PNG ou WebP/);
  assert.match(home, /Le site ne stocke aucun fichier/);
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

test("n’affiche aucune numérotation décorative", () => {
  assert.doesNotMatch(home, /class="service-number"/);
  assert.doesNotMatch(home, /(?:01|02|03|04)\s*·/);
});

test("place les options de haute pression dans le bon ordre", () => {
  const surface = quoteAssistant.indexOf("Surface approximative");
  const antiMoss = quoteAssistant.indexOf("Traitement anti-mousse — supplément de 4 CHF/m²");
  const condition = quoteAssistant.indexOf("<label><span>État / complexité</span>");
  const waterRepellent = quoteAssistant.indexOf("Protection hydrofuge — supplément de 8 CHF/m²");

  assert.ok(surface < antiMoss);
  assert.ok(antiMoss < condition);
  assert.ok(condition < waterRepellent);
});

test("publie les informations de confidentialité", () => {
  assert.match(privacy, /Vos informations restent sous votre contrôle/);
  assert.match(privacy, /Responsable du site et du traitement/);
  assert.match(privacy, /activité indépendante en lancement/);
});

test("prépare le domaine personnalisé", async () => {
  const cname = await readFile(new URL("../out/CNAME", import.meta.url), "utf8");
  assert.equal(cname.trim(), "helnetservices.ch");
});
