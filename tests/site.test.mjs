import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const home = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
const privacy = await readFile(new URL("../out/confidentialite/index.html", import.meta.url), "utf8");

test("publie une page d’accueil orientée WhatsApp et e-mail", () => {
  assert.match(home, /Votre partenaire/);
  assert.match(home, /Visuels de présentation/);
  assert.match(home, /https:\/\/wa\.me\/41767748710/);
  assert.match(home, /mailto:contact@helnetservices\.ch/);
  assert.match(home, /Votre demande est prête/);
  assert.match(home, /Aucun prix automatique/);
  assert.doesNotMatch(home, /CHF/);
  assert.doesNotMatch(home, /\/api\/quotes/);
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
