"use client";

import { useMemo, useState } from "react";

const services = {
  regular: "Entretien régulier / conciergerie", deep: "Nettoyage approfondi", lease: "Nettoyage de fin de bail", construction: "Nettoyage de fin de chantier",
  "pressure-ground": "Haute pression — terrasse ou dallage", "pressure-facade": "Haute pression — façade", "garden-care": "Entretien d’espaces verts",
  pruning: "Travaux de taille", "terrace-installation": "Pose de terrasse", renovation: "Rénovation / remise en état",
} as const;
type Service = keyof typeof services;
const travelZones = {
  local: { label: "Morges, Aubonne et La Côte proche", distance: 15 },
  lausanne: { label: "Lausanne et sa région", distance: 30 },
  leman: { label: "Nyon, Genève, Vevey ou Montreux", distance: 60 },
  plateau: { label: "Yverdon, Fribourg ou Neuchâtel", distance: 75 },
  remote: { label: "Valais, Jura ou autre secteur éloigné", distance: 120 },
} as const;
type TravelZone = keyof typeof travelZones;
const tariffs: Record<Service, [number, number, number]> = {
  regular: [110, 1.5, 150], deep: [150, 5.8, 350], lease: [180, 12.5, 750], construction: [200, 9.5, 550],
  "pressure-ground": [200, 9.5, 350], "pressure-facade": [300, 14, 800], "garden-care": [100, 1.4, 160],
  pruning: [180, 8, 250], "terrace-installation": [500, 190, 2000], renovation: [400, 700, 2500],
};

export default function QuoteAssistant() {
  const [service, setService] = useState<Service>("lease");
  const [quantity, setQuantity] = useState(80);
  const [condition, setCondition] = useState("normal");
  const [frequency, setFrequency] = useState("weekly");
  const [locality, setLocality] = useState("");
  const [travelZone, setTravelZone] = useState<TravelZone | "">("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const recurring = service === "regular";
  const pruning = service === "pruning";
  const selectedZone = travelZone ? travelZones[travelZone] : null;
  const distance = selectedZone?.distance ?? null;

  const estimate = useMemo(() => {
    if (distance === null) return null;
    const [base, perUnit, minimum] = tariffs[service];
    const conditionFactor = condition === "light" ? .9 : condition === "heavy" ? 1.3 : 1;
    const frequencyFactor = recurring && frequency === "monthly" ? 1.08 : recurring && frequency === "twice" ? .92 : 1;
    const work = Math.max(minimum, base + quantity * perUnit) * conditionFactor * frequencyFactor;
    return Math.round((work + distance * 2) / 10) * 10;
  }, [condition, distance, frequency, quantity, recurring, service]);

  const message = useMemo(() => [
    "Bonjour Helnet Services, je souhaite recevoir un devis.",
    "Prestation : " + services[service],
    (pruning ? "Longueur approximative : " : "Surface approximative : ") + quantity + (pruning ? " m" : " m²"),
    "État / complexité : " + (condition === "light" ? "simple" : condition === "heavy" ? "important / accès difficile" : "normal"),
    recurring ? "Fréquence : " + (frequency === "monthly" ? "mensuelle" : frequency === "twice" ? "deux fois par semaine" : "hebdomadaire") : "",
    selectedZone ? "Zone du chantier : " + selectedZone.label : "",
    distance !== null ? "Distance indicative depuis Yens : " + distance + " km" : "",
    estimate !== null ? "Estimation indicative : CHF " + estimate : "",
    locality ? "Commune : " + locality : "", name ? "Nom : " + name : "", details ? "Précisions : " + details : "",
  ].filter(Boolean).join("\n"), [condition, details, distance, estimate, frequency, locality, name, pruning, quantity, recurring, selectedZone, service]);

  return <div className="quote-shell">
    <div className="quote-copy">
      <p className="eyebrow light">ESTIMATION RAPIDE</p><h2>Obtenez une estimation en moins d’une minute.</h2>
      <p>Choisissez la prestation, indiquez la surface et la zone du chantier : une estimation indicative se prépare immédiatement.</p>
      <div className="quote-promises"><span>Aucune donnée envoyée</span><span>Estimation immédiate</span><span>Prix final confirmé avant intervention</span></div>
    </div>
    <div className="quote-panel"><div className="form-grid">
      <label><span>Prestation souhaitée</span><select value={service} onChange={(event) => setService(event.target.value as Service)}>{Object.entries(services).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><span>{pruning ? "Longueur approximative" : "Surface approximative"}</span><div className="input-unit"><input type="number" min="1" max="5000" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}/><b>{pruning ? "m" : "m²"}</b></div></label>
      <label><span>État / complexité</span><select value={condition} onChange={(event) => setCondition(event.target.value)}><option value="light">Simple</option><option value="normal">Normal</option><option value="heavy">Important / accès difficile</option></select></label>
      {recurring && <label><span>Fréquence</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}><option value="monthly">Une fois par mois</option><option value="weekly">Une fois par semaine</option><option value="twice">Deux fois par semaine</option></select></label>}
      <label><span>Commune</span><input value={locality} onChange={(event) => setLocality(event.target.value)} placeholder="Ex. Morges" autoComplete="address-level2"/></label>
      <label><span>Zone du chantier</span><select value={travelZone} onChange={(event) => setTravelZone(event.target.value as TravelZone | "")}><option value="">Choisir la zone la plus proche</option>{Object.entries(travelZones).map(([value, zone]) => <option key={value} value={value}>{zone.label}</option>)}</select></label>
      <div className="distance-result wide" aria-live="polite"><span>Déplacement estimé depuis Yens</span><strong>{distance === null ? "Zone à choisir" : "Environ " + distance + " km"}</strong><small>{selectedZone ? selectedZone.label : "Cette indication sert uniquement à préparer l’estimation."}</small></div>
      <label><span>Votre nom — facultatif</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name"/></label>
      <label className="wide"><span>Précisions utiles — facultatif</span><textarea rows={3} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Accès, délai souhaité, éléments particuliers…"/></label>
    </div>
    <div className="estimate-box" aria-live="polite"><p>Estimation indicative</p><strong>{estimate === null ? "Choisissez la zone du chantier" : "CHF " + estimate + (recurring ? " par intervention" : "")}</strong><small>Montant non contractuel, hors fournitures et travaux imprévus. Le prix final est toujours confirmé par un devis Helnet.</small></div>
    <div className="quote-actions"><a className="button whatsapp" href={"https://wa.me/41767748710?text=" + encodeURIComponent(message)} target="_blank" rel="noreferrer">Envoyer sur WhatsApp</a><a className="button email" href={"mailto:contact@helnetservices.ch?subject=" + encodeURIComponent("Demande de devis — " + services[service]) + "&body=" + encodeURIComponent(message)}>Envoyer par e-mail</a></div>
    <p className="privacy-note">Vos informations restent dans votre navigateur jusqu’à l’ouverture de WhatsApp ou de votre messagerie. <a href="/confidentialite/">En savoir plus</a>.</p>
    </div>
  </div>;
}
