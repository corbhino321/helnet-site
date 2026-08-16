# Helnet Services

Site vitrine statique de Helnet Services pour la Suisse romande. Le parcours de devis prépare un message, puis laisse le visiteur choisir WhatsApp ou l’e-mail. Aucune donnée n’est stockée par le site.

## Développement local

Prérequis : Node.js 24 et pnpm 11.

\`\`\`powershell
pnpm install --frozen-lockfile
pnpm dev
\`\`\`

Contrôles avant publication :

\`\`\`powershell
pnpm lint
pnpm test
\`\`\`

\`pnpm build\` génère le site statique dans \`out/\`.

## Publication GitHub Pages

Le workflow \`.github/workflows/deploy-pages.yml\` compile et publie automatiquement le site après chaque envoi sur la branche \`main\`.

Après la création du dépôt :

1. Ouvrir **Settings → Pages**.
2. Choisir **GitHub Actions** comme source.
3. Dans **Custom domain**, saisir \`helnetservices.ch\`.
4. Activer **Enforce HTTPS** dès que GitHub le permet.
5. Dans les paramètres du compte GitHub, vérifier le domaine avec l’enregistrement TXT proposé par GitHub.

## DNS Infomaniak

Dans la zone DNS de \`helnetservices.ch\`, configurer le domaine racine avec ces quatre enregistrements :

| Type | Nom | Valeur |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Ajouter aussi :

| Type | Nom | Valeur |
| --- | --- | --- |
| CNAME | www | corbhino321.github.io. |

Ne pas supprimer les enregistrements MX ou TXT utilisés par l’e-mail. Remplacer uniquement les anciens enregistrements Web \`A\`, \`AAAA\` ou \`CNAME\` qui entrent en conflit avec ceux de GitHub Pages.

Vérification sous PowerShell :

\`\`\`powershell
Resolve-DnsName helnetservices.ch -Type A
Resolve-DnsName www.helnetservices.ch -Type CNAME
\`\`\`

La propagation DNS peut demander plusieurs heures. Une fois le domaine résolu par GitHub Pages, HTTPS peut être activé depuis les paramètres du dépôt.

## Contacts configurés

- WhatsApp : 076 774 87 10
- E-mail : contact@helnetservices.ch
- Zone : Suisse romande
