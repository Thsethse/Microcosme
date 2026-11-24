# Microcosme · BIO-INV-01 · Corrections A, B et C

La PR #48 part de `docs/bio-inv-01-corrections` à `52293e9`. Les trois lots sont appliqués dans l’ordre et restent en brouillon pour la revue. L’atelier corrigé conserve les composants graphiques, les ancrages, les enveloppes, les presets et les limites des rendus précédents. [PR #48](https://github.com/Thsethse/Microcosme/pull/48) · [Mission](../MISSION-CORRECTIONS.md) · [Audit #47](../RAPPORT.md)

| Lot | Commit | Résultat principal |
| --- | --- | --- |
| A · Fiabilité | `1ec6bef` | Archivage complet et tirage admissible sans repli forcé, avec rejeu versionné. |
| B · Utilité | `02df1e0`, `2da4ea2` | Domaines directs, confirmation des ajustements et options réellement disponibles. |
| C · Catalogue | `3bdeb7a` | 65-D devient un alias historique de 48-D dans la navigation ordinaire. |

## A · Fiabilité

Le document `microcosme.appearance` v1 est distinct de la sélection historique. Il conserve l’identifiant G/D/U, le corps, les huit valeurs morphologiques appliquées, les options actives et latentes, le mode des yeux, les demandes et les valeurs effectives à pleine précision, la nuance et son mode. Il garde l’identifiant historique et ses métadonnées, y compris les alias, ainsi que la graine et la version du tirage lorsqu’elles sont disponibles. L’import vérifie la version `bio-yeux-01-svg@1` et la cohérence du rejeu avant d’appliquer la sélection. Le JSON historique reste utilisable séparément et garde ses champs. Rejouer une version de rendu future demanderait une couche de compatibilité.

**Avant → après.** L’audit constatait la perte de la palette et des yeux après actualisation. Le cas 61-G, `bust`, `tall`, Bleu vif et `archive-bio-inv` restitue désormais le même SVG à instance normalisée et les mêmes pixels aux trois tailles dans chaque moteur. Les tests couvrent aussi les valeurs corrigées et latentes, le mode historique, les alias, les erreurs explicites et les archives anciennes.

Le nouveau tirage échantillonne uniformément les tuples entiers admissibles dans le modèle de propositions uniformes. Chaque coordonnée entière est produite par réduction sans biais de modulo et chaque tuple non admissible est rejeté. Les budgets de conversion et de propositions sont bornés. Une exhaustion signale un échec et laisse le rendu courant disponible. Le mode LCG d’origine est accessible pour rejouer précisément les anciennes graines, y compris son comportement de repli.

| Morphologie | Échecs / 4 096 | P95 des propositions | Maximum | Triplet (75,40,0) ancien → nouveau / témoin | Écart marginal maximal |
| --- | ---: | ---: | ---: | ---: | ---: |
| Neutre | 0 | 18 | 58 | 2 → 0 / 0 | 0,0254 |
| Allongée | 0 | 40 | 136 | 2 → 1 / 0 | 0,0249 |
| Large | 0 | 9 | 21 | 2 → 0 / 0 | 0,0361 |
| Cas iPad combiné | 0 | 14 | 51 | 2 → 0 / 0 | 0,0288 |
| Étroite | 0 | 225 | 645 | 732 → 1 / 3 | 0,0217 |
| Étroite et haute | 0 | 470 | 1 538 | 1 796 → 4 / 4 | 0,0271 |

Les **24 576** tirages sont admissibles et exactement rejoués. L’écart maximal observé de 0,0361 est inférieur au seuil de 0,06 défini avant mesure. Les fréquences du triplet sont toutes à moins d’un point de pourcentage du témoin. Les comparaisons de marginales ne constituent pas une validation exhaustive de la loi jointe. [Protocole avant mesure](PRELEVES-A.md) · [Histogrammes et temps Node](preuves/tirages.json)

## B · Utilité des paramètres

Chaque curseur d’œil présente les crans entiers directement admissibles en tenant les sept autres valeurs effectives fixes. Sa valeur courante à pleine précision reste utilisable entre deux crans entiers. Un intervalle vide à cette résolution désactive le curseur et laisse son réglage appliqué visible. Les demandes conjointes passent par une confirmation qui liste les valeurs avant et proposées. Les préréglages et morphologies utilisent le solveur existant et affichent les corrections avant application lorsque nécessaire. Les changements directs se font sur la base des valeurs appliquées. Les préréglages gardent leurs demandes et résultats antérieurs après confirmation.

- Les **576 tranches** des 72 contextes P3 reproduisent les résultats directs de l’audit, dont 514 tranches sans entier quand les demandes jointes restent fixées. Le test vérifie aussi tous les crans proposés en partant des valeurs effectives, qui sont le point de départ des curseurs.
- Le coin 159 expose **[−12, −10] ∪ [10, 12]**. À −9°, la largeur proposée passe de 94 à **93,74603271484375 %**. Dans les deux moteurs, annuler garde le rendu initial et appliquer rend cette largeur exacte. Le clavier et le tactile sautent les valeurs interdites dans le curseur direct.
- La largeur de Rond sur le coin morphologique 2 reste à **79,30454349517822 %** lorsque sa tranche ne contient aucun entier. Le curseur est désactivé avec une explication. Un changement morphologique qui modifierait les valeurs des yeux est soumis à confirmation.
- L’implantation capillaire est désactivée à crâne rasé, avec restauration de sa valeur lors du retour à une coupe qui l’utilise. Les six corps pilotent épaules, ventre et hanches. Les clés d’anciens JSON sont conservées.
- Les 126 références sont testées. Au contexte historique neutre, 56 rendent les accessoires actifs, 3 le contraste, 124 la palette et 108 un choix G/D. Les essais contrôlent 38-G, 50-D, 63-G, Rasée, les 26 nuances et les six corps. Les contrôles inactifs gardent leur valeur pour les états qui leur redonnent un effet. Le sélecteur réserve « Unique » aux références U et propose G/D pour les références qui ont les deux variantes.

