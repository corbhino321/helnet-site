"use client";

import { useMemo, useState } from "react";

const services = {
  regular: "Entretien régulier / conciergerie",
  deep: "Nettoyage approfondi",
  lease: "Nettoyage de fin de bail",
  construction: "Nettoyage de fin de chantier",
  "pressure-ground": "Haute pression — terrasse ou dallage",
  "pressure-facade": "Haute pression — façade",
  "garden-care": "Entretien d’espaces verts",
  pruning: "Travaux de taille",
  "terrace-installation": "Pose de terrasse",
  renovation: "Rénovation / remise en état",
} as const;

type ServiceKey = keyof typeof services;

export default function QuoteAssistant() {
  const [service, setService] = useState<ServiceKey>("lease");
  const [quantity, setQuantity] = useState(80);
  const [condition, setCondition] = useState("normal");
  const [frequency, setFrequency] = useState("weekly");
  const [distance, setDistance] = useState(10);
  const [locality, setLocality] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const selected = services[service];
  const isRecurring = service === "regular";
  const isPruning = service === "pruning";

  const message = useMemo(() => {
    const lines = [
      "Bonjour Helnet Services, je souhaite recevoir un devis.",
      "Prestation : " + selected,
      isPruning
        ? "Longueur approximative : " + quantity + " m"
        : "Surface approximative : " + quantity + " m²",
      "État / complexité : " +
        (condition === "light"
          ? "simple"
          : condition === "heavy"
            ? "important / accès difficile"
            : "normal"),
      isRecurring
        ? "Fréquence : " +
          (frequency === "monthly"
            ? "mensuelle"
            : frequency === "twice"
              ? "deux fois par semaine"
              : "hebdomadaire")
        : "",
      "Distance aller approximative depuis Yens : " + distance + " km",
      locality ? "Commune : " + locality : "",
      name ? "Nom : " + name : "",
      details ? "Précisions : " + details : "",
    ];

    return lines.filter(Boolean).join("\n");
  }, [condition, details, distance, frequency, isPruning, isRecurring, locality, name, quantity, selected]);

  const whatsappHref = "https://wa.me/41767748710?text=" + encodeURIComponent(message);
  const emailHref =
    "mailto:contact@helnetservices.ch?subject=" +
    encodeURIComponent("Demande de devis — " + selected) +
    "&body=" +
    encodeURIComponent(message);
  const summary =
    selected +
    " · " +
    quantity +
    " " +
    (isPruning ? "m" : "m²") +
    (locality ? " · " + locality : "");

  return (
    <div className="quote-shell">
      <div className="quote-copy">
        <p className="eyebrow light">DEMANDE DE DEVIS</p>
        <h2>Préparez une demande claire en moins d’une minute.</h2>
        <p>
          Indiquez l’essentiel, puis choisissez WhatsApp ou l’e-mail. Aucun prix automatique : Helnet vérifie votre
          besoin avant de vous proposer un montant.
        </p>
        <div className="quote-promises">
          <span>01 · Sans compte</span>
          <span>02 · Rien n’est envoyé automatiquement</span>
          <span>03 · Réponse directe</span>
        </div>
      </div>

      <div className="quote-panel">
        <div className="form-grid">
          <label>
            <span>Prestation souhaitée</span>
            <select value={service} onChange={(event) => setService(event.target.value as ServiceKey)}>
              {Object.entries(services).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{isPruning ? "Longueur approximative" : "Surface approximative"}</span>
            <div className="input-unit">
              <input
                type="number"
                min="1"
                max="5000"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
              <b>{isPruning ? "m" : "m²"}</b>
            </div>
          </label>

          <label>
            <span>État / complexité</span>
            <select value={condition} onChange={(event) => setCondition(event.target.value)}>
              <option value="light">Simple</option>
              <option value="normal">Normal</option>
              <option value="heavy">Important / accès difficile</option>
            </select>
          </label>

          {isRecurring && (
            <label>
              <span>Fréquence</span>
              <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
                <option value="monthly">Une fois par mois</option>
                <option value="weekly">Une fois par semaine</option>
                <option value="twice">Deux fois par semaine</option>
              </select>
            </label>
          )}

          <label>
            <span>Distance aller approximative depuis Yens</span>
            <div className="input-unit">
              <input
                type="number"
                min="0"
                max="250"
                value={distance}
                onChange={(event) => setDistance(Number(event.target.value))}
              />
              <b>km</b>
            </div>
          </label>

          <label>
            <span>Commune</span>
            <input
              value={locality}
              onChange={(event) => setLocality(event.target.value)}
              placeholder="Ex. Morges"
              autoComplete="address-level2"
            />
          </label>

          <label>
            <span>Votre nom — facultatif</span>
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          </label>

          <label className="wide">
            <span>Précisions utiles — facultatif</span>
            <textarea
              rows={3}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Accès, délai souhaité, éléments particuliers…"
            />
          </label>
        </div>

        <div className="estimate-box" aria-live="polite">
          <p>Votre demande est prête</p>
          <strong>{summary}</strong>
          <small>Vous pourrez joindre des photos après l’ouverture de WhatsApp ou de votre messagerie.</small>
        </div>

        <div className="quote-actions">
          <a className="button whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
            Envoyer sur WhatsApp
          </a>
          <a className="button email" href={emailHref}>
            Envoyer par e-mail
          </a>
        </div>

        <p className="privacy-note">
          Vos informations restent dans votre navigateur jusqu’à l’ouverture du canal choisi.{" "}
          <a href="/confidentialite/">En savoir plus</a>.
        </p>
      </div>
    </div>
  );
}
