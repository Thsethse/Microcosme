# Contrat technique destiné à Codex — intégration P5 ultérieure

**Document préparatoire, sans autorisation de programmation.** La mission P5-DOC ne modifie aucun module, test, workflow, asset ou fichier de sauvegarde. Le développement décrit ci-dessous nécessitera une mission d’implémentation distincte et une PR de code sans fusion automatique. Les inconnues des sources restent signalées ; elles ne sont pas résolues par invention de visages, de racines ou de corps.

## T1 — Base obligatoire et limites vérifiées

Réutiliser [P4-R1 publié](https://thsethse.github.io/Microcosme/preview/bio-vis-p4-r1/), snapshot `6cc2750c7a2caae406fd371de915170221baa9a8`, code et tests [PR #32, e9aadf8](https://github.com/Thsethse/Microcosme/tree/e9aadf830956dbfde172d25a30efa302f6bab7b1/bio-vis-p4-r1). Main auditée : `f5cb1967cef8fa7d0d58c622502cb6f784188e1d`, contenant les nouveaux PNG mais aucun modèle P5 programmé.

| Fait observé | Conséquence pour le futur travail |
| --- | --- |
| `catalogue.mjs` est une liste fermée de 18 styles | Le catalogue documentaire de 81 références ne devient pas exécutable par simple dépôt d’un fichier. Ne pas annoncer un chargement automatique existant. |
| `normalize()` dans `model.mjs` remplace un style inconnu par `classic` | Un nouvel ID doit réellement être pris en charge ; tester qu’il ne retombe pas silencieusement sur la coiffure classique. |
| `p4-render.mjs` sélectionne des constructions selon `kind` et l’ID, avec trois familles de calotte héritées | Réutiliser ses primitives et son repère ; ajouter les constructions requises dans le futur prototype isolé, sans remplacer le système dynamique. Ne pas affecter un `kind` générique pour satisfaire artificiellement le nombre. |
| `render.mjs` restaure les longueurs en gros plan seulement pour `braids` et `waist_waves` | Élargir la composition/cadrage localement pour les **nouveaux** modèles qui ont des longueurs avant. Ne pas reproduire l’erreur `headOnly` qui supprimait ces chemins. Préserver le comportement validé des 18 anciens. |
| `r1/model.mjs` calcule le contour du visage, les ancres et `fit` | Ces calculs restent l’autorité géométrique ; les nouveaux cheveux se construisent dans ce repère, pas sur les proportions des posters P5. |
| `coverageCap` protège le haut du crâne pour les calottes existantes | Conserver la correction des 18 modèles. Une crête, des côtés rasés ou des rangées tressées demandent des zones couvertes/exposées explicites, pas une calotte pleine systématique. |

Les huit modules de `r1/` et les personnages existants ne sont pas à refondre. Les limites de coiffure–corps documentées par P4 restent des observations ; cette préparation ne crée pas de moteur de collisions, de physique ou de déformation corporelle.

## T2 — Identifiants, provenance et cinq composantes

Conserver exactement les IDs existants, dans l’ordre P4-R1 :

`shaved`, `short`, `classic`, `bob`, `fringe_bob`, `mid_waves`, `long_straight`, `curls`, `long_curls`, `braids`, `bun`, `pony`, `waist_straight`, `waist_waves`, `waist_curls`, `afro`, `side_braid`, `asym_long`.

Les références `p5-001`–`p5-081` ne remplacent pas ces IDs et ne constituent pas une migration des sauvegardes. Prévoir une correspondance documentaire stable avec un ID de modèle et, si utile, d’arrangement. Deux références conservées peuvent partager une géométrie ; deux vignettes G/D d’une case peuvent exiger des arrangements différents. Ne pas compter des couleurs ou bijoux comme nouvelles bases.

| Élément à porter dans le futur catalogue | Exigence |
| --- | --- |
| Référence documentaire | ID stable, nom source, planche, fichier, SHA-256, numéro imprimé, L/C et vignette G/D |
| Géométrie | Contour, volumes, départs/terminaisons, zones couvertes ou découvertes ; aucune forme de visage/corps |
| Texture | Lisse, ondulée, bouclée, crépue stylisée, tressée ou locks ; détails indépendants de la couleur |
| Couleur | Palette/teinte et éventuelles zones de contraste séparées de la géométrie |
| Arrangement | Raie, attaches, orientation, regroupement et longueur, avec variantes G/D nommées |
| Accessoires | Options amovibles et leurs attaches ; possibilité « aucun » ; tissu jamais codé comme cheveux |
| Présentation/inspiration | Métadonnées descriptives seulement ; aucun filtre par sexe, origine, classe sociale ou personnalité |
| État | Existant / nouvelle construction / variante / rapprochement à vérifier ; inconnues de la source visibles |

Ce tableau définit des responsabilités de données, pas un schéma déjà ajouté au moteur. Ne pas introduire de dépendance aux champs biologiques, sociaux ou de personnalité pour autoriser une coiffure.

## T3 — Déformation dynamique sur les huit paramètres

Ne pas modifier les bornes ou la valeur neutre 1. Les paramètres appartiennent à la tête, pas aux images P5.

| Clé actuelle | Contrôle | Min. | Max. |
| --- | --- | ---: | ---: |
| `skull_width` | Largeur du crâne | 0,86 | 1,18 |
| `skull_height` | Hauteur du crâne | 0,88 | 1,18 |
| `forehead_width` | Largeur du front | 0,88 | 1,14 |
| `forehead_height` | Hauteur du front | 0,84 | 1,18 |
| `temple_width` | Largeur des tempes | 0,90 | 1,16 |
| `cheek_width` | Largeur des joues | 0,88 | 1,22 |
| `jowls` | Volume des bajoues | 0,75 | 1,35 |
| `jaw_width` | Largeur de la mâchoire | 0,82 | 1,22 |

Réutiliser `anchors` (crown, hairline, forehead, temple, side, ear, cheek, jowl, jaw, chin, nape), `hairAnchors` et `fit` du modèle existant. Les noms gauche/droite du modèle suivent le repère SVG ; G/D des fiches désigne seulement la vignette de la planche. Ne pas confondre ces deux conventions.

- Calotte et ligne frontale suivent le contour réel et les attaches du modèle ; côtés et passages près des joues/bajoues se corrigent localement.
- Un chignon/une queue suit son attache et la couronne ; une tresse suit ses racines et sa terminaison, avec entrelacs continus. Les longueurs restent une construction locale depuis la nuque, pas un redimensionnement uniforme de tout le dessin.
- Garder la cohérence des raccords lorsque hauteur du front et largeur du crâne se combinent. Ne pas modifier le visage pour cacher un débordement.
- Conserver la continuité des courbes et des détails pendant le mouvement des curseurs. Une répétition de mèches ne doit pas apparaître/disparaître par un seuil arbitraire sous une petite variation morphologique.
- Les paramètres sans effet pertinent sur une coiffure peuvent rester sans influence visible, comme dans P4 ; ils ne doivent pas déplacer une attache sans motif géométrique.
- Pour les styles rasés, crêtes, undercuts et tresses plaquées : déclarer les régions de crâne volontairement exposées et celles à couvrir. Les tests vérifient le recouvrement des seules régions attendues, sans boucher tout le front ni effacer les espaces entre rangées.

Cas combiné obligatoire conservé : crâne 1,18 × 1,18 ; front 1,14 × 1,18 ; tempes 0,90 ; joues 1,22 ; bajoues 1,35 ; mâchoire 0,82.

## T4 — Personnage entier, tête agrandie et petite échelle

Produire ces vues à partir de la **même géométrie et des mêmes ancrages** pour un état donné. L’agrandissement peut ajuster le cadrage et la taille du panneau ; il ne peut pas remplacer une coiffure par une calotte générique ou supprimer ses longueurs avant.

Conserver l’ordre des profondeurs : masse arrière, corps existant, visage/calotte et volumes latéraux, textures, puis longueurs avant. Les accessoires ont une profondeur et une attache explicites, séparées de la masse capillaire. La couronne tressée est du cheveu ; le diadème est un objet. Ne pas recouvrir les yeux par une pièce ajoutée au mauvais niveau.

Pour chaque nouveau modèle long ou tressé, préciser ce qui doit entrer dans le gros plan : implantation, continuité des mèches, tresse reconnaissable et ondulations. Une pointe à la taille peut être hors cadre si le corps entier la montre ; une tresse promise entière doit tenir avec ses attaches. Les 18 cadrages et miniatures existants restent la base de non-régression P4-R1, y compris les choix explicites de `smallScale`.

Tester sur les six corps P4 : référence, mince, large, épaules étroites, épaules larges, buste volumineux. Observer passage devant/derrière les épaules, contact au cou, superposition avec buste et bras. Documenter les croisements réellement constatés. Aucun détournement automatique des mèches ni nouveau système coiffure–corps n’est autorisé par ce dossier.

## T5 — Safari iPad et préservation du prototype

- Prévoir un prototype indépendant et une preview dédiée lors d’une future mission autorisée ; ne pas publier de nouvelle preview ni de code pendant P5-DOC.
- Garder contrôles tactiles, sélecteur, galerie, remise à zéro, huit curseurs et affichages lisibles. À 72–81 références, mesurer l’usage et le coût de rendu de la galerie avant d’imposer une architecture ou un budget d’images/s non mesuré.
- Préserver la direction vectorielle, les aplats et contours ocres, la préférence de mouvement réduit s’il y a animation. Pas de dépendance à une police ou image externe pour calculer la géométrie capillaire.
- Vérifier avec WebKit et Chromium aux formats de référence 820×1180, 1180×820, 768×1024 et 390×844 ; ces formats ne prétendent pas représenter tous les iPad physiques.
- Faire un essai final sur Safari iPad réel ; consigner modèle/iPadOS/Safari et confort des curseurs. Ne pas assimiler WebKit Playwright à cet essai matériel.
- Ne pas lire/écrire les sauvegardes du jeu, modifier le moteur principal ou migrer les données biologiques. Les styles ne déclenchent aucun comportement social ou psychologique.

## T6 — Plan des futurs tests automatisés

Ces tests sont **exigés pour l’implémentation ultérieure**, pas ajoutés ni exécutés par P5-DOC.

| Vérification | Critère attendu |
| --- | --- |
| Présence et résolution des IDs | Chaque style exposé se résout vers son modèle prévu, jamais vers `classic` par défaut ; provenance et variantes G/D traçables |
| Conservation des 18 existants | Identifiants, contrôle, modèle de tête, ancrages, géométrie et rendu aux trois échelles comparés à P4-R1 avant toute extension |
| Huit axes | Neutre, 256 sommets min/max, préréglages, cas combiné iPad et mélanges intermédiaires déterministes pour chaque géométrie/arrangement réellement supporté |
| Validité SVG | Chemins interprétables, longueurs et points finis, aucune coordonnée NaN/Infinity, cadres pertinents et éléments non coupés involontairement |
| Continuité | Petites variations d’un paramètre et combinaisons : déplacements bornés, attaches continues et pas de saut arbitraire de topologie |
| Ancrages | Racines, couronne, tempes et nuque stables dans le repère de tête ; pas de dépendance cachée à la forme du corps ou à l’identité du personnage |
| Recouvrement | Aucune fuite dans les régions censées couvertes, front et côtés volontairement rasés conservés, zones faciales lisibles |
| Vues partagées | Longueurs avant identiques entre corps et gros plan ; même détail ondulé/tressé, seul le cadrage change ; petite échelle inspectée séparément |
| Accessoires | Retrait possible sans supprimer la chevelure ; attache stable et pas d’accessoire pris pour du cheveu ; cas occultés explicitement traités |
| Indépendance | Changer couleur, sexe/origine/statut/personnalité sans restriction de disponibilité ni changement caché de géométrie ; tester aussi sans accessoires et en monochrome |
| Navigation tactile | Sélection de chaque entrée, huit curseurs, corps, reset, trois échelles ; aucune erreur console, référence ou ressource manquante |
| Jeu existant | Vérifications exigées par les workflows du dépôt, sans modifier ses fichiers ni ses sauvegardes |

Le dénominateur de test doit refléter les modèles/arrangements exécutables, pas seulement les fiches. À titre de dimensionnement, 81 styles × 256 sommets font 20 736 états avant les intermédiaires et arrangements supplémentaires ; cela n’établit pas que 81 bases géométriques distinctes sont nécessaires. La référence 74, accessoire avec cheveux cachés, ne doit pas être déguisée en modèle capillaire pour remplir ce compte.

## T7 — Validation graphique humaine et sortie de lot

Livrer ultérieurement des comparaisons sur les habitants P4-R1 : corps entier, gros plan et miniature, plusieurs visages/corps, monochrome, sans puis avec accessoires. Citer chaque ID et la variante G/D. Ne pas afficher les visages des posters comme résultat du moteur.

Pour les 16 doublons potentiels, comparer côte à côte les contours et l’implantation sans couleur ni parure. Une fusion de géométrie peut être proposée si les différences ne tiennent qu’à ces facteurs ; préserver les variantes d’arrangement et chaque lien vers sa source. Toute suppression/regroupement requiert justification et validation humaine, jamais une réduction automatique du nombre de références.

Un lot est techniquement vérifié lorsque sa matrice est passée et ses limites sont déclarées. Il est artistiquement validé seulement après décision explicite de l’utilisateur. Les deux statuts doivent rester distincts. Une PR de code, une publication de preview ou une CI verte n’autorise aucune fusion.

## T8 — Inconnues conservées et livrables nécessaires au lancement

- 74 : cheveux intégralement occultés ; aucune base capillaire inventée. 63-G, 66 et 67-D : implantation partiellement cachée. Utiliser éventuellement un modèle déjà validé sous l’accessoire, en le déclarant comme choix futur à valider, pas comme observation de la source.
- Les posters sont frontaux et souvent coupés au buste : dos, profils, nuque masquée, longueur complète de certaines mèches et construction sous les accessoires ne sont pas spécifiés par ces images.
- Certaines cases combinent deux constructions plutôt qu’un simple réglage. Le catalogue les conserve G/D ; l’implémentation doit annoncer ce qu’elle couvre réellement et ce qui reste à traiter.
- Le nombre final de bases après rapprochements et le découpage des futurs lots ne sont pas arbitrés par le seul objectif 72–81. Les 81 références restent disponibles ; les inconnues ci-dessus n’empêchent pas de terminer le dossier documentaire.

Avant programmation : mission d’implémentation explicite, révision de base vérifiée à nouveau, choix du lot et des arrangements visibles, traitement déclaré des cas occultés, puis branche de code indépendante. Aucun ajout aux fichiers du prototype ou du jeu par la présente PR documentaire.
