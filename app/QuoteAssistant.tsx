"use client";

import { useMemo, useState, type ChangeEvent } from "react";

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_PHOTOS_TOTAL_SIZE = 15 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  const webp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  return jpeg || png || webp;
}

function regularMaintenanceSurfacePrice(surface: number) {
  return Math.min(surface, 100) * 1.6 + Math.min(Math.max(surface - 100, 0), 200) * 1 + Math.max(surface - 300, 0) * .65;
}

function greenSpaceSurfacePrice(surface: number) {
  return Math.min(surface, 100) * 2.4 + Math.min(Math.max(surface - 100, 0), 400) * 1.8 + Math.max(surface - 500, 0) * 1.4;
}

function lawnMowingSurfacePrice(surface: number) {
  return Math.min(surface, 250) * .4 + Math.min(Math.max(surface - 250, 0), 250) * .3 + Math.max(surface - 500, 0) * .22;
}

const services = {
  regular: "Entretien régulier / conciergerie", deep: "Nettoyage approfondi", lease: "Nettoyage de fin de bail", construction: "Nettoyage de fin de chantier",
  "pressure-ground": "Haute pression — terrasse ou dallage", "pressure-facade": "Haute pression — façade", "lawn-mowing": "Tonte de gazon", "garden-care": "Nettoyage du jardin",
  pruning: "Travaux de taille",
} as const;
type Service = keyof typeof services;
const travelZones = {
  local: { label: "Morges, Aubonne et La Côte proche", distance: 15 },
  lausanne: { label: "Lausanne et sa région", distance: 30 },
  nyonGeneva: { label: "Nyon ou Genève", distance: 60 },
  veveyMontreux: { label: "Vevey ou Montreux", distance: 70 },
  plateau: { label: "Yverdon, Fribourg ou Neuchâtel", distance: 75 },
  remote: { label: "Valais, Jura ou autre secteur éloigné", distance: 120 },
} as const;
type TravelZone = keyof typeof travelZones;
const tariffs: Record<Service, [number, number, number]> = {
  regular: [0, 0, 180], deep: [150, 5.8, 350], lease: [180, 12.5, 750], construction: [200, 9.5, 550],
  "pressure-ground": [200, 9.5, 350], "pressure-facade": [300, 14, 800], "lawn-mowing": [0, 0, 80], "garden-care": [0, 0, 240],
  pruning: [180, 8, 250],
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
  const [windows, setWindows] = useState(false);
  const [standardWindowCount, setStandardWindowCount] = useState(4);
  const [doorWindowCount, setDoorWindowCount] = useState(0);
  const [bayWindowCount, setBayWindowCount] = useState(0);
  const [antiMoss, setAntiMoss] = useState(false);
  const [waterRepellent, setWaterRepellent] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const recurring = service === "regular";
  const pruning = service === "pruning";
  const cleaning = ["regular", "deep", "lease", "construction"].includes(service);
  const pressureCleaning = ["pressure-ground", "pressure-facade"].includes(service);
  const lawnMowing = service === "lawn-mowing";
  const gardenCare = service === "garden-care";
  const surfacePricedService = recurring || gardenCare || lawnMowing;
  const selectedZone = travelZone ? travelZones[travelZone] : null;
  const distance = selectedZone?.distance ?? null;
  const serviceLabel = services[service] ?? services.lease;
  const requestDetailsComplete = Boolean(locality.trim() && name.trim() && details.trim());

  const handlePhotoSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (!incomingFiles.length) return;
    const acceptedPhotos: File[] = [];
    const errors = new Set<string>();
    let totalSize = 0;

    for (const file of incomingFiles) {
      if (acceptedPhotos.length >= MAX_PHOTOS) {
        errors.add("Vous pouvez ajouter au maximum 5 photos.");
        continue;
      }
      if (!ALLOWED_PHOTO_TYPES.has(file.type) || !(await hasValidImageSignature(file))) {
        errors.add("Format refusé : seules les photos JPEG, PNG et WebP sont acceptées.");
        continue;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        errors.add("Chaque photo doit faire 5 Mo maximum.");
        continue;
      }
      if (totalSize + file.size > MAX_PHOTOS_TOTAL_SIZE) {
        errors.add("L’ensemble des photos est limité à 15 Mo.");
        continue;
      }

      acceptedPhotos.push(file);
      totalSize += file.size;
    }

    setPhotos(acceptedPhotos);
    setPhotoError(Array.from(errors).join(" "));
    setShareStatus("");
  };

  const estimate = useMemo(() => {
    if (distance === null) return null;
    const tariff = tariffs[service];
    if (!tariff) return null;
    const [base, perUnit, minimum] = tariff;
    const conditionFactor = condition === "light" ? .9 : condition === "heavy" ? 1.3 : 1;
    const frequencyFactor = recurring && frequency === "monthly" ? 1.08 : recurring && frequency === "twice" ? .92 : 1;
    const visitsPerMonth = frequency === "monthly" ? 1 : frequency === "twice" ? 8 : 4;
    const servicePrice = service === "regular" ? Math.max(minimum, regularMaintenanceSurfacePrice(quantity)) : gardenCare ? Math.max(minimum, greenSpaceSurfacePrice(quantity)) : lawnMowing ? Math.max(minimum, lawnMowingSurfacePrice(quantity)) : Math.max(minimum, base + quantity * perUnit);
    const visit = servicePrice * conditionFactor + distance * 2;
    const windowsSupplement = cleaning && windows ? standardWindowCount * 15 + doorWindowCount * 30 + bayWindowCount * 45 : 0;
    const pressureProductsSupplement = pressureCleaning ? quantity * ((antiMoss ? 4 : 0) + (waterRepellent ? 8 : 0)) : 0;
    const total = (recurring ? visit * visitsPerMonth * frequencyFactor : visit) + windowsSupplement + pressureProductsSupplement;
    return Math.round(total / 10) * 10;
  }, [antiMoss, bayWindowCount, cleaning, condition, distance, doorWindowCount, frequency, gardenCare, lawnMowing, pressureCleaning, quantity, recurring, service, standardWindowCount, waterRepellent, windows]);

  const message = useMemo(() => [
    "Bonjour Helnet Services, je souhaite recevoir un devis.",
    "Prestation : " + serviceLabel,
    (pruning ? "Longueur approximative : " : "Surface approximative : ") + quantity + (pruning ? " m" : " m²"),
    "État / complexité : " + (condition === "light" ? "simple" : condition === "heavy" ? "important / accès difficile" : "normal"),
    surfacePricedService ? "Calcul : tarif au m² dégressif selon la surface" : "",
    recurring ? "Fréquence : " + (frequency === "monthly" ? "mensuelle" : frequency === "twice" ? "deux fois par semaine" : "hebdomadaire") : "",
    cleaning && windows ? "Prestation supplémentaire : nettoyage des vitres" + (recurring ? " une fois par mois" : "") : "",
    cleaning && windows && standardWindowCount > 0 ? "Fenêtres standard : " + standardWindowCount + " × 15 CHF" : "",
    cleaning && windows && doorWindowCount > 0 ? "Portes-fenêtres : " + doorWindowCount + " × 30 CHF" : "",
    cleaning && windows && bayWindowCount > 0 ? "Grandes baies vitrées : " + bayWindowCount + " × 45 CHF" : "",
    pressureCleaning && antiMoss ? "Prestation supplémentaire : traitement anti-mousse" : "",
    pressureCleaning && waterRepellent ? "Prestation supplémentaire : protection hydrofuge" : "",
    selectedZone ? "Zone du chantier : " + selectedZone.label : "",
    distance !== null ? "Distance indicative depuis Yens : " + distance + " km" : "",
    estimate !== null ? (recurring ? "Estimation mensuelle indicative : CHF " + estimate + " / mois" : "Estimation indicative : CHF " + estimate) : "",
    locality ? "Commune : " + locality : "", name ? "Nom : " + name : "", details ? "Précisions : " + details : "",
    photos.length ? "Photos sélectionnées : " + photos.length + " (jointes lors du partage)" : "",
  ].filter(Boolean).join("\n"), [antiMoss, bayWindowCount, cleaning, condition, details, distance, doorWindowCount, estimate, frequency, locality, name, photos.length, pressureCleaning, pruning, quantity, recurring, selectedZone, serviceLabel, standardWindowCount, surfacePricedService, waterRepellent, windows]);

  const shareRequestWithPhotos = async () => {
    const files = photos;
    if (!navigator.share || (navigator.canShare && !navigator.canShare({ files }))) {
      setPhotoError("Le partage direct des photos n’est pas disponible sur cet appareil. Ouvrez cette page sur un téléphone récent pour les joindre à la demande.");
      return;
    }
    try {
      await navigator.share({ title: "Demande de devis Helnet Services", text: message, files });
      setShareStatus("Le partage de la demande a été ouvert.");
      setPhotoError("");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setPhotoError("Le partage n’a pas pu être ouvert. Réessayez depuis votre téléphone.");
    }
  };

  return <div className="quote-shell">
    <div className="quote-copy">
      <p className="eyebrow light">ESTIMATION RAPIDE</p><h2>Obtenez une estimation en moins d’une minute.</h2>
      <p>Choisissez la prestation, indiquez la surface et la zone du chantier : une estimation indicative se prépare immédiatement.</p>
      <div className="quote-promises"><span>Aucune donnée envoyée</span><span>Estimation immédiate</span><span>Prix final confirmé avant intervention</span></div>
    </div>
    <div className="quote-panel"><div className="form-grid">
      <label><span>Prestation souhaitée</span><select value={service} onChange={(event) => { setService(event.target.value as Service); setWindows(false); setAntiMoss(false); setWaterRepellent(false); }}>{Object.entries(services).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><span>{pruning ? "Longueur approximative" : "Surface approximative"}</span><div className="input-unit"><input type="number" min="1" max="5000" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}/><b>{pruning ? "m" : "m²"}</b></div></label>
      {pressureCleaning && <label className="quote-option"><input type="checkbox" checked={antiMoss} onChange={(event) => setAntiMoss(event.target.checked)}/><span>Traitement anti-mousse — supplément de 4 CHF/m²</span></label>}
      <label><span>État / complexité</span><select value={condition} onChange={(event) => setCondition(event.target.value)}><option value="light">Simple</option><option value="normal">Normal</option><option value="heavy">Important / accès difficile</option></select></label>
      {lawnMowing && <div className="garden-service-note wide"><strong>Tonte de gazon uniquement</strong><small>Coupe du gazon et finitions courantes. Le désherbage, les feuilles, les massifs et la taille ne sont pas compris.</small></div>}
      {gardenCare && <div className="garden-service-note wide"><strong>Nettoyage et entretien complet du jardin</strong><small>Désherbage, ramassage de feuilles et entretien courant. La tonte seule possède un tarif différent.</small></div>}
      {recurring && <label><span>Fréquence</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}><option value="monthly">Une fois par mois</option><option value="weekly">Une fois par semaine</option><option value="twice">Deux fois par semaine</option></select></label>}
      {cleaning && <label className="quote-option wide"><input type="checkbox" checked={windows} onChange={(event) => setWindows(event.target.checked)}/><span>{recurring ? "Nettoyage des vitres une fois par mois" : "Nettoyage des vitres"} — tarif automatique selon le type</span></label>}
      {cleaning && windows && <div className="window-count-grid wide"><label><span>Fenêtres standard — 15 CHF</span><div className="input-unit"><input type="number" min="0" max="100" value={standardWindowCount} onChange={(event) => setStandardWindowCount(Math.min(100, Math.max(0, Number(event.target.value) || 0)))}/><b>unités</b></div></label><label><span>Portes-fenêtres — 30 CHF</span><div className="input-unit"><input type="number" min="0" max="100" value={doorWindowCount} onChange={(event) => setDoorWindowCount(Math.min(100, Math.max(0, Number(event.target.value) || 0)))}/><b>unités</b></div></label><label><span>Grandes baies vitrées — 45 CHF</span><div className="input-unit"><input type="number" min="0" max="100" value={bayWindowCount} onChange={(event) => setBayWindowCount(Math.min(100, Math.max(0, Number(event.target.value) || 0)))}/><b>unités</b></div></label><small className="field-help">Les accès difficiles restent confirmés avant l’intervention.</small></div>}
      {pressureCleaning && <label className="quote-option"><input type="checkbox" checked={waterRepellent} onChange={(event) => setWaterRepellent(event.target.checked)}/><span>Protection hydrofuge — supplément de 8 CHF/m²</span></label>}
      <label><span>Commune — obligatoire</span><input required value={locality} onChange={(event) => setLocality(event.target.value)} placeholder="Ex. Morges" autoComplete="address-level2"/></label>
      <label><span>Zone du chantier</span><select value={travelZone} onChange={(event) => setTravelZone(event.target.value as TravelZone | "")}><option value="">Choisir une zone</option>{Object.entries(travelZones).map(([value, zone]) => <option key={value} value={value}>{zone.label}</option>)}</select></label>
      <div className="distance-result wide" aria-live="polite"><span>Déplacement estimé depuis Yens</span><strong>{distance === null ? "Zone à choisir" : "Environ " + distance + " km"}</strong><small>{selectedZone ? selectedZone.label : "Cette indication sert uniquement à préparer l’estimation."}</small></div>
      <label><span>Votre nom — obligatoire</span><input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name"/></label>
      <label className="wide"><span>Précisions utiles — obligatoires</span><textarea required rows={3} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Accès, délai souhaité, éléments particuliers…"/></label>
      <div className="photo-upload wide">
        <div className="photo-upload-heading"><div><strong>Photos du chantier — facultatif</strong><small>Jusqu’à 5 photos JPEG, PNG ou WebP · 5 Mo par photo · 15 Mo au total</small></div><label className="photo-picker">Ajouter des photos<input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple onChange={handlePhotoSelection}/></label></div>
        {photoError && <p className="photo-error" role="alert">{photoError}</p>}
      </div>
    </div>
    <div className="estimate-box" aria-live="polite"><p>{recurring ? "Estimation mensuelle indicative" : "Estimation indicative"}</p><strong>{estimate === null ? "Choisissez la zone du chantier" : "CHF " + estimate + (recurring ? " par mois" : "")}</strong><small>{recurring ? "Pour l’entretien régulier, le montant correspond à un mois selon la fréquence choisie. " : ""}{surfacePricedService ? "Le tarif au m² diminue progressivement pour les grandes surfaces. " : ""}Montant non contractuel, hors fournitures et travaux imprévus. Le prix final est toujours confirmé par un devis Helnet.</small></div>
    {!requestDetailsComplete && <p className="required-note">Renseignez la commune, votre nom et les précisions pour activer l’envoi.</p>}
    {photos.length > 0 && <div className="photo-share-panel"><button className="button photo-share" type="button" onClick={shareRequestWithPhotos} disabled={!requestDetailsComplete}>Partager la demande avec les photos</button><small>Sur téléphone, choisissez WhatsApp dans le menu de partage pour joindre les photos.</small>{shareStatus && <p role="status">{shareStatus}</p>}</div>}
    <div className="quote-actions"><a className="button whatsapp" href={requestDetailsComplete ? "https://wa.me/41767748710?text=" + encodeURIComponent(message) : undefined} aria-disabled={!requestDetailsComplete} tabIndex={requestDetailsComplete ? undefined : -1} target="_blank" rel="noreferrer">Envoyer sur WhatsApp</a><a className="button email" href={requestDetailsComplete ? "mailto:contact@helnetservices.ch?subject=" + encodeURIComponent("Demande de devis — " + serviceLabel) + "&body=" + encodeURIComponent(message) : undefined} aria-disabled={!requestDetailsComplete} tabIndex={requestDetailsComplete ? undefined : -1}>Envoyer par e-mail</a></div>
    <p className="privacy-note">Vos informations et vos photos restent sur votre appareil jusqu’à l’ouverture du partage, de WhatsApp ou de votre messagerie. Le site ne stocke aucun fichier. <a href="/confidentialite/">En savoir plus</a>.</p>
    </div>
  </div>;
}
