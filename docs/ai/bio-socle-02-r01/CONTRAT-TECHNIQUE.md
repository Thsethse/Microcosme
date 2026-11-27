# Contrat technique du socle adulte · BIO-SOCLE-02-R01

## Archives de travail

Le bouton d’export écrit un JSON `microcosme.workshop` v1. `active` contient le document `microcosme.appearance` de la sélection courante, y compris les préférences faciales et capillaires latentes prises en charge. `inactiveBodies` contient les réglages mémorisés de la ou des bases adultes inactives. Les demandes corporelles gardent leur précision lorsqu’un curseur est désactivé. La base active a une seule source dans l’archive. Recharger une archive remplace la mémoire de travail H/F, y compris lorsque l’archive importée est un ancien document sans seconde base. Le transfert à froid passe par le JSON explicite.

`parseWorkshop(json)` dans `bio-yeux-01/workshop-archive.mjs` lit aussi les documents `microcosme.appearance` v1–v22. Les anciennes sélections brutes gardent leur import dédié. Les adaptations au dessin courant de la poitrine conservent les valeurs de provenance déjà gérées par `chestOrigin`. Certaines archives v18 à v20 contiennent des contrôles mamelons ou nombril retirés de l’atelier. Ces valeurs restent lisibles dans le document d’origine validé sous `historicalSource`, tandis que la sélection éditable conserve les commandes actuellement disponibles.

Les anciens v22 d’avant R02 et de R02 partagent `bio-corps-06-svg@1`. La valeur exacte de pousse est conservée, le tracé courant est le pointillé R02 et l’interface indique que le tracé d’origine ne peut être déterminé à partir du v22 seul. Les nouveaux exports portent un `renderProfile` distinct du numéro de l’enveloppe, `bio-corps-06-r02-svg@1` dans la preview ou `bio-corps-06-r02-svg@1/historical-eyes` dans l’atelier sans contours naturels. Le profil décrit le rendu à l’export. Une ouverture sous un autre profil conserve les réglages et signale la projection locale.

## Sauvegarde individuelle

`bio-yeux-01/resident.mjs` expose `serializeResident(resident)` et `parseResident(json)`. Le format `microcosme.adult-resident` v1 exige les sections suivantes.

| Champ | Autorité et projection |
| --- | --- |
| `identity.id` | Identifiant persistant fourni par l’appelant. Son unicité dans un ensemble relève du futur consommateur. Aucune dérivation depuis le visage, la graine ou les identifiants SVG. |
| `biology` | Base `adult-h` ou `adult-f`, axes de morphologie du catalogue, ossature facultative, nuance naturelle et demandes faciales facultatives (`eyes`, `iris`, `details`, `brows`, `mouth`, `nose`). `marks` peut contenir les marques dont l’origine naturelle est fournie. |
| `physical` | État déclaré. Les réglages compatibles sont `corpulence`, `chest` ou `pectorals` selon la base, `thoraxDetails`, `abdominals`, `pubicHairLength` et `beard`. Les solveurs corporels interprètent les mesures relatives. |
| `acquired` | Marques acquises et cicatrices fournies, selon les structures des calques existants. L’origine d’une marque est fournie par son classement, jamais déduite de sa forme. Les identifiants de marques sont uniques sur les deux listes. |
| `voluntary` | Coiffure référencée par style et disposition, options du catalogue facultatives, teinture, rasage et maquillage facultatifs. La teinture prend le dessus sur l’aplat naturel. Le rasage masque la projection de la barbe tout en conservant son réglage. |
| `history` | Liste ordonnée d’entrées `{target, source}` renseignées par l’appelant. `target` désigne le champ ou l’élément modifié. Le socle conserve ces déclarations sans chronologie automatique. |
| `generation` | `null` pour un témoin défini à la main, ou `{seed, generatorVersion}` pour une provenance de génération. La restauration relit les données sauvegardées quelle que soit la version de génération déclarée. |

Les réglages facultatifs présents doivent être exprimés dans les formats normalisés des modules existants. Une incohérence, un champ inconnu, une valeur hors domaine ou une version de données incompatible déclenche une erreur. La géométrie et le SVG sont des dérivés. Les nombres de l’atelier décrivent la projection actuelle, sans unité biologique calibrée. Le modèle ne déduit ni prédisposition pileuse, ni pigmentation cutanée globale, ni texture ou longueur naturelle des cheveux à partir d’une coiffure. La barbe déclarée utilise le calque R02 avec sa catégorie graphique par défaut. La base corporelle ne détermine pas la présence ou l’absence d’une barbe. Les paramètres faciaux composites, dont les cernes, restent des entrées de projection. Leur répartition entre constitution et état évolutif reste ouverte. Le rendu des pigments liés suit les paramètres du compositeur. Le socle prend en charge l’aplat issu d’une teinte explicite chez l’habitant. Le mode de palette historique, les latences d’édition et la seconde base H/F relèvent de l’atelier.

## Rendu autonome

```js
import {parseResident, renderResident, r02RenderVersion} from './bio-yeux-01/resident.mjs';

const resident = parseResident(json);
const portrait = renderResident(resident, {representation: 'portrait', renderVersion: r02RenderVersion});
const pion = renderResident(resident, {representation: 'pawn'});
const miniature = renderResident(resident, {representation: 'thumbnail'});
```

`renderResident` renvoie une chaîne SVG et s’exécute sous Node ou dans un navigateur sans DOM. `renderVersion` sélectionne le profil graphique et vaut `r02RenderVersion` par défaut. La version du document reste indépendante de ce profil et de `generation.generatorVersion`. Les contours naturels, reliefs osseux, finitions abdominales et détails pelviens R02 sont actifs. Les trois cadrages réutilisent le profil atelier. La miniature utilise les simplifications de petite échelle du compositeur. Les dimensions d’affichage appartiennent au consommateur.

Chaque appel reçoit par défaut un identifiant d’instance distinct au sein du module. Pour comparer des chaînes SVG à identifiant stable, un appelant peut fournir `instance` avec des caractères ASCII alphanumériques, `_` ou `-`. Il réserve alors une valeur différente à chaque SVG monté dans le même document. Le rendu ne modifie pas le document d’habitant.
