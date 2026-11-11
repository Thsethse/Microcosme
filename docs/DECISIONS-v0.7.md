# Décisions individuelles v0.7

## Frontière entre perception et décision

`cognition.js` ne reçoit ni la carte réelle ni le monde complet. Ses fonctions `dominant`, `solutions`, `eligible` et `choose` lisent l’état personnel et la mémoire de l’habitant. Elles ne modifient pas cet état. Le hasard est fourni par `create(state, random)` ; le contrat de `random` est celui de `Math.random` : un nombre dans [0, 1[.

Le moteur observe les cases à distance de Manhattan ≤ 2 avant de décider et après un déplacement. Toutes les natures sont mémorisées, prairies comprises. Une observation enregistre : nature, heure absolue du jeu `(jour - 1) × 24 + heure`, révision. La révision augmente uniquement si la nature connue change ou devient connue. Une observation identique rafraîchit seulement la date. Les habitants proches alimentent les relations comme en v0.6.

Le compteur communal de bois, déjà affiché et sans localisation en v0.6, demeure une information publique : la perception en copie la valeur dans `memory.stock`. C’est la seule information collective de décision ; elle ne révèle aucun terrain. Aucun accès à un champ, une forêt ou une maison hors de portée ne met à jour la mémoire.

## Besoin et intention

Ordre de priorité conservé :

1. Faim ≥ 45 et réserve personnelle > 0 : manger.
2. Énergie < 25 : repos.
3. Faim ≥ 40 sans nourriture, ou réserve < 2 : chercher de la nourriture.
4. Stock communal de bois < 12 : chercher du bois.
5. Sinon : explorer.

Le besoin dominant et l’intention sont distincts : une réserve basse ne suffit pas à faire zigzaguer un habitant engagé dans un trajet. Une intention active garde sa destination et son explication tant qu’elle reste admissible dans la mémoire. Une solution plus proche nouvellement aperçue n’interrompt pas à elle seule une récolte déjà engagée.

Réévaluation : faim avec nourriture à manger, fatigue urgente, faim ≥ 40 sans réserve pendant un autre trajet, destination observée inadéquate, fin du trajet, objectif bois satisfait (stock ≥ 12), réserve ≥ 5 pendant un trajet agricole. Une exploration à la recherche d’une solution est interrompue lorsqu’une ressource pertinente devient connue. Un repos achevé est réévalué au pas suivant.

## Solutions plausibles et coût

Pour récolter ou se reposer, seuls les terrains mémorisés du type requis sont candidats. Un lieu échoué dans la même révision d’information est exclu. Pour explorer : cases dont la nature est inconnue d’abord, puis cases non visitées, puis autres cases. Les coordonnées et dimensions du monde sont connues, jamais la nature des cases cachées. Il n’existe pas d’obstacle ; le coût de marche est la distance de Manhattan.

Classement explicite :

`score = distance + max(0, 25 + coût - énergie) - familiarité`

- `coût = distance + 3` pour une récolte, distance sinon, correspondant aux dépenses existantes.
- La pénalité de fatigue est nulle pour le repos lui-même.
- `familiarité = 1` si au moins une réussite a été mémorisée pour cette action à cet endroit, sinon 0. Ce bonus borné ne favorise pas une destination arbitrairement lointaine.
- Choix parmi au plus trois candidats à un point de score du meilleur ; hasard uniforme injecté. La marge d’un point représente l’indifférence entre deux trajets séparés d’une case, pas une chance arbitraire de changer d’avis. Le tri est stable par indice à égalité.

Si une récolte non urgente ferait passer l’énergie sous 25 à son terme et qu’une maison utilisable est connue, repos anticipé avant de reprendre ce besoin. Une faim urgente sans nourriture passe avant ce détour anticipé. Sans champ/forêt connu, l’habitant explore ; sans maison utilisable quand il doit se reposer, il récupère sur place.

## Action, résultat, apprentissage

Une heure conserve une seule action ou un seul déplacement d’une case. Après la marche, l’observation locale peut invalider l’intention : le moteur note un échec observable et choisit une autre intention, sans second déplacement dans cette heure. Aucune récolte ne se produit à distance. Le terrain réel est vérifié lors de l’exécution, après l’observation locale.

`memory.experiences["action:case"]` contient réussites, échecs, dernier résultat, heure, révision d’information et cause observable. L’échec bloque cette option tant que la même révision est connue. Une observation qui révèle un nouveau terrain peut rouvrir l’option. Une réussite influence le classement des prochains choix. Les ressources restent inépuisables.

La mémoire conserve aussi `visited`, les relations sociales et les cinq souvenirs historiques. Le journal individuel est borné à douze événements significatifs (découverte groupée, révision, échec, changement d’intention), dont cinq sont affichés. L’inspecteur présente les champs et raisons produits par le moteur et ne lance aucune perception ou décision.

## Migration

La clé historique `microcosme-v03` et le repli `microcosme-v02` sont conservés ; le document sauvegardé porte `version: 7`. La validation et les copies de récupération v0.6 restent actives. Connaissances, intentions, expériences, journal, visites et relations sont sérialisés et validés.

Les anciennes listes `places` ne contenaient pas la nature observée. Elles sont conservées avec une nature/date inconnue, sans lire la carte actuelle pour inventer un souvenir. La destination d’une intention v0.6 de récolte ou repos fournit une seule déduction légitime (champ, arbre ou maison), datée « inconnue ». Les autres lieux sont réobservés au passage. Une ancienne partie peut donc connaître une phase de redécouverte ; les souvenirs sociaux et les identités sont préservés.

## Règles conservées et choix de conception

Aucune règle numérique de besoin ou conséquence n’a changé : faim ajoutée selon la loi (0–4), maximum 130 ; énergie −1/heure ; repas −38 de faim et −1 nourriture ; récolte +productivité (1–5), −3 énergie ; repos +6 sur place ou +18 en maison, énergie maximale 100 ; sociabilité, partage et confiance inchangés. Aucun épuisement, naissance, mort, maladie ou nouvelle ressource.

L’anticipation du trajet, la stabilité d’intention et le choix borné sont les nouvelles règles de décision demandées, pas des changements de jauges. L’outil divin « Prairie » permet uniquement la transformation manuelle nécessaire à l’expérience de référence ; aucune disparition naturelle de ressource n’est ajoutée. Aucun changement des règles validées au-delà de ce périmètre n’est nécessaire.