La disponibilité compare les SVG émis aux trois tailles avec le même état, en faisant varier une seule option. Ce critère détecte l’effet structurel sur les calques. Il ne garantit pas que chaque différence d’un cran soit perceptible en miniature. Le monochrome conserve ses priorités historiques dans la sélection des couches, dont la suppression de certains contrastes et accessoires. L’aplat peint les surfaces capillaires encore présentes et respecte les liens et couches de contraste protégés. Les essais avant/après réutilisent BIO-YEUX-01 au même état effectif, sur fond clair et sombre et aux trois tailles.

## C · Catalogue capillaire

Le catalogue ordinaire passe de **120 à 119** entrées, avec 48-D comme entrée navigable pour la paire. Les **126** identifiants historiques restent accessibles, importables et exportables. Ouvrir 65-D conserve exactement son identifiant et affiche 48-D comme entrée ordinaire. Choisir explicitement cette entrée ouvre 48-D. 65-G reste une entrée indépendante. Les six anciens regroupements restent identiques, y compris 56-G/61-G, et 61-G conserve ses deux mèches.

Les 72 comparaisons de tracés des contextes d’audit ont réussi avant le regroupement et après. Seuls les attributs descriptifs et les groupes vides sont ignorés pour comparer les tracés. La recette raster vérifie ensuite **144 cas par moteur** sur fond ivoire et ardoise, aux trois tailles, avec zéro différence. Les deux identifiants passent les aller-retour avec le format historique et le format d’apparence.

## Non-régression et limites

Les 65 tests Node du dépôt, des palettes, des yeux et des trois lots passent, ainsi que les 19 tests Node des lots capillaires 1–3 exécutés dans leurs copies d’origine. Les suites navigateur du jeu, des lots capillaires, de BIO-COL-01 et de l’interface BIO-YEUX-01 publiée passent dans Chromium et WebKit. La recette corrigée couvre les vues iPad portrait et paysage et un écran de 390 px, les dimensions 300 px, 178 px et 70 × 70 px et les commandes clavier et tactiles.

Les mesures SVG portent sur les références et morphologies définies par l’audit. Le tirage est testé sur six morphologies et sa performance est mesurée en navigateur Linux. La validation artistique et l’essai sur Safari avec un iPad physique restent réservés au porteur du projet. Les anciens laboratoires Canvas et le jeu ne sont pas modifiés.

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/tests/corrections-browser.cjs
```

Le workflow rejoue également les suites navigateur historiques à leur révision d’origine. [Recette GitHub Actions du code publié](https://github.com/Thsethse/Microcosme/pull/48/checks)

## Publication vérifiée

Le commit `2878b59` ajoute les 12 fichiers statiques de `preview/bio-inv-01-corrections/`. La mise à jour `ec056ce134dec3edc1e7de30a4921aa6cdd6a7d7` ajuste le choix d’arrangement et le formulaire de demande conjointe dans ce dossier. La version finale est générée depuis `2da4ea2729abf233973781c7b57d30e609e0fae9`. Le mécanisme GitHub Pages, à partir de `main`, a été utilisé après l’autorisation explicite du porteur pour la publication statique isolée. Les 12 fichiers de la preview et 145 fichiers hérités ont été vérifiés en HTTPS, pour 157 contrôles concordants. Le jeu, les anciennes previews et les autres chemins de `main` conservent leurs fichiers. [Ouvrir la preview](https://thsethse.github.io/Microcosme/preview/bio-inv-01-corrections/) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45415691745) · [Empreintes vérifiées](preuves/pages.json)

| Moteur public | Essais sur visage étroit et haut | P95 calcul | Maximum calcul | Bouton testé sur le cas d’archive |
| --- | ---: | ---: | ---: | ---: |
| Chromium 151.0.7922.34 | 256, zéro échec | 3,8 ms | 10 ms | 94 ms |
| WebKit 26.5 | 256, zéro échec | 5 ms | 12 ms | 145 ms |

Les deux moteurs ont exécuté l’intégralité du parcours A/B/C sur l’URL publique, avec 144 comparaisons du lot C chacun et sans erreurs de page ni réponses HTTP en échec. Les temps du bouton incluent l’automatisation tactile et l’actualisation de l’interface. Le banc navigateur Linux utilise une exception de certificat pour le proxy du cloud. Le contrôle HTTPS indépendant des fichiers a utilisé le magasin système. Le premier passage en CI avait été arrêté par la vérification de propriété du dépôt lors de la lecture de la référence historique. Le banc indique désormais le seul checkout concerné à Git pour cette lecture. [Résultats navigateur](preuves/navigateurs-publics.json) · [Confirmation Chromium](preuves/chromium-confirmation.png) · [Confirmation WebKit](preuves/webkit-confirmation.png)
