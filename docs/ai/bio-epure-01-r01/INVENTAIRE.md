# Inventaire de l’éditeur adulte · BIO-EPURE-01-R01

Révision de référence `6d5484d9350b05cf1de3eee1a4173853685008f9` de la PR #78. Interface publiée BIO-SOCLE-02-R02 sous le chemin historique `preview/bio-socle-02-r01/`. La [méthode et les résultats de la confrontation](RAPPORT.md#vérification-de-lexhaustivité) précisent la couverture et les limites de l’observation.

Les guillemets signalent un libellé d’interface. **Défaut** indique une référence du modèle ou l’état initial, selon la ligne. Un bloc facultatif peut être absent alors que l’interface affiche son amorce normalisée. Les domaines listés sont nominaux. Le solveur peut les restreindre selon les autres traits. Une option individuelle qui ne possède pas de ligne dédiée se désigne par l’ID du sélecteur suivi de `@` et de sa valeur entre parenthèses. Les tableaux de commandes reprennent les informations de solveur, canon, archive et potentiel données juste avant dans leur groupe. Les valeurs écrites sans unité biologique sont des coordonnées ou des coefficients de projection.

**Arbitrage.** Chaque identifiant peut être repris dans une décision. Les effets décrits sont vérifiés. Le potentiel générateur et les actions proposées sont des hypothèses de travail. « Masquer » touche l’accès à l’écran. « Supprimer » distingue dans chaque cas le geste d’édition et la donnée ou le chemin de lecture. Voir la [carte des dépendances et la compatibilité](DEPENDANCES.md).

- [A — Anatomie et morphologie](#a--anatomie-et-morphologie)
- [B — Visage et proportions](#b--visage-et-proportions)
- [C — Yeux et sourcils](#c--yeux-et-sourcils)
- [D — Nez et bouche](#d--nez-et-bouche)
- [E — Cheveux et pilosité](#e--cheveux-et-pilosité)
- [F — Peau, marques et cicatrices](#f--peau-marques-et-cicatrices)
- [G — Palettes et couleurs](#g--palettes-et-couleurs)
- [H — Outils historiques et expérimentaux](#h--outils-historiques-et-expérimentaux)
- [I — Outils techniques](#i--outils-techniques)
- [J — Maquillage](#j--maquillage)

## A — Anatomie et morphologie

### A1 — Corps · bases et raccourcis

Le choix de base conserve la tête et retrouve les réglages corporels H/F mémorisés. Les bases historiques héritent de la silhouette P5. Les raccourcis du thorax et du bassin activent la même base et placent le focus sur leur premier réglage.

**Canon** `biology.body (H/F)`. **Archive et provenance** `character.body · v11+ pour H/F, sélection brute pour les six autres`. [adult-body](../../../bio-yeux-01/adult-body.mjs) · [catalogue](../../../bio-yeux-01/catalogue.mjs) · [adult-settings](../../../bio-yeux-01/adult-settings.mjs)

*Potentiel générateur.* Choisir explicitement H ou F dans un habitant adulte.

*Arbitrages proposés.* Conserver H/F. Regrouper les trois accès à la même base si la navigation reste facile. Archiver les six choix historiques dans un accès dédié. Les retirer du résolveur casserait l’ouverture de sélections anciennes.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A1.body` « Corps » | Atelier du thorax | Corps de référence · Corps de référence (`standard`), Silhouette mince (`slim`), Silhouette large (`broad`), Épaules étroites (`narrow`), Épaules larges (`shoulders`), Buste volumineux (`bust`), Base adulte masculine (H) (`adult-h`), Base adulte féminine (F) (`adult-f`) | Sélectionne le modèle du tronc. Gère l’échange des mémoires H/F et l’affichage des réglages compatibles. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |
| `A1.thoraxBody.adult-h` « Pectoraux · H adulte » | Atelier du thorax | Inactif au démarrage | Active `adult-h`, reprend sa mémoire et place le focus sur le volume thoracique. | Regrouper · retirer ce raccourci garde le choix Corps |
| `A1.thoraxBody.adult-f` « Poitrine · F adulte » | Atelier du thorax | Inactif au démarrage | Active `adult-f`, reprend sa mémoire et place le focus sur le volume thoracique. | Regrouper · retirer ce raccourci garde le choix Corps |
| `A1.pubicBody.adult-h` « Base H adulte » | Atelier du bassin | Inactif au démarrage | Active `adult-h`, reprend sa mémoire et place le focus sur l’état de pousse. | Regrouper · retirer ce raccourci garde le choix Corps |
| `A1.pubicBody.adult-f` « Base F adulte » | Atelier du bassin | Inactif au démarrage | Active `adult-f`, reprend sa mémoire et place le focus sur l’état de pousse. | Regrouper · retirer ce raccourci garde le choix Corps |

### A2 — Corpulence et ossature

Les largeurs multiplient des repères de la base. La corpulence déforme l’enveloppe autour de 50 %. Elle modifie les marges et la visibilité du thorax, du ventre et des reliefs. Les repères libellés sont des graduations, le curseur de corpulence reste continu.

**Canon** `biology.structure · physical.corpulence`. **Archive et provenance** `character.structure v12+ · character.corpulence v13+ · mémoire H/F`. [body-structure](../../../bio-yeux-01/body-structure.mjs) · [body-corpulence](../../../bio-yeux-01/body-corpulence.mjs) · [adult-body](../../../bio-yeux-01/adult-body.mjs) · [body-bone-reliefs](../../../bio-yeux-01/body-bone-reliefs.mjs) · [belly-details](../../../bio-yeux-01/belly-details.mjs)

*Potentiel générateur.* Tirer des demandes couplées, en distinguant l’enveloppe et l’ossature. La largeur de pied pourrait dépendre du support de représentation.

*Arbitrages proposés.* Conserver les axes anatomiques. Recalibrer uniquement après mesure des effets conjoints, car un changement déplace aussi les calques. Masquer la largeur du pied en mode habitant si le pion la garde. La supprimer du modèle ferait perdre les anciens réglages.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A2.corpulence` « Corpulence » | Thorax › Corpulence et ossature | 50 % · 0 à 100, continu · 9 repères A.rep | Modifie l’enveloppe externe et le recouvrement des reliefs. Affecte la lecture du thorax, de l’abdomen et du pli. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A2.corpulence-reset` « Réinitialiser la corpulence » | Thorax › Corpulence et ossature | — | Retire la demande explicite de corpulence. Revient à 50 %. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `A2.structure-neck` « Largeur du cou » | Thorax › Corpulence et ossature | 100 % · 70 à 130 %, pas 1 | Largeur de la jonction tête–tronc, indépendante de la largeur du crâne. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A2.structure-shoulders` « Largeur des épaules » | Thorax › Corpulence et ossature | 100 % · 70 à 130 %, pas 1 | Largeur de la ligne des épaules, propagée à la silhouette interpolée. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A2.structure-thorax` « Largeur du thorax » | Thorax › Corpulence et ossature | 100 % · 70 à 130 %, pas 1 | Largeur de la cage et espace alloué aux volumes thoraciques. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A2.structure-waist` « Largeur de la taille » | Thorax › Corpulence et ossature | 100 % · 75 à 125 %, pas 1 | Largeur de la taille, à la jonction avec les volumes du ventre et l’enveloppe de corpulence. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A2.structure-pelvis` « Largeur du bassin » | Thorax › Corpulence et ossature | 100 % · 70 à 130 %, pas 1 | Largeur de l’enveloppe pelvienne et emprise des repères du bas du tronc. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A2.structure-base` « Largeur de la base du pion » | Thorax › Corpulence et ossature | 100 % · 70 à 130 %, pas 1 | Largeur du pied du pion, distincte de l’anatomie pelvienne. | Masquer en mode habitant ou fixer par représentation · retirer du schéma perd une largeur archivée |
| `A2.structure-reset` « Réinitialiser les largeurs » | Thorax › Corpulence et ossature | — | Retire les demandes d’ossature personnalisées. Revient aux six largeurs à 100 %. | Conserver une remise à zéro explicite · retirer rend le retour manuel |

### A3 — Poitrine · F adulte

Le calque F et l’enveloppe sont recalculés par chestGeometry et chestOverlay. La largeur disponible varie avec ossature et corpulence. Avec volume nul, les cinq autres axes sont désactivés tout en gardant leurs demandes.

**Canon** `physical.chest`. **Archive et provenance** `character.chest v14–16+ · chestOrigin pour provenance · mémoire F`. [chest](../../../bio-yeux-01/chest.mjs) · [adult-body](../../../bio-yeux-01/adult-body.mjs) · [chest-r01](../../../bio-yeux-01/chest-r01.mjs) · [chest-before](../../../bio-yeux-01/chest-before.mjs)

*Potentiel générateur.* Conserver une demande et laisser le solveur imposer l’emprise disponible.

*Arbitrages proposés.* Conserver le volume. Regrouper ou masquer les cinq paramètres en mode avancé en gardant leur latence. Recalibrer change la distribution de projections. Retirer un axe demande une migration de chest et chestOrigin.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A3.chest-volume` « Volume » | Atelier du thorax | 0 % · 0 à 100, continu · 5 repères A.rep | Amplitude du volume mammaire et de son effet sur l’enveloppe. À zéro, les cinq autres demandes restent latentes. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A3.chest-width` « Largeur » | Atelier du thorax | 50 % · 0 à 100, continu | Assise transversale de chaque volume, limitée par la cage et l’écartement. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A3.chest-length` « Allongement » | Atelier du thorax | 46 % · 0 à 100, continu | Extension verticale des volumes et du contour inférieur. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A3.chest-roundness` « Rondeur » | Atelier du thorax | 62 % · 0 à 100, continu | Courbure du profil mammaire, en interaction avec largeur et allongement. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A3.chest-spacing` « Écartement » | Atelier du thorax | 43 % · 0 à 100, continu | Séparation relative des volumes autour de l’axe médian. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A3.chest-sag` « Affaissement » | Atelier du thorax | 24 % · 0 à 100, continu | Déplacement et étirement vers le bas du volume mammaire. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `A3.chest-reset` « Réinitialiser la poitrine » | Atelier du thorax | — | Retire le bloc de demandes mammaires et rétablit le rendu de référence. La provenance ancienne suit les règles de l’archive. | Conserver une remise à zéro explicite · retirer rend le retour manuel |

### A4 — Pectoraux · H adulte

Le solveur inscrit le relief dans la cage H d’après ossature et corpulence. Avec volume nul, les quatre autres axes restent mémorisés et inactifs.

**Canon** `physical.pectorals`. **Archive et provenance** `character.pectorals v17+ · mémoire H`. [pectorals](../../../bio-yeux-01/pectorals.mjs) · [adult-body](../../../bio-yeux-01/adult-body.mjs)

*Potentiel générateur.* Dissocier le niveau de relief de ses variantes graphiques.

*Arbitrages proposés.* Conserver le volume. Regrouper ou masquer les quatre variantes en mode avancé. Recalibrer change le modelé à volume égal. Supprimer une clé briserait la restitution, même en état plat.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A4.pectoral-volume` « Volume musculaire » | Atelier du thorax | 0 % · 0 à 100, continu | Relief musculaire H. À zéro, les quatre autres demandes restent latentes. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A4.pectoral-width` « Largeur » | Atelier du thorax | 55 % · 0 à 100, continu | Étendue horizontale du relief dans la cage. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A4.pectoral-height` « Hauteur » | Atelier du thorax | 46 % · 0 à 100, continu | Étendue verticale du relief selon les bords disponibles. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A4.pectoral-angularity` « Angularité » | Atelier du thorax | 62 % · 0 à 100, continu | Passage d’un contour arrondi à un contour plus anguleux. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A4.pectoral-definition` « Définition » | Atelier du thorax | 53 % · 0 à 100, continu | Lisibilité du modelé et des séparations pectorales. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A4.pectoral-reset` « Réinitialiser les pectoraux » | Atelier du thorax | — | Retire le bloc de demandes des pectoraux et revient à la référence. | Conserver une remise à zéro explicite · retirer rend le retour manuel |

### A5 — Aréoles et mamelons

Le support est la poitrine F, le relief pectoral H ou un thorax plat. Les références explicites H et F diffèrent. Sans bloc, le panneau invite à appliquer la référence. Le mamelon courant découle du dessin et des positions disponibles.

**Canon** `physical.thoraxDetails`. **Archive et provenance** `character.thoraxDetails v18+ et v21+ · historique v18–20 en source · mémoire H/F`. [thorax-details](../../../bio-yeux-01/thorax-details.mjs) · [adult-body](../../../bio-yeux-01/adult-body.mjs)

*Potentiel générateur.* Utiliser des réglages H/F optionnels. Le modèle peut garder une référence graphique explicite par base.

*Arbitrages proposés.* Conserver la référence. Masquer ou regrouper les détails fins. Recalibrer doit préserver les sorties sur supports plats et volumineux. Supprimer un champ oblige à relire sa valeur historique.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A5.thorax-detail-size` « Taille de l’aréole » | Atelier du thorax | H 36 %, F 44 % · 0 à 100, continu | Taille du détail aréolaire, bornée par la surface sur laquelle il est placé. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A5.thorax-detail-shape` « Forme de l’aréole » | Atelier du thorax | H 13 %, F 19 % · 0 à 100, continu | Aplatissement ou ovalisation de l’aréole. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A5.thorax-detail-pigment` « Pigmentation » | Atelier du thorax | H 44 %, F 48 % · 0 à 100, continu | Intensité du pigment dérivé de la peau, indépendamment de la couleur de cheveux. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A5.thorax-detail-horizontal` « Position horizontale » | Atelier du thorax | H 54 %, F 50 % · 0 à 100, continu | Déplacement latéral symétrique dans le support thoracique. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A5.thorax-detail-vertical` « Position verticale » | Atelier du thorax | H 52 %, F 48 % · 0 à 100, continu | Déplacement haut/bas dans le support thoracique. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A5.thorax-details-reference` « Appliquer les valeurs de référence » | Atelier du thorax | — | Écrit les cinq demandes de référence de la base active pour afficher le calque réglable. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |

### A6 — Musculature abdominale

Le solveur calcule l’échelle, le relief et la visibilité dans l’enveloppe de chaque base. La corpulence peut atténuer la définition. À volume nul, les trois autres demandes sont latentes.

**Canon** `physical.abdominals`. **Archive et provenance** `character.abdominals v19+ · mémoire H/F`. [abdominals](../../../bio-yeux-01/abdominals.mjs) · [adult-body](../../../bio-yeux-01/adult-body.mjs) · [belly-details](../../../bio-yeux-01/belly-details.mjs)

*Potentiel générateur.* Traiter comme état physique déclaré, avec ajustement graphique séparé.

*Arbitrages proposés.* Conserver le volume. Regrouper ou masquer les trois variantes en mode avancé. Modifier leur référence change aussi le calque abdominal sous forte corpulence. Supprimer ferait perdre des archives latentes.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A6.abdominal-volume` « Volume musculaire » | Thorax › Musculature abdominale | 0 % · 0 à 100, continu | Force du relief musculaire abdominal. À zéro, les trois autres demandes restent latentes. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A6.abdominal-definition` « Définition musculaire » | Thorax › Musculature abdominale | 56 % · 0 à 100, continu | Marquage du relief et des séparations musculaires, atténué par la corpulence. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A6.abdominal-width` « Largeur » | Thorax › Musculature abdominale | 52 % · 0 à 100, continu | Extension horizontale du relief dans le ventre disponible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A6.abdominal-obliques` « Développement des obliques » | Thorax › Musculature abdominale | 46 % · 0 à 100, continu | Développement des volumes latéraux en complément de la partie centrale. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `A6.abdominal-reset` « Réinitialiser les abdominaux » | Thorax › Musculature abdominale | — | Retire le bloc musculaire abdominal et revient à la référence. | Conserver une remise à zéro explicite · retirer rend le retour manuel |

### A7 — Atelier du bassin · pilosité

Le support dépend de la base, de l’ossature, du pli et de la corpulence. La pousse est une demande continue. Le prédicat de rendu accepte les états historiques adult, mature et elder, sans réglage d’âge en interface R02. R02 utilise un pointillé déterministe. Le détail appartient au tronc.

**Canon** `physical.pubicHairLength`. **Archive et provenance** `character.pubicHairLength v22+ · mémoire H/F · ancien profil v22 ambigu`. [pelvic-details](../../../bio-yeux-01/pelvic-details.mjs) · [pubic-stipple](../../../bio-yeux-01/pubic-stipple.mjs) · [adult-body](../../../bio-yeux-01/adult-body.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* L’état de pousse peut être une entrée déclarée. L’origine volontaire éventuelle demande un arbitrage distinct de la projection.

*Arbitrages proposés.* Conserver la valeur continue. Masquer son édition dans une vue simplifiée conserve le dessin et le JSON. Recalibrer change densité et couverture. Supprimer le champ ferait perdre le niveau exact dans les anciens v22.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `A7.pubic-hair-length` « État de pousse » | Atelier du bassin | 0 % · 0 à 100, continu · 6 repères A.rep | État de pousse projeté en densité et couverture du pointillé R02. Zéro retire le calque. Couleur dérivée selon le compositeur. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |

### A — Gabarits, graduations et automatismes

| ID et libellé sous « Corps » | Base du dessin et référence | Proposition pour le générateur et l’atelier |
| --- | --- | --- |
| `A.corps.standard` « Corps de référence » | Profil P5 hérité · silhouette=tee, chest=plain | Archiver le choix d’atelier · garder la résolution du modèle · historique uniquement · valeur d’ouverture |
| `A.corps.slim` « Silhouette mince » | Profil P5 hérité · silhouette=column, shoulders=0,85, belly=0,8, hips=0,85, chest=plain | Archiver le choix d’atelier · garder la résolution du modèle · historique uniquement |
| `A.corps.broad` « Silhouette large » | Profil P5 hérité · silhouette=trapezoid, shoulders=1,12, belly=1,3, hips=1,2, chest=plain | Archiver le choix d’atelier · garder la résolution du modèle · historique uniquement |
| `A.corps.narrow` « Épaules étroites » | Profil P5 hérité · silhouette=hourglass, shoulders=0,72, belly=1, hips=1,12, chest=plain | Archiver le choix d’atelier · garder la résolution du modèle · historique uniquement |
| `A.corps.shoulders` « Épaules larges » | Profil P5 hérité · silhouette=tee, shoulders=1,25, belly=1, hips=1, chest=plain | Archiver le choix d’atelier · garder la résolution du modèle · historique uniquement |
| `A.corps.bust` « Buste volumineux » | Profil P5 hérité · silhouette=pear, shoulders=1,25, belly=1,25, hips=1,12, chest=curves | Archiver le choix d’atelier · garder la résolution du modèle · historique uniquement |
| `A.corps.adult-h` « Base adulte masculine (H) » | Largeurs de référence par repère, de haut en bas 12, 48, 44, 39, 38, 36, 34 · pied 32 | Conserver · base adulte canonique |
| `A.corps.adult-f` « Base adulte féminine (F) » | Largeurs de référence par repère, de haut en bas 10,5, 37, 35, 28, 31, 42, 39 · pied 36 | Conserver · base adulte canonique |

| ID et repère de la Planche des corps | Hauteur relative | Rôle et incidence |
| --- | --- | --- |
| `A.repere.neck` « Base du cou » | 0 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |
| `A.repere.shoulders` « Épaules » | 0,12 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |
| `A.repere.thorax` « Thorax » | 0,26 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |
| `A.repere.waist` « Taille » | 0,4 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |
| `A.repere.abdomen` « Abdomen » | 0,47 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |
| `A.repere.hips` « Hanches » | 0,57 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |
| `A.repere.pelvis` « Base pelvienne » | 0,6666666666666666 | Ancrage dans la silhouette adulte · conserver la géométrie · masquer les repères graphiques garde le calcul |

| ID et libellé du repère | Commande · valeur | Incidence et arbitrage |
| --- | --- | --- |
| `A.rep.corpulence.0` « Très maigre » | Corpulence · 0 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.12.5` « Maigre » | Corpulence · 12,5 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.25` « Mince » | Corpulence · 25 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.37.5` « Légèrement mince » | Corpulence · 37,5 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.50` « Standard » | Corpulence · 50 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.62.5` « Enrobé » | Corpulence · 62,5 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.75` « Corpulent » | Corpulence · 75 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.87.5` « Obèse » | Corpulence · 87,5 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.corpulence.100` « Très obèse » | Corpulence · 100 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.poitrine.0` « Plate » | Volume · 0 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.poitrine.25` « Petite » | Volume · 25 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.poitrine.50` « Moyenne » | Volume · 50 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.poitrine.75` « Volumineuse » | Volume · 75 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.poitrine.100` « Très volumineuse » | Volume · 100 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.pousse.0` « Rasé » | État de pousse · 0 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.pousse.10` « Début de repousse » | État de pousse · 10 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.pousse.25` « Texture fine » | État de pousse · 25 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.pousse.50` « Texture dense » | État de pousse · 50 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.pousse.75` « Points rapprochés » | État de pousse · 75 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |
| `A.rep.pousse.100` « Couverture presque pleine » | État de pousse · 100 % | Graduation visuelle · aucun seuil ajouté à la validation · regrouper les étiquettes garde la précision du champ |

| ID · composant calculé | Fonction, dépendances et données | Proposition et conséquence |
| --- | --- | --- |
| `A.auto.ossature` · Enveloppe adulte | Interpôle les largeurs du cou au pied avec tangentes partagées. Les huit axes du visage déterminent la tête. Sortie dérivée de biology.body, structure et physical.corpulence. | Conserver le solveur · revoir la calibration déplacerait plusieurs calques simultanément |
| `A.auto.reliefs` · Reliefs osseux | Reliefs activés dans le profil courant, modulés par la maigreur et recouverts par les volumes thoraciques. Aucune clé indépendante. | Automatiser comme aujourd’hui · masquer la planche conserve le rendu · supprimer le calque modifierait le dessin courant |
| `A.auto.pli` · Pli abdominal | Dépend de l’enveloppe et de la corpulence. Dessin courant automatique · ancien avant/R01 encore disponible en planche. | Conserver le calcul · archiver le comparatif · changer le pli déplacerait les réserves du bassin |
| `A.auto.nombril` · Nombril courant | Rendu automatique lié au pli et au profil graphique du bas du tronc. Les réglages v20 sont conservés dans la source historique. | Conserver le dessin courant et la lecture v20 · masquer uniquement la commande historique déjà absente |
| `A.auto.mamelon` · Mamelon courant | Dérivé du calque aréolaire explicite, du support, de la base et du profil. Les anciennes dimensions restent en provenance. | Conserver · rétablir un réglage manuel demanderait un arbitrage séparé |
| `A.auto.bassin` · Géométrie pelvienne | Forme automatique H/F si profil et base compatibles. Réserves calculées autour du pli. Pointillé déterministe à partir de l’état de pousse et du pigment. | Conserver · archiver R01 en planche · supprimer le porteur casserait le calque de pousse |
| `A.auto.memoire` · Mémoires corporelles H/F | Carte de réglages distincte par base active ou inactive. La restauration remplace la mémoire. La fiche habitant n’a qu’une base. | Conserver pour l’atelier · masquer en vue de génération · retirer la mémoire perd les demandes de la base inactive |

## B — Visage et proportions

### B1 — Morphologie du visage

Huit facteurs relatifs au gabarit, référence 1. Le modèle P5-I6 déplace contour, points d’ancrage et calotte. Les calques et réserves sont recalculés à partir du visage résultant.

**Canon** `biology.morphology`. **Archive et provenance** `character.morphology et clés brutes historiques · dès v1`. [catalogue](../../../bio-yeux-01/catalogue.mjs) · [appearance](../../../bio-yeux-01/appearance.mjs)

*Potentiel générateur.* Échantillonner l’espace morphologique, sous réserve d’arbitrer les corrélations et la distribution.

*Arbitrages proposés.* Conserver les axes. Masquer les scénarios QA du sélecteur principal garde leurs vecteurs en test. Recalibrer un axe modifie potentiellement tous les solveurs faciaux. Retirer un axe perd une composante de recharge.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `B1.morph` « Morphologie du visage » | Personnage et palette | Neutre · Neutre (`neutral`), Cas iPad combiné (`ipad`), Allongé · front haut (`tall`), Large · joues et bajoues (`broad`), Tous les minima (`min`), Tous les maxima (`max`), Combinaison libre (`custom` · état) | Applique les huit coefficients de la référence sélectionnée. Combinaison libre indique une édition individuelle. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |
| `B1.volet.morph-panel.396` « Ajuster les paramètres du visage » | Paramètres du visage | Replié | Déplie les huit réglages de morphologie du visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `B1.morph-skull_width` « Largeur du crâne » | Paramètres du visage | 1 · 0,86 à 1,18, pas 0,01 | Largeur du crâne et recalage des ancrages faciaux et de la calotte. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `B1.morph-skull_height` « Hauteur du crâne » | Paramètres du visage | 1 · 0,88 à 1,18, pas 0,01 | Hauteur du crâne et déplacement coordonné du contour et des ancrages. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `B1.morph-forehead_width` « Largeur du front » | Paramètres du visage | 1 · 0,88 à 1,14, pas 0,01 | Largeur de la zone frontale du visage et adaptation de la calotte. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `B1.morph-forehead_height` « Implantation capillaire » | Paramètres du visage | 1 · 0,84 à 1,18, pas 0,01 | Déplacement relatif de la ligne capillaire selon la coupe. Test de différence SVG. Valeur latente lorsque l’effet est nul. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `B1.morph-temple_width` « Largeur des tempes » | Paramètres du visage | 1 · 0,9 à 1,16, pas 0,01 | Largeur latérale des tempes et implantation des côtés de la coiffure. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `B1.morph-cheek_width` « Largeur des joues » | Paramètres du visage | 1 · 0,88 à 1,22, pas 0,01 | Écart du contour des joues et espace disponible pour les calques. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `B1.morph-jowls` « Volume des bajoues » | Paramètres du visage | 1 · 0,75 à 1,35, pas 0,01 | Amplitude du bas de joue et raccord avec la mâchoire. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `B1.morph-jaw_width` « Largeur de la mâchoire » | Paramètres du visage | 1 · 0,82 à 1,22, pas 0,01 | Largeur de la mandibule, du contour inférieur et de la surface disponible pour la barbe. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |

**B.morphologie — Références de morphologie**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `B.morphologie.neutral` « Neutre » | Les huit valeurs à 1 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `B.morphologie.ipad` « Cas iPad combiné » | skull_width=1,18, skull_height=1,18, forehead_width=1,14, forehead_height=1,18, temple_width=0,9, cheek_width=1,22, jowls=1,35, jaw_width=0,82 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `B.morphologie.tall` « Allongé · front haut » | skull_width=0,94, skull_height=1,16, forehead_width=0,96, forehead_height=1,17, temple_width=0,95, cheek_width=0,94, jowls=0,88, jaw_width=0,94 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `B.morphologie.broad` « Large · joues et bajoues » | skull_width=1,16, skull_height=0,95, forehead_width=1,08, forehead_height=0,96, temple_width=1,12, cheek_width=1,2, jowls=1,32, jaw_width=1,12 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `B.morphologie.min` « Tous les minima » | skull_width=0,86, skull_height=0,88, forehead_width=0,88, forehead_height=0,84, temple_width=0,9, cheek_width=0,88, jowls=0,75, jaw_width=0,82 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `B.morphologie.max` « Tous les maxima » | skull_width=1,18, skull_height=1,18, forehead_width=1,14, forehead_height=1,18, temple_width=1,16, cheek_width=1,22, jowls=1,35, jaw_width=1,22 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `B.morphologie.custom` « Combinaison libre » | État de saisie libre | Conserver cet état si la saisie libre reste accessible |

Le profil « Cas iPad combiné » applique le vecteur d’essai aux huit axes. Le champ `cut` du cas technique demeure dans sa fixture. Le preset et l’option « Combinaison libre » ne deviennent pas un trait des habitants. [P5-I6](../../../preview/bio-vis-p5-i6/model.mjs) · [Cas de couverture](../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs)

## C — Yeux et sourcils

### C1 — Atelier du visage · Réglages des yeux

Prend le contour P5 puis calcule les réserves entre contour, arcade, milieu et nez hérité. Le rapport hauteur/largeur est limité. Les curseurs indexent des valeurs admissibles au contexte courant. En mode Historique, l’ouverture héritée est rendue avec le profil courant et les curseurs montrent une amorce admissible.

**Canon** `biology.face.eyes`. **Archive et provenance** `eyes · v1+ · forme, demandes, effectifs et provenance de tirage`. [eyes](../../../bio-yeux-01/eyes.mjs) · [eye-domain](../../../bio-yeux-01/eye-domain.mjs) · [app](../../../bio-yeux-01/app.mjs)

*Potentiel générateur.* Générer une demande couplée à la morphologie et stocker les valeurs, avec le solveur comme filtre.

*Arbitrages proposés.* Conserver les 8 axes et les contrôles de domaine. Regrouper ou masquer les commandes de rejeu côté diagnostic. Réétalonner un axe change les domaines transmis à tous les calques. Retirer un axe impose de migrer ses anciens vecteurs.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `C1.eye-preset` « Forme » | Atelier du visage | Historique · Historique (`historical`), Rond (`round`), Ovale (`oval`), Amande (`almond`), Étroit (`narrow`), Relevé (`upturned`), Tombant (`downturned`), Paupière lourde (`heavy`), Demi-lune (`crescent`), Extrême minimum (`minimum`), Extrême maximum (`maximum`), Personnalisé (`custom` · état) | Sélectionne le contour hérité, un vecteur de forme ou les bornes conjointes. Personnalisé est un état affiché. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |
| `C1.eye-width` « Largeur » | Atelier du visage | 100 % · 75 à 120 % (référence pour personnaliser) · amorce affichée 89,52 % | Étendue horizontale de l’ouverture soumise à son enveloppe. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-height` « Hauteur d’ouverture » | Atelier du visage | 100 % · 40 à 130 % (référence pour personnaliser) · amorce affichée 82,15 % | Étendue verticale, soumise au rapport hauteur/largeur et à l’espace sous les sourcils. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-upper` « Courbure supérieure » | Atelier du visage | 100 % · 50 à 150 % (référence pour personnaliser) · amorce affichée 100 % | Part et courbure de l’arc supérieur. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-lower` « Courbure inférieure » | Atelier du visage | 100 % · 30 à 140 % (référence pour personnaliser) · amorce affichée 100 % | Part et courbure de l’arc inférieur. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-tilt` « Inclinaison » | Atelier du visage | 0 ° · -12 à 12 ° (référence pour personnaliser) · amorce affichée 0° | Rotation symétrique des ouvertures par rapport aux ancrages. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-taper` « Effilement des coins » | Atelier du visage | 48 % · 0 à 100 % (référence pour personnaliser) · amorce affichée 48 % | Pincement progressif aux coins. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-upperPeak` « Décalage du sommet supérieur » | Atelier du visage | 0 % · -20 à 20 % (référence pour personnaliser) · amorce affichée 0 % | Décalage latéral du sommet supérieur le long de l’ouverture. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.eye-lowerPeak` « Décalage du sommet inférieur » | Atelier du visage | 0 % · -20 à 20 % (référence pour personnaliser) · amorce affichée 0 % | Décalage latéral du sommet inférieur le long de l’ouverture. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `C1.random-eyes` « Tirer les yeux » | Atelier du visage | — | Tire une ouverture depuis la graine, le visage et la version de tirage sélectionnée. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `C1.reset-eyes` « Yeux historiques » | Atelier du visage | — | Reprend les ouvertures historiques et efface les métadonnées du tirage courant. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `C1.draw-version` « Version du tirage » | Atelier du visage | Admissible · version actuelle · Admissible · version actuelle (`xoshiro128ss-rejet-v2`), Historique · rejeu v1 (`lcg-v1`) | Choisit le tirage admissible actuel ou le rejeu du tirage historique. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `C1.seed` « Graine du tirage » | Atelier du visage | Microcosme · texte | Renseigne la graine consommée par Tirer les yeux. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

### C2 — Iris et pupilles

Iris centrés sur les points pigmentaires et découpés par l’ouverture. Le solveur contrôle la proportion de la pupille et le décor secondaire. Personnalisation éteinte au démarrage.

**Canon** `biology.face.iris`. **Archive et provenance** `iris v2+ · requested/effective ou latent · provenance de tirage`. [iris](../../../bio-yeux-01/iris.mjs) · [iris-editor](../../../bio-yeux-01/iris-editor.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Séparer nuances, géométrie et cas particuliers avant tout choix de distribution.

*Arbitrages proposés.* Conserver pigment et géométrie. Masquer les combinaisons avancées si leurs valeurs restent importables. Recalibrer en tenant compte des petites ouvertures et des trois échelles. Retirer une clé ou une nuance casse les anciens iris sauvegardés.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `C2.iris-active` « Personnaliser les iris et les pupilles » | Iris et pupilles | Décoché | Active les iris avec la référence normalisée ou la dernière demande latente. Décocher conserve la demande. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C2.iris-primary` « Nuance principale » | Iris et pupilles | Noisette · 16 nuances · voir G.iris | Sélectionne le pigment principal sous le masque des ouvertures. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C2.iris-shape` « Forme de la pupille » | Iris et pupilles | Circulaire · Circulaire (`circle`), Fente verticale (`vertical`), Fente horizontale (`horizontal`), Losange (`diamond`), Étoile à cinq branches (`star`), Anneau (`ring`) | Sélectionne le motif de la pupille dans l’iris. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C2.iris-hetero` « Hétérochromie » | Iris et pupilles | Aucune · Aucune (`none`), Complète (`complete`), Centrale (`central`) | Change la répartition du pigment secondaire, par œil ou au centre de l’iris. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C2.iris-secondary` « Nuance secondaire » | Iris et pupilles | Bleu · 16 nuances · voir G.iris | Pigment alternatif. Absent du rendu sans hétérochromie. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `C2.iris-irisSize` « Taille de l’iris » | Iris et pupilles | 100 % · 60 à 140 %, pas 1 (référence pour personnaliser) | Échelle de l’iris sous le masque d’ouverture. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C2.iris-irisRatio` « Rapport largeur/hauteur » | Iris et pupilles | 1 · 0,75 à 1,25, pas 0,01 (référence pour personnaliser) | Écrasement ou étirement horizontal de l’iris. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C2.iris-pupilSize` « Taille de la pupille » | Iris et pupilles | 45 % · 15 à 80 %, pas 1 (référence pour personnaliser) | Proportion de la pupille inscrite dans l’iris. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C2.iris-outline` « Contour de l’iris » | Iris et pupilles | 5 % · 0 à 10 %, pas 1 (référence pour personnaliser) | Épaisseur du contour de l’iris. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C2.iris-secondarySize` « Zone secondaire » | Iris et pupilles | 50 % · 0 à 80 %, pas 1 (référence pour personnaliser) | Taille de la zone secondaire de l’hétérochromie centrale. Latente hors du mode central. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `C2.iris-random` « Tirer iris et pupilles » | Iris et pupilles | — | Propose les iris par une graine, dans les domaines de la configuration courante. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `C2.iris-reset` « Rétablir les pigments historiques » | Iris et pupilles | — | Revient à la projection historique pour les iris. Efface la demande latente de ce module. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `C2.iris-seed` « Graine des iris » | Iris et pupilles | Microcosme · texte | Saisit la graine consommée par le tirage de ce module. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

### C3 — Paupières, cils et contours

Le solveur s’appuie sur les bords et réserves de l’œil. Certains axes deviennent inactifs sans pli, cil, cerne ou poche. La personnalisation est éteinte au démarrage. Le profil R02 possède déjà son contour naturel sans cette personnalisation.

**Canon** `biology.face.details`. **Archive et provenance** `details v3+ · requested/effective ou latent · provenance de tirage`. [details](../../../bio-yeux-01/details.mjs) · [details-editor](../../../bio-yeux-01/details-editor.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Introduire des valeurs de détail selon la visibilité utile. L’origine des cernes et poches reste ouverte.

*Arbitrages proposés.* Conserver les champs reconnus. Regrouper et masquer les axes inactifs. Fixer un défaut d’atelier s’évalue avec l’empreinte de nez et d’eyeliner. Supprimer un axe casse des demandes archivées.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `C3.details-active` « Personnaliser les détails des yeux » | Paupières, cils et contours | Décoché | Active les détails des yeux avec la référence normalisée ou la dernière demande latente. Décocher conserve la demande. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C3.volet.details.255` « Cils » | Paupières, cils et contours | Ouvert au démarrage | Déplie les axes de cils dans le panneau courant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C3.detail-lashes-count` « Nombre de pointes » | Cils | 1 · 0 à 3, pas 1 (référence pour personnaliser) | Nombre de cils disponibles le long de la paupière. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lashes-length` « Longueur » | Cils | 8 % · 5 à 15 %, pas 1 (référence pour personnaliser) | Longueur du trait de cil. Latente sans cil. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lashes-spacing` « Espacement » | Cils | 48 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Répartition des cils sur le bord supérieur. Latente en dessous de deux cils. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.volet.details.259` « Contours » | Paupières, cils et contours | Replié | Déplie les axes de contours dans le panneau courant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C3.detail-contours-upper` « Contour supérieur » | Contours | 115 % · 50 à 250 %, pas 1 (référence pour personnaliser) | Intensité du trait de contour supérieur. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-contours-lower` « Contour inférieur » | Contours | 74 % · 50 à 200 %, pas 1 (référence pour personnaliser) | Intensité du trait de contour inférieur. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.volet.details.262` « Paupière supérieure » | Paupières, cils et contours | Replié | Déplie les axes de paupière supérieure dans le panneau courant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C3.detail-upper-count` « Nombre de plis » | Paupière supérieure | 1 · 0 à 2, pas 1 (référence pour personnaliser) | Nombre de plis de la paupière supérieure. Suit la réserve disponible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-upper-distance` « Distance à l’œil » | Paupière supérieure | 34 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Écart des plis à l’ouverture de la paupière supérieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-upper-length` « Longueur » | Paupière supérieure | 76 % · 20 à 100 %, pas 1 (référence pour personnaliser) | Portée des plis de la paupière supérieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-upper-curve` « Courbure » | Paupière supérieure | 36 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Courbure des plis de la paupière supérieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-upper-thickness` « Épaisseur » | Paupière supérieure | 33 % · 10 à 100 %, pas 1 (référence pour personnaliser) | Épaisseur du tracé de la paupière supérieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-upper-intensity` « Intensité » | Paupière supérieure | 42 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Force du pigment des plis de la paupière supérieure. Latente sans pli. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.volet.details.269` « Paupière inférieure » | Paupières, cils et contours | Replié | Déplie les axes de paupière inférieure dans le panneau courant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C3.detail-lower-count` « Nombre de plis » | Paupière inférieure | 0 · 0 à 2, pas 1 (référence pour personnaliser) | Nombre de plis de la paupière inférieure. Suit la réserve disponible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lower-distance` « Distance à l’œil » | Paupière inférieure | 34 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Écart des plis à l’ouverture de la paupière inférieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lower-length` « Longueur » | Paupière inférieure | 76 % · 20 à 100 %, pas 1 (référence pour personnaliser) | Portée des plis de la paupière inférieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lower-curve` « Courbure » | Paupière inférieure | 36 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Courbure des plis de la paupière inférieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lower-thickness` « Épaisseur » | Paupière inférieure | 33 % · 10 à 100 %, pas 1 (référence pour personnaliser) | Épaisseur du tracé de la paupière inférieure. Latente sans pli visible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-lower-intensity` « Intensité » | Paupière inférieure | 42 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Force du pigment des plis de la paupière inférieure. Latente sans pli. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.volet.details.276` « Cernes et poches » | Paupières, cils et contours | Replié | Déplie les axes de cernes et poches dans le panneau courant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C3.detail-shadows-intensity` « Intensité des cernes » | Cernes et poches | 0 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Intensité des cernes, indépendamment de leur emprise. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-shadows-width` « Largeur des cernes » | Cernes et poches | 68 % · 30 à 100 %, pas 1 (référence pour personnaliser) | Largeur du cerne sous l’œil. Latente si le cerne est invisible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-shadows-height` « Hauteur des cernes » | Cernes et poches | 46 % · 10 à 100 %, pas 1 (référence pour personnaliser) | Hauteur de la trace de cerne. Latente si le cerne est invisible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-shadows-volume` « Volume des poches » | Cernes et poches | 0 % · 0 à 100 %, pas 1 (référence pour personnaliser) | Relief des poches sous les yeux. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.detail-shadows-puffWidth` « Largeur des poches » | Cernes et poches | 67 % · 30 à 100 %, pas 1 (référence pour personnaliser) | Largeur des poches sous les yeux. Latente à volume nul. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C3.details-random` « Tirer les détails » | Paupières, cils et contours | — | Propose les détails des yeux par une graine, dans les domaines de la configuration courante. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `C3.details-reset` « Rétablir les contours historiques » | Paupières, cils et contours | — | Revient à la projection historique pour les détails des yeux. Efface la demande latente de ce module. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `C3.details-seed` « Graine des détails » | Paupières, cils et contours | Microcosme · texte | Saisit la graine consommée par le tirage de ce module. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

### C4 — Sourcils

Le solveur utilise l’ouverture, arcade, contour, espace médian et pigment résolu des cheveux. Sans sourcils suspend géométrie et raccourcis de forme. Personnalisation éteinte au démarrage.

**Canon** `biology.face.brows`. **Archive et provenance** `brows v4+ · requested/effective ou latent · pigment et provenance de tirage`. [brows](../../../bio-yeux-01/brows.mjs) · [brows-editor](../../../bio-yeux-01/brows-editor.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Les formes et le lien pigmentaire sont utilisables. La nature d’une fente ou disparition nécessite un arbitrage.

*Arbitrages proposés.* Conserver géométrie et couleur. Regrouper les cas particuliers. Fixer un lien pigmentaire demande de préserver la nuance indépendante latente. Supprimer des modes fait perdre les demandes et leurs formes dans les archives.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `C4.brows-active` « Personnaliser les sourcils » | Sourcils | Décoché | Active les sourcils avec la référence normalisée ou la dernière demande latente. Décocher conserve la demande. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brows-preset` « Silhouette de référence » | Sourcils | Personnalisés · Personnalisés (`custom`), Droits (`straight`), Arrondis (`round`), Anguleux (`angular`), Ascendants (`rising`), Descendants (`falling`), En S (`inflected`), Épais (`thick`), Effilés (`fine`), Courts (`short`) | Applique un vecteur de forme et conserve les réglages chromatiques courants. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brows-absent` « Sans sourcils » | Sourcils | Décoché | Retire visuellement les sourcils réglables et met les autres demandes en sommeil. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brows-monobrow` « Monosourcil » | Sourcils | Décoché | Prolonge les tracés vers une jonction médiane si la géométrie le permet. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brows-slit` « Sourcil fendu » | Sourcils | Décoché | Ajoute une interruption graphique dans un sourcil, sous contrainte de sa forme. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brows-colour-mode` « Mode chromatique » | Sourcils | Identique aux cheveux · Identique aux cheveux (`linked`), Cheveux légèrement assombris (`darker`), Indépendante (`independent`) | Suit la teinte des cheveux, la fonce ou utilise la nuance indépendante. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brows-colour` « Nuance indépendante » | Sourcils | Brun chocolat · 26 nuances · voir G.cap | Renseigne la nuance indépendante. Conservée lorsque le mode est lié. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `C4.volet.brows.240` « Géométrie » | Sourcils | Ouvert au démarrage | Déplie les axes de géométrie dans le panneau courant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `C4.brow-length` « Longueur » | Sourcils | 100 % · 50 à 125 % (référence pour personnaliser) | Longueur de la silhouette du sourcil. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-thickness` « Épaisseur » | Sourcils | 100 % · 20 à 220 % (référence pour personnaliser) | Épaisseur du trait du sourcil. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-arc` « Hauteur d’arc » | Sourcils | 35 % · 0 à 100 % (référence pour personnaliser) | Hauteur de la courbe au-dessus de l’œil. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-summit` « Position du sommet » | Sourcils | 60 % · 20 à 80 % (référence pour personnaliser) | Position longitudinale du sommet de l’arc. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-tilt` « Inclinaison » | Sourcils | 0 ° · -20 à 20 ° (référence pour personnaliser) | Inclinaison de la silhouette. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-angularity` « Angularité » | Sourcils | 20 % · 0 à 100 % (référence pour personnaliser) | Transition entre arc souple et cassure anguleuse. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-height` « Hauteur sur le visage » | Sourcils | 50 % · 0 à 100 % (référence pour personnaliser) | Écart vertical entre le sourcil et l’œil. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-taper` « Affinement de la pointe » | Sourcils | 65 % · 0 à 100 % (référence pour personnaliser) | Effilement de l’extrémité. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brow-spacing` « Écartement » | Sourcils | 50 % · 0 à 100 % (référence pour personnaliser) | Écartement des deux sourcils autour de la ligne médiane. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `C4.brows-random` « Tirer les sourcils » | Sourcils | — | Propose les sourcils par une graine, dans les domaines de la configuration courante. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `C4.brows-reset` « Rétablir les sourcils historiques » | Sourcils | — | Revient à la projection historique pour les sourcils. Efface la demande latente de ce module. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `C4.brows-seed` « Graine des sourcils » | Sourcils | Microcosme · texte | Saisit la graine consommée par le tirage de ce module. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

**C.forme — Formes des yeux**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `C.forme.historical` « Historique » | Contour hérité · défaut | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.round` « Rond » | width=86, height=110, upper=124, lower=135, tilt=0, taper=3, upperPeak=0, lowerPeak=0 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.oval` « Ovale » | width=117, height=74, upper=100, lower=119, tilt=0, taper=20, upperPeak=0, lowerPeak=0 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.almond` « Amande » | width=108, height=91, upper=115, lower=110, tilt=0, taper=100, upperPeak=0, lowerPeak=-3 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.narrow` « Étroit » | width=111, height=40, upper=90, lower=74, tilt=0, taper=62, upperPeak=0, lowerPeak=0 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.upturned` « Relevé » | width=105, height=81, upper=108, lower=104, tilt=12, taper=80, upperPeak=9, lowerPeak=3 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.downturned` « Tombant » | width=104, height=79, upper=116, lower=103, tilt=-12, taper=76, upperPeak=-8, lowerPeak=-4 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.heavy` « Paupière lourde » | width=105, height=83, upper=50, lower=140, tilt=0, taper=55, upperPeak=-4, lowerPeak=2 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.crescent` « Demi-lune » | width=109, height=88, upper=150, lower=30, tilt=0, taper=81, upperPeak=0, lowerPeak=-3 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.minimum` « Extrême minimum » | width=75, height=40, upper=50, lower=30, tilt=-12, taper=0, upperPeak=-20, lowerPeak=-20 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.maximum` « Extrême maximum » | width=120, height=130, upper=150, lower=140, tilt=12, taper=100, upperPeak=20, lowerPeak=20 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.forme.custom` « Personnalisé » | État de saisie libre | Conserver cet état si la saisie libre reste accessible |

**C.sourcil — Silhouettes de sourcils**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `C.sourcil.custom` « Personnalisés » | État de saisie libre | Conserver cet état si la saisie libre reste accessible |
| `C.sourcil.straight` « Droits » | arc=0, thickness=93, taper=43 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.round` « Arrondis » | arc=64, summit=51, angularity=0, taper=38 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.angular` « Anguleux » | arc=66, summit=62, angularity=100, taper=60 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.rising` « Ascendants » | arc=10, tilt=17, height=40, taper=57 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.falling` « Descendants » | arc=12, tilt=-16, height=72, taper=59 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.inflected` « En S » | arc=88, summit=80, angularity=10, height=58, taper=67 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.thick` « Épais » | arc=30, thickness=213, height=64, taper=17 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.fine` « Effilés » | length=115, thickness=85, arc=52, taper=100, angularity=24 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.sourcil.short` « Courts » | length=60, thickness=108, arc=23, taper=51 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

**C.pupille — Motifs de pupille**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `C.pupille.circle` « Circulaire » | Motif circulaire découpé dans l’iris | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.pupille.vertical` « Fente verticale » | Motif fente verticale découpé dans l’iris | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.pupille.horizontal` « Fente horizontale » | Motif fente horizontale découpé dans l’iris | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.pupille.diamond` « Losange » | Motif losange découpé dans l’iris | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.pupille.star` « Étoile à cinq branches » | Motif étoile à cinq branches découpé dans l’iris | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.pupille.ring` « Anneau » | Motif anneau découpé dans l’iris | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

**C.heterochromie — Répartition des deux pigments**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `C.heterochromie.none` « Aucune » | Uniquement le pigment principal · défaut | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.heterochromie.complete` « Complète » | Nuances distinctes entre les deux yeux | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `C.heterochromie.central` « Centrale » | Pigment secondaire au centre · diamètre secondaire réglable | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

**C.auto.contour** · Sans personnalisation, le profil R02 dessine le contour naturel à partir du contour et du pigment de scène. Le profil historique de l’atelier restitue les demandes avec son contour. Le code garde les deux projections. Proposition de conserver le profil et d’archiver la comparaison. [Compositeur](../../../bio-yeux-01/render.mjs) · [Profil](../../../bio-yeux-01/render-profile.mjs)

## D — Nez et bouche

### D1 — Nez

Le solveur calcule la géométrie dans les marges du visage, sous les yeux et leurs détails, au-dessus de la bouche. Le nez hérité peut rester lorsque la personnalisation est éteinte.

**Canon** `biology.face.nose`. **Archive et provenance** `nose v6+ · requested/effective ou latent · géométrie dérivée et provenance`. [nose](../../../bio-yeux-01/nose.mjs) · [nose-editor](../../../bio-yeux-01/nose-editor.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Générer un profil de neuf demandes ou trois sous-réglages graphiques en conservant la cohérence avec les réserves.

*Arbitrages proposés.* Conserver les géométries. Regrouper les degrés de détail avec aplats et lignes. Recalibrer en testant aussi la bouche, la moustache et les autres calques. Supprimer une clé casse le bloc normalisé.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `D1.nose-active` « Personnaliser le nez » | Nez | Décoché | Active le nez avec la référence normalisée ou la dernière demande latente. Décocher conserve la demande. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `D1.nose-preset` « Morphologie ou degré de détail » | Nez | Personnalisé · Personnalisé (`custom`), Fin (`thin`), Large (`wide`), Long (`long`), Court (`short`), Arrondi (`rounded`), Pointu (`pointed`), Épaté (`flat`), Arête large (`broadBridge`), Narines marquées (`distinctNostrils`), Minimaliste (`minimal`), Discret (`discreet`), Marqué (`defined`) | Applique l’une des neuf morphologies ou l’un des trois degrés de détail. Les degrés modifient seulement aplats et lignes. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `D1.nose-length` « Longueur » | Nez | 100 · 55 à 150 (référence pour personnaliser) | Distance verticale du nez. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-bridge` « Largeur de l’arête » | Nez | 100 · 40 à 180 (référence pour personnaliser) | Largeur de l’arête entre les ouvertures. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-wings` « Largeur des ailes » | Nez | 100 · 60 à 160 (référence pour personnaliser) | Largeur des ailes sur la joue. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-tip` « Volume de la pointe » | Nez | 100 · 30 à 180 (référence pour personnaliser) | Envergure du volume à la pointe. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-roundness` « Arrondi de la pointe » | Nez | 50 · 0 à 100 (référence pour personnaliser) | Arrondi relatif des formes de la pointe. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-nostrils` « Taille des narines » | Nez | 100 · 0 à 180 (référence pour personnaliser) | Dimension des ouvertures narinaires et de leurs réserves. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-tilt` « Inclinaison des narines » | Nez | 0 · -100 à 100 (référence pour personnaliser) | Inclinaison de la pointe et des traits du bas du nez. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-fills` « Intensité des aplats » | Nez | 45 · 0 à 100 (référence pour personnaliser) | Intensité des aplats du volume. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-lines` « Intensité des traits » | Nez | 40 · 0 à 100 (référence pour personnaliser) | Intensité des lignes de définition du nez. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D1.nose-random` « Tirer le nez » | Nez | — | Propose le nez par une graine, dans les domaines de la configuration courante. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `D1.nose-reset` « Rétablir le nez historique » | Nez | — | Revient à la projection historique pour le nez. Efface la demande latente de ce module. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `D1.nose-seed` « Graine du nez » | Nez | Microcosme · texte | Saisit la graine consommée par le tirage de ce module. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

### D2 — Bouche et lèvres

Le solveur adapte le profil placé sous le nez. Lorsque le nez est personnalisé, les deux calques échangent des contraintes de réserve. Le pigment des lèvres est dérivé de la peau. Personnalisation éteinte au démarrage.

**Canon** `biology.face.mouth`. **Archive et provenance** `mouth v5+ · requested/effective ou latent · provenance de tirage`. [mouth](../../../bio-yeux-01/mouth.mjs) · [mouth-editor](../../../bio-yeux-01/mouth-editor.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Générer un profil complet, avec les contraintes du nez au même visage.

*Arbitrages proposés.* Conserver la silhouette. Regrouper ou masquer les réglages fins en gardant leurs valeurs. Recalibrer en testant les réserves de barbe, marques et maquillage. Supprimer une clé casse les archives normalisées.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `D2.mouth-active` « Personnaliser la bouche » | Bouche et lèvres | Décoché | Active la bouche avec la référence normalisée ou la dernière demande latente. Décocher conserve la demande. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `D2.mouth-preset` « Silhouette de référence » | Bouche et lèvres | Personnalisée · Personnalisée (`custom`), Fine (`fine`), Charnue (`full`), Large (`wide`), Petite (`small`), Supérieure dominante (`upper`), Inférieure dominante (`lower`), Arc de Cupidon marqué (`cupid`), Commissures relevées (`raised`), Commissures abaissées (`lowered`) | Applique un vecteur de forme et de lecture des lèvres. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `D2.mouth-width` « Largeur » | Bouche et lèvres | 100 · 60 à 130 (référence pour personnaliser) | Largeur d’ensemble de la bouche, soumise au contour du visage et au nez. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-upper` « Volume supérieur » | Bouche et lèvres | 100 · 0 à 200 (référence pour personnaliser) | Volume de la lèvre supérieure. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-lower` « Volume inférieur » | Bouche et lèvres | 100 · 0 à 200 (référence pour personnaliser) | Volume de la lèvre inférieure. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-cupid` « Arc de Cupidon » | Bouche et lèvres | 45 · 0 à 100 (référence pour personnaliser) | Profondeur ou visibilité de l’arc de Cupidon. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-peaks` « Écartement des sommets » | Bouche et lèvres | 35 · 15 à 55 (référence pour personnaliser) | Position relative des sommets de la lèvre supérieure. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-corners` « Hauteur des commissures » | Bouche et lèvres | 0 · -100 à 100 (référence pour personnaliser) | Hauteur relative des commissures. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-curvature` « Courbure de séparation » | Bouche et lèvres | 0 · -100 à 100 (référence pour personnaliser) | Courbure d’ensemble de la fente buccale. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-intensity` « Intensité chromatique » | Bouche et lèvres | 55 · 0 à 100 (référence pour personnaliser) | Intensité de la couleur des lèvres dérivée de la peau. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-thickness` « Épaisseur de séparation » | Bouche et lèvres | 100 · 50 à 200 (référence pour personnaliser) | Épaisseur du trait de séparation. | Conserver ou masquer en avancé · recalibrer déplace les réserves liées · supprimer perd la demande |
| `D2.mouth-random` « Tirer la bouche » | Bouche et lèvres | — | Propose la bouche par une graine, dans les domaines de la configuration courante. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `D2.mouth-reset` « Rétablir la bouche historique » | Bouche et lèvres | — | Revient à la projection historique pour la bouche. Efface la demande latente de ce module. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `D2.mouth-seed` « Graine de la bouche » | Bouche et lèvres | Microcosme · texte | Saisit la graine consommée par le tirage de ce module. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

**D.nez — Morphologies du nez et degrés de détail**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `D.nez.custom` « Personnalisé » | État de saisie libre | Conserver cet état si la saisie libre reste accessible |
| `D.nez.thin` « Fin » | bridge=51, wings=66, tip=68, roundness=37, nostrils=65 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.wide` « Large » | bridge=113, wings=153, tip=125, roundness=49, nostrils=112 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.long` « Long » | length=145, bridge=81, wings=90, tip=92, roundness=33 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.short` « Court » | length=60, bridge=111, wings=98, tip=86, nostrils=78 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.rounded` « Arrondi » | tip=152, roundness=100, wings=117, nostrils=88 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.pointed` « Pointu » | tip=107, roundness=0, wings=80, bridge=83, nostrils=60 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.flat` « Épaté » | length=71, bridge=124, wings=158, tip=126, roundness=83, nostrils=115 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.broadBridge` « Arête large » | bridge=177, wings=102, tip=93, roundness=50 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.distinctNostrils` « Narines marquées » | nostrils=163, tilt=56, wings=125, lines=79, fills=43 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.minimal` « Minimaliste » | fills=28, lines=0 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.discreet` « Discret » | fills=45, lines=40 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.nez.defined` « Marqué » | fills=77, lines=83 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

**D.bouche — Silhouettes de bouche**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `D.bouche.custom` « Personnalisée » | État de saisie libre | Conserver cet état si la saisie libre reste accessible |
| `D.bouche.fine` « Fine » | upper=25, lower=34, thickness=79, intensity=54, cupid=34 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.full` « Charnue » | width=100, upper=173, lower=174, thickness=77, intensity=68, cupid=37 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.wide` « Large » | width=130, upper=84, lower=85, cupid=36, thickness=91 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.small` « Petite » | width=65, upper=56, lower=65, thickness=82, cupid=44 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.upper` « Supérieure dominante » | upper=169, lower=42, cupid=48, intensity=66 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.lower` « Inférieure dominante » | upper=41, lower=170, cupid=42, intensity=63 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.cupid` « Arc de Cupidon marqué » | upper=156, lower=74, cupid=100, peaks=28, intensity=66 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.raised` « Commissures relevées » | corners=88, upper=76, lower=90, curvature=6, intensity=54 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `D.bouche.lowered` « Commissures abaissées » | corners=-89, upper=77, lower=85, curvature=8, intensity=56 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

## E — Cheveux et pilosité

### E1 — Personnage et palette · catalogue

Le catalogue projette un style par arrangement. Les disponibilités sont mesurées par comparaison des SVG à trois échelles. Arrangement, accessoires, contrastes et implantation peuvent rester mémorisés sans effet.

**Canon** `voluntary.hairstyle`. **Archive et provenance** `character.style/arrangement/options et historicalSelection · dès v1`. [catalogue](../../../bio-yeux-01/catalogue.mjs) · [appearance](../../../bio-yeux-01/appearance.mjs) · [availability](../../../bio-yeux-01/availability.mjs)

*Potentiel générateur.* Réutiliser le catalogue et conserver les clés projetées. Les classes naturelles de cheveux ne sont pas encodées par ces styles.

*Arbitrages proposés.* Conserver les clés et normaliser séparément la liste exposée. Masquer une entrée ordinaire garde le chargement. Supprimer une clé ou un alias casse les sélections anciennes. Recalibrer une géométrie rouvrirait un acquis artistique.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `E1.ordinary` « Catalogue ordinaire » | Personnage et palette | 38-G · Cheveux en bataille · 119 entrées · voir E.cat | Sélectionne une entrée parmi les représentants visibles de la bibliothèque. | Regrouper l’accès · conserver la résolution de chaque clé |
| `E1.choose-ordinary` « Choisir l’entrée ordinaire » | Personnage et palette | — | Applique l’entrée ordinaire, y compris son arrangement disponible. | Regrouper l’accès · conserver la résolution de chaque clé |
| `E1.historical` « Identifiants historiques » | Personnage et palette | 38-G · Cheveux en bataille · 126 entrées · voir E.cat | Sélectionne un identifiant explicite du catalogue complet, y compris les alias historiques. | Regrouper l’accès · conserver la résolution de chaque clé |
| `E1.load-history` « Ouvrir l’identifiant » | Personnage et palette | — | Applique l’entrée historique choisie. Conserve le lien avec son représentant ordinaire. | Regrouper l’accès · conserver la résolution de chaque clé |
| `E1.arrangement` « Arrangement » | Personnage et palette | G · G (`G`), D (`D`) | Choisit G ou D lorsque le résultat des trois rendus varie. Pour une entrée U, la préférence peut être sans effet. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `E1.accessories` « Accessoires historiques » | Personnage et palette | Coché | Active ou désactive les accessoires prévus par la coupe. Sans différence visuelle pour certaines entrées. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `E1.contrast` « Contrastes historiques » | Personnage et palette | Coché | Active ou désactive les strates de contraste du dessin historique lorsque le style le permet. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |

### E2 — Pilosité faciale

Suit le contour du bas du visage et préserve pourtour du nez, yeux et lèvres. Les axes de moustache/favoris dépendent de la zone active. La couleur indépendante reste latente en mode lié. Catégorie F suspend la projection d’atelier.

**Canon** `physical.beard · voluntary.shaved · catégorie atelier seule`. **Archive et provenance** `facialHair v7+ · category H/F/T · requested/effective ou latent · pigment et tirage`. [beard](../../../bio-yeux-01/beard.mjs) · [beard-editor](../../../bio-yeux-01/beard-editor.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Prendre la barbe déclarée comme potentiel de projection. Le rasage canonique est réversible. Arbitrer toute règle d’attribution.

*Arbitrages proposés.* Conserver les champs de projection et le rasage. Masquer la catégorie atelier en vue simplifiée si H/F/T restent relisibles. Recalibrer avec le nez et la bouche. Retirer un mode peut réactiver ou perdre une barbe archivée.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `E2.beard-category` « Catégorie » | Pilosité faciale | H · H (`H`), F (`F`), T (`T`) | H et T permettent le calque réglable. F suspend l’édition et la projection tout en conservant les demandes. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |
| `E2.beard-active` « Personnaliser la pilosité » | Pilosité faciale | Décoché | Active la pilosité avec la référence normalisée ou la dernière demande latente. Décocher conserve la demande. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-preset` « Silhouette de référence » | Pilosité faciale | Courte · Personnalisé (`custom`), Imberbe (`clean`), Naissante (`stubble`), Courte (`short`), Complète (`full`), Longue (`long`), Pointue (`pointed`), Bouc (`goatee`), Mouche (`patch`), Collier (`strap`), Moustache (`moustache`), Moustache et bouc (`circle`), Favoris (`sideburns`) | Applique une silhouette et ses zones en gardant le mode et la nuance chromatiques. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-zone-sideburns` « Favoris » | Zones de pilosité | Coché | Projette le calque sur la zone favoris. Gouverne les deux axes des favoris. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-zone-cheeks` « Joues » | Zones de pilosité | Coché | Projette le calque sur la zone joues. Combinable avec les autres zones. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-zone-moustache` « Moustache » | Zones de pilosité | Décoché | Projette le calque sur la zone moustache. Gouverne trois axes, sous réserve d’espace nez–bouche. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-zone-soulPatch` « Mouche » | Zones de pilosité | Décoché | Projette le calque sur la zone mouche. Combinable avec les autres zones. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-zone-chin` « Menton » | Zones de pilosité | Coché | Projette le calque sur la zone menton. Gouverne la forme du menton. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-zone-jaw` « Mâchoire » | Zones de pilosité | Coché | Projette le calque sur la zone mâchoire. Combinable avec les autres zones. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-length` « Longueur de barbe » | Pilosité faciale | 11 · 0 à 100 (référence pour personnaliser) | Allongement du contour de barbe, notamment au menton. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-volume` « Volume de barbe » | Pilosité faciale | 44 · 0 à 100 (référence pour personnaliser) | Emprise et volume relatif de la silhouette pileuse. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-density` « Densité » | Pilosité faciale | 100 · 0 à 100 (référence pour personnaliser) | Densité graphique, dont le seuil d’absence. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-chinShape` « Forme du menton » | Pilosité faciale | 12 · 0 à 100 (référence pour personnaliser) | Profil du bas de barbe dans la zone du menton. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-moustacheWidth` « Largeur de la moustache » | Pilosité faciale | 60 · 0 à 100 (référence pour personnaliser) | Largeur de la moustache, limitée par le nez, la bouche et la place disponible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-moustacheThickness` « Épaisseur de la moustache » | Pilosité faciale | 50 · 0 à 100 (référence pour personnaliser) | Épaisseur de la moustache dans la réserve disponible. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-moustacheCurl` « Courbure de la moustache » | Pilosité faciale | 0 · -100 à 100 (référence pour personnaliser) | Courbure des extrémités de la moustache. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-sideburnLength` « Longueur des favoris » | Pilosité faciale | 60 · 0 à 100 (référence pour personnaliser) | Extension verticale des favoris. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-sideburnWidth` « Largeur des favoris » | Pilosité faciale | 50 · 0 à 100 (référence pour personnaliser) | Épaisseur transversale des favoris. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `E2.beard-colour-mode` « Coloration » | Pilosité faciale | Identique aux cheveux · Identique aux cheveux (`hair`), Cheveux légèrement assombris (`darker`), Indépendante (`independent`) | Règle le lien au pigment des cheveux ou sélectionne une nuance indépendante. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `E2.beard-colour` « Couleur indépendante » | Pilosité faciale | Brun sombre · 26 nuances · voir G.cap | Choisit la nuance indépendante, latente si le mode chromatique est lié ou si le calque est invisible. | Masquer seulement quand latent · supprimer ferait perdre le choix conservé |
| `E2.beard-random` « Tirer la pilosité » | Pilosité faciale | — | Propose la pilosité par une graine, dans les domaines de la configuration courante. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `E2.beard-reset` « Rétablir la pilosité historique » | Pilosité faciale | — | Revient à la projection historique pour la pilosité. Efface la demande latente de ce module. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `E2.beard-seed` « Graine de la pilosité » | Pilosité faciale | Microcosme · texte | Saisit la graine consommée par le tirage de ce module. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |

**E.barbe — Silhouettes de pilosité**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `E.barbe.custom` « Personnalisé » | État de saisie libre | Conserver cet état si la saisie libre reste accessible |
| `E.barbe.clean` « Imberbe » | zones=vide | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.stubble` « Naissante » | length=0, volume=29, density=26, chinShape=10, zones=cheeks=oui, chin=oui, jaw=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.short` « Courte » | length=11, volume=44, chinShape=12, zones=sideburns=oui, cheeks=oui, chin=oui, jaw=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.full` « Complète » | length=35, volume=67, moustacheWidth=88, zones=sideburns=oui, cheeks=oui, moustache=oui, soulPatch=oui, chin=oui, jaw=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.long` « Longue » | length=93, volume=79, moustacheWidth=85, chinShape=15, zones=sideburns=oui, cheeks=oui, moustache=oui, soulPatch=oui, chin=oui, jaw=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.pointed` « Pointue » | length=76, volume=37, chinShape=98, zones=sideburns=oui, cheeks=oui, chin=oui, jaw=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.goatee` « Bouc » | length=35, volume=35, chinShape=48, zones=soulPatch=oui, chin=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.patch` « Mouche » | zones=soulPatch=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.strap` « Collier » | length=3, volume=6, sideburnWidth=16, sideburnLength=87, zones=sideburns=oui, cheeks=oui, jaw=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.moustache` « Moustache » | moustacheWidth=70, moustacheThickness=58, moustacheCurl=35, zones=moustache=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.circle` « Moustache et bouc » | length=29, volume=43, moustacheWidth=56, zones=moustache=oui, soulPatch=oui, chin=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `E.barbe.sideburns` « Favoris » | sideburnLength=78, sideburnWidth=62, zones=sideburns=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

### E.cat — Bibliothèque capillaire · entrées individuelles

Emplacement « Catalogue ordinaire » et « Identifiants historiques » sous « Personnage et palette ». Les entrées G, D et U sélectionnent une variante du style. U désigne une entrée à arrangement unique. La note de dessin décrit la coupe de référence. La variante précise est conservée par sa clé. Les corrections locales des lots 1 et 3 complètent la note de coupe. Voir H.origine pour leurs planches d’avant/après. Les incidences de masquage, de recalibrage ou de suppression suivent E1 pour chaque ligne. Cas initial **38-G**. Les 126 libellés, clés et disponibilités des deux listes ont été comparés aux exports du catalogue.

| ID · libellé réel | Origine · effet du dessin | Présence et proposition |
| --- | --- | --- |
| `E.cat.shaved:U` « 01 · Rasée » | P4 / V1 · Crâne dégagé, sans calotte. | Ordinaire et historique · conserver la clé |
| `E.cat.short:U` « 02 · Courte ébouriffée » | P4 / V1 · Petites pointes irrégulières, volume près du crâne. | Ordinaire et historique · conserver la clé |
| `E.cat.classic:U` « 03 · Classique courte » | P4 / V1 · Mèche latérale validée dans P3-R1. | Ordinaire et historique · conserver la clé |
| `E.cat.bob:U` « 04 · Carré court » | P4 / V1 · Raie centrale et panneaux arrondis validés dans R1. | Ordinaire et historique · conserver la clé |
| `E.cat.fringe_bob:U` « 05 · Carré à frange » | P4 / V1 · Frange pleine, coupe droite au menton. | Ordinaire et historique · conserver la clé |
| `E.cat.mid_waves:U` « 06 · Mi-longs ondulés » | P4 / V1 · Ondulations souples jusqu’aux épaules. | Ordinaire et historique · conserver la clé |
| `E.cat.long_straight:U` « 07 · Longs lisses » | P4 / V1 · Raie centrale, longueurs brunes derrière les épaules. | Ordinaire et historique · conserver la clé |
| `E.cat.curls:U` « 08 · Boucles courtes » | P4 / V1 · Boucles courtes validées dans P3-R1. | Ordinaire et historique · conserver la clé |
| `E.cat.long_curls:U` « 09 · Boucles longues » | P4 / V1 · Masse de boucles épaisses jusqu’à la poitrine. | Ordinaire et historique · conserver la clé |
| `E.cat.braids:U` « 10 · Tresses » | P4 / V1 · Deux tresses blondes devant les épaules. | Ordinaire et historique · conserver la clé |
| `E.cat.bun:U` « 11 · Attaché · chignon » | P4 / V1 · Chignon haut et petites mèches près des oreilles. | Ordinaire et historique · conserver la clé |
| `E.cat.pony:U` « 12 · Queue de cheval » | P4 / V1 · Attache haute décentrée, queue courbe derrière l’épaule. | Ordinaire et historique · conserver la clé |
| `E.cat.waist_straight:U` « 13 · Très longs lisses » | P4 / V1 · Rideaux lisses devant le buste, pointes à la taille. | Ordinaire et historique · conserver la clé |
| `E.cat.waist_waves:U` « 14 · Très longs ondulés » | P4 / V1 · Vagues amples et épaisses jusqu’à la taille. | Ordinaire et historique · conserver la clé |
| `E.cat.waist_curls:U` « 15 · Très longues boucles » | P4 / V1 · Cascade de boucles larges, jusqu’à la taille. | Ordinaire et historique · conserver la clé |
| `E.cat.afro:U` « 16 · Afro ample » | P4 / V1 · Couronne ronde très volumineuse, contour en gros lobes. | Ordinaire et historique · conserver la clé |
| `E.cat.side_braid:U` « 17 · Natte sur l’épaule » | P4 / V1 · Raie décentrée, une natte épaisse devant l’épaule droite. | Ordinaire et historique · conserver la clé |
| `E.cat.asym_long:U` « 18 · Asymétrique · carré et cascade » | P4 / V1 · Carré à gauche, longue cascade ondulée à droite. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-019:G` « 19-G · Raie classique » | P5-A · L1C1 · Vague courte et carré arrondi à raie latérale. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-019:D` « 19-D · Raie classique » | P5-A · L1C1 · Vague courte et carré arrondi à raie latérale. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-020:G` « 20-G · Dégradé court » | P5-A · L1C2 · Dessus court pointu, puis frange balayée. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-020:D` « 20-D · Dégradé court » | P5-A · L1C2 · Dessus court pointu, puis frange balayée. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-021:G` « 21-G · Carré moderne » | P5-A · L1C3 · Vague courte mutualisée avec 19-G ; carré à ligne basse nette. | Historique seul · archiver l’accès · conserver la redirection vers 19-G |
| `E.cat.p5-021:D` « 21-D · Carré moderne » | P5-A · L1C3 · Vague courte mutualisée avec 19-G ; carré à ligne basse nette. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-022:G` « 22-G · Ondulations souples » | P5-A · L2C1 · Vagues courtes retournées, puis grandes ondulations libres. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-022:D` « 22-D · Ondulations souples » | P5-A · L2C1 · Vagues courtes retournées, puis grandes ondulations libres. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-023:G` « 23-G · Effet coiffé-décoiffé » | P5-A · L2C2 · Pointes libres, puis chignon irrégulier et mèches pendantes. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-023:D` « 23-D · Effet coiffé-décoiffé » | P5-A · L2C2 · Pointes libres, puis chignon irrégulier et mèches pendantes. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-024:G` « 24-G · Queue-de-cheval » | P5-A · L2C3 · Queue basse derrière la nuque, puis queue haute décentrée. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-024:D` « 24-D · Queue-de-cheval » | P5-A · L2C3 · Queue basse derrière la nuque, puis queue haute décentrée. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-025:G` « 25-G · Undercut » | P5-A · L3C1 · Quiff sur côtés rasés, puis longue mèche et une tempe dégagée. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-025:D` « 25-D · Undercut » | P5-A · L3C1 · Quiff sur côtés rasés, puis longue mèche et une tempe dégagée. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-026:G` « 26-G · Frange et mèches » | P5-A · L3C2 · Frange morcelée, puis frange droite sur de longues mèches. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-026:D` « 26-D · Frange et mèches » | P5-A · L3C2 · Frange morcelée, puis frange droite sur de longues mèches. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-027:G` « 27-G · Boucles volumineuses » | P5-A · L3C3 · Couronne de grandes boucles, puis cascade épaisse. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-027:D` « 27-D · Boucles volumineuses » | P5-A · L3C3 · Couronne de grandes boucles, puis cascade épaisse. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-028:G` « 28-G · Couronne tressée » | P5-B · L1C1 · Anneau de cheveux entrelacés ; raie centrale et deux mèches libres en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-028:D` « 28-D · Couronne tressée » | P5-B · L1C1 · Anneau de cheveux entrelacés ; raie centrale et deux mèches libres en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-029:G` « 29-G · Chignon architectural » | P5-B · L1C2 · Éventail relevé en G ; chignon à grands rouleaux, attache haute et deux retombées en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-029:D` « 29-D · Chignon architectural » | P5-B · L1C2 · Éventail relevé en G ; chignon à grands rouleaux, attache haute et deux retombées en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-030:G` « 30-G · Boucles aristocratiques » | P5-B · L1C3 · Rouleaux ouverts et boucles à la nuque ; demi-attache sur une longue cascade en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-030:D` « 30-D · Boucles aristocratiques » | P5-B · L1C3 · Rouleaux ouverts et boucles à la nuque ; demi-attache sur une longue cascade en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-031:G` « 31-G · Coiffure de cour » | P5-B · L2C1 · Sommet bombé et rouleaux symétriques ; chignon haut et mèches pendantes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-031:D` « 31-D · Coiffure de cour » | P5-B · L2C1 · Sommet bombé et rouleaux symétriques ; chignon haut et mèches pendantes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-032:G` « 32-G · Tresse royale » | P5-B · L2C2 · Racines balayées et grosse natte avant ; couronne et deux longues tresses en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-032:D` « 32-D · Tresse royale » | P5-B · L2C2 · Racines balayées et grosse natte avant ; couronne et deux longues tresses en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-033:G` « 33-G · Chignon ornementé » | P5-B · L2C3 · Mèches courtes balayées et ruban de nuque ; chignon latéral et fleur en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-033:D` « 33-D · Chignon ornementé » | P5-B · L2C3 · Mèches courtes balayées et ruban de nuque ; chignon latéral et fleur en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-034:G` « 34-G · Haut volume sophistiqué » | P5-B · L3C1 · Quiff haut en grandes vagues ; balayage ample sur une cascade latérale en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-034:D` « 34-D · Haut volume sophistiqué » | P5-B · L3C1 · Quiff haut en grandes vagues ; balayage ample sur une cascade latérale en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-035:G` « 35-G · Natte et bijoux » | P5-B · L3C2 · Natte avant plus fine et racines lissées ; couronne basse et deux brins fins en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-035:D` « 35-D · Natte et bijoux » | P5-B · L3C2 · Natte avant plus fine et racines lissées ; couronne basse et deux brins fins en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-036:G` « 36-G · Coiffure cérémonielle » | P5-B · L3C3 · Raie centrale et longs côtés ; structure haute de rouleaux symétriques en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-036:D` « 36-D · Coiffure cérémonielle » | P5-B · L3C3 · Raie centrale et longs côtés ; structure haute de rouleaux symétriques en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-037:G` « 37-G · Coupe de travail » | P5-C · L1C1 · Pointes courtes courbées ; grand balayage et queue basse latérale en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-037:D` « 37-D · Coupe de travail » | P5-C · L1C1 · Pointes courtes courbées ; grand balayage et queue basse latérale en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-038:G` « 38-G · Cheveux en bataille » | P5-C · L1C2 · Pointes multidirectionnelles ; frange déchiquetée et nuque libre en D. | Ordinaire et historique · conserver la clé · valeur d’ouverture |
| `E.cat.p5-038:D` « 38-D · Cheveux en bataille » | P5-C · L1C2 · Pointes multidirectionnelles ; frange déchiquetée et nuque libre en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-039:G` « 39-G · Coupe rustique » | P5-C · L1C3 · Frange courte morcelée ; raie centrale et deux nattes simples en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-039:D` « 39-D · Coupe rustique » | P5-C · L1C3 · Frange courte morcelée ; raie centrale et deux nattes simples en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-040:G` « 40-G · Longue chevelure sauvage » | P5-C · L2C1 · Mèches de nuque étagées ; longues vagues libres et brins fins en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-040:D` « 40-D · Longue chevelure sauvage » | P5-C · L2C1 · Mèches de nuque étagées ; longues vagues libres et brins fins en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-041:G` « 41-G · Natte de travail » | P5-C · L2C2 · Rouleau tiré sur tempes courtes et natte ; raie simple, une natte et mèche libre en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-041:D` « 41-D · Natte de travail » | P5-C · L2C2 · Rouleau tiré sur tempes courtes et natte ; raie simple, une natte et mèche libre en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-042:G` « 42-G · Demi-attaché naturel » | P5-C · L2C3 · Petit chignon sur nuque libre ; demi-attache et longue masse ondulée en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-042:D` « 42-D · Demi-attaché naturel » | P5-C · L2C3 · Petit chignon sur nuque libre ; demi-attache et longue masse ondulée en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-043:G` « 43-G · Cheveux ébouriffés et longs » | P5-C · L3C1 · Grandes mèches étagées ; balayage ample et cascade asymétrique en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-043:D` « 43-D · Cheveux ébouriffés et longs » | P5-C · L3C1 · Grandes mèches étagées ; balayage ample et cascade asymétrique en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-044:G` « 44-G · Coupe asymétrique simple » | P5-C · L3C2 · Frange oblique en pointes ; panneau long et petite tempe tressée en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-044:D` « 44-D · Coupe asymétrique simple » | P5-C · L3C2 · Frange oblique en pointes ; panneau long et petite tempe tressée en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-045:G` « 45-G · Tresses sauvages » | P5-C · L3C3 · Gros brins courts orientés en éventail ; départs tressés et longues nattes irrégulières en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-045:D` « 45-D · Tresses sauvages » | P5-C · L3C3 · Gros brins courts orientés en éventail ; départs tressés et longues nattes irrégulières en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-046:G` « 46-G · Crête / Iroquois » | P5-D · L1C1 · Bande centrale en longues pointes ; éventail incliné en D. Côtés découverts. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-046:D` « 46-D · Crête / Iroquois » | P5-D · L1C1 · Bande centrale en longues pointes ; éventail incliné en D. Côtés découverts. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-047:G` « 47-G · Côtés rasés et longue mèche » | P5-D · L1C2 · Dessus pointu rabattu ; long panneau oblique en D. Tempe opposée courte. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-047:D` « 47-D · Côtés rasés et longue mèche » | P5-D · L1C2 · Dessus pointu rabattu ; long panneau oblique en D. Tempe opposée courte. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-048:G` « 48-G · Pointes ébouriffées » | P5-D · L1C3 · Pointes courtes multidirectionnelles ; mèches plus longues et rayonnantes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-048:D` « 48-D · Pointes ébouriffées » | P5-D · L1C3 · Pointes courtes multidirectionnelles ; mèches plus longues et rayonnantes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-049:G` « 49-G · Coupe asymétrique extrême » | P5-D · L2C1 · Longue pointe frontale et côté court ; panneau sous le menton en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-049:D` « 49-D · Coupe asymétrique extrême » | P5-D · L2C1 · Longue pointe frontale et côté court ; panneau sous le menton en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-050:G` « 50-G · Couleurs et mèches contrastées » | P5-D · L2C2 · Pointes et zones contrastées ; panneau long avec mèche de couleur en D. | Historique seul · archiver l’accès · conserver la redirection vers 47-G |
| `E.cat.p5-050:D` « 50-D · Couleurs et mèches contrastées » | P5-D · L2C2 · Pointes et zones contrastées ; panneau long avec mèche de couleur en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-051:G` « 51-G · Volume extravagant » | P5-D · L2C3 · Très haut éventail souple ; rouleaux fermés et retombées en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-051:D` « 51-D · Volume extravagant » | P5-D · L2C3 · Très haut éventail souple ; rouleaux fermés et retombées en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-052:G` « 52-G · Dreadlocks / Locks » | P5-D · L3C1 · Cylindres courts rayonnants ; longs brins souples et certains relevés en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-052:D` « 52-D · Dreadlocks / Locks » | P5-D · L3C1 · Cylindres courts rayonnants ; longs brins souples et certains relevés en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-053:G` « 53-G · Tresses créatives » | P5-D · L3C2 · Rangées séparées et deux brins ; implantation asymétrique et longues tresses en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-053:D` « 53-D · Tresses créatives » | P5-D · L3C2 · Rangées séparées et deux brins ; implantation asymétrique et longues tresses en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-054:G` « 54-G · Accessoires et ornements » | P5-D · L3C3 · Pointes courtes et lunettes amovibles ; grande touffe et plumes indépendantes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-054:D` « 54-D · Accessoires et ornements » | P5-D · L3C3 · Pointes courtes et lunettes amovibles ; grande touffe et plumes indépendantes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-055:G` « 55-G · Tresses africaines » | P5-E v1 · L1C1 · Rangées plaquées et six longs brins ; chignon de fines tresses et retombées courtes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-055:D` « 55-D · Tresses africaines » | P5-E v1 · L1C1 · Rangées plaquées et six longs brins ; chignon de fines tresses et retombées courtes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-056:G` « 56-G · Chignon japonais » | P5-E v1 · L1C2 · Petit chignon et front tiré ; grand chignon, raie centrale et deux mèches en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-056:D` « 56-D · Chignon japonais » | P5-E v1 · L1C2 · Petit chignon et front tiré ; grand chignon, raie centrale et deux mèches en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-057:G` « 57-G · Coiffure égyptienne » | P5-E v1 · L1C3 · Carré structuré à frange droite ; brins plus longs en D, ornements séparés. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-057:D` « 57-D · Coiffure égyptienne » | P5-E v1 · L1C3 · Carré structuré à frange droite ; brins plus longs en D, ornements séparés. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-058:G` « 58-G · Coiffure romaine » | P5-E v1 · L2C1 · Couronne de boucles courtes ; chignon, rouleaux et mèches près des joues en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-058:D` « 58-D · Coiffure romaine » | P5-E v1 · L2C1 · Couronne de boucles courtes ; chignon, rouleaux et mèches près des joues en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-059:G` « 59-G · Coiffure médiévale » | P5-E v1 · L2C2 · Couronne tressée ; grandes vagues libres à raie centrale sous un bandeau en D. | Historique seul · archiver l’accès · conserver la redirection vers 28-G |
| `E.cat.p5-059:D` « 59-D · Coiffure médiévale » | P5-E v1 · L2C2 · Couronne tressée ; grandes vagues libres à raie centrale sous un bandeau en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-060:G` « 60-G · Coiffure nordique » | P5-E v1 · L2C3 · Dessus relevé, tempe tressée et natte ; couronne et deux nattes avec mèches libres en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-060:D` « 60-D · Coiffure nordique » | P5-E v1 · L2C3 · Dessus relevé, tempe tressée et natte ; couronne et deux nattes avec mèches libres en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-061:G` « 61-G · Coiffure asiatique » | P5-E v1 · L3C1 · Chignon lisse avec deux mèches fines ; grand rouleau latéral et chignon décentré en D. | Historique seul · archiver l’accès · conserver la redirection vers 56-G |
| `E.cat.p5-061:D` « 61-D · Coiffure asiatique » | P5-E v1 · L3C1 · Chignon lisse avec deux mèches fines ; grand rouleau latéral et chignon décentré en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-062:G` « 62-G · Coiffure punk » | P5-E v1 · L3C2 · Crête centrale élargie ; balayage asymétrique à côté court et teinte amovible en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-062:D` « 62-D · Coiffure punk » | P5-E v1 · L3C2 · Crête centrale élargie ; balayage asymétrique à côté court et teinte amovible en D. | Historique seul · archiver l’accès · conserver la redirection vers 49-G |
| `E.cat.p5-063:G` « 63-G · Coiffure nomade » | P5-E v1 · L3C3 · G : foulard, cheveux non observables ; D : demi-attache torsadée haute et longueurs ondulées. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-063:D` « 63-D · Coiffure nomade » | P5-E v1 · L3C3 · G : foulard, cheveux non observables ; D : demi-attache torsadée haute et longueurs ondulées. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-064:G` « 64-G · Coiffure de guerrier » | P5-F · L1C1 · Chignon central à côtés courts ; couronne, chignon et deux longues nattes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-064:D` « 64-D · Coiffure de guerrier » | P5-F · L1C1 · Chignon central à côtés courts ; couronne, chignon et deux longues nattes en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-065:G` « 65-G · Coiffure d’aventurier » | P5-F · L1C2 · Courtes mèches projetées vers un côté ; pointes rayonnantes jusqu’à la nuque en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-065:D` « 65-D · Coiffure d’aventurier » | P5-F · L1C2 · Courtes mèches projetées vers un côté ; pointes rayonnantes jusqu’à la nuque en D. | Historique seul · archiver l’accès · conserver la redirection vers 48-D |
| `E.cat.p5-066:G` « 66-G · Coiffure de rôdeur » | P5-F · L1C3 · Frange irrégulière G, raie et deux nattes D ; parties cachées sous la capuche inconnues. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-066:D` « 66-D · Coiffure de rôdeur » | P5-F · L1C3 · Frange irrégulière G, raie et deux nattes D ; parties cachées sous la capuche inconnues. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-067:G` « 67-G · Coiffure de voyageur » | P5-F · L2C1 · Frange balayée et deux petites couettes basses ; deux nattes sous un foulard en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-067:D` « 67-D · Coiffure de voyageur » | P5-F · L2C1 · Frange balayée et deux petites couettes basses ; deux nattes sous un foulard en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-068:G` « 68-G · Coiffure de savant » | P5-F · L2C2 · Grande mèche courte balayée ; chignon haut et deux boucles latérales en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-068:D` « 68-D · Coiffure de savant » | P5-F · L2C2 · Grande mèche courte balayée ; chignon haut et deux boucles latérales en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-069:G` « 69-G · Coiffure d’alchimiste » | P5-F · L2C3 · Pointes courtes ; chignon irrégulier et nombreuses mèches libres en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-069:D` « 69-D · Coiffure d’alchimiste » | P5-F · L2C3 · Pointes courtes ; chignon irrégulier et nombreuses mèches libres en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-070:G` « 70-G · Coiffure spirituelle » | P5-F · L3C1 · Chignon central à côtés courts ; chignon haut, longueurs libres et parure séparée en D. | Historique seul · archiver l’accès · conserver la redirection vers 64-G |
| `E.cat.p5-070:D` « 70-D · Coiffure spirituelle » | P5-F · L3C1 · Chignon central à côtés courts ; chignon haut, longueurs libres et parure séparée en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-071:G` « 71-G · Coiffure mystique » | P5-F · L3C2 · Longue mèche latérale et tempe courte ; structure tressée haute et deux brins en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-071:D` « 71-D · Coiffure mystique » | P5-F · L3C2 · Longue mèche latérale et tempe courte ; structure tressée haute et deux brins en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-072:G` « 72-G · Coiffure héroïque » | P5-F · L3C3 · Grand balayage, côté tressé et natte ; couronne étagée sur longueurs ondulées en D. | Ordinaire et historique · conserver la clé |
| `E.cat.p5-072:D` « 72-D · Coiffure héroïque » | P5-F · L3C3 · Grand balayage, côté tressé et natte ; couronne étagée sur longueurs ondulées en D. | Ordinaire et historique · conserver la clé |

| ID de groupe | Entrée ordinaire · entrée historique supplémentaire | Règle et proposition |
| --- | --- | --- |
| `E.alias.E03` | 19-G · 21-G | Même balayage court. Réserve sur 21-G acceptée ; aucune retouche graphique. Conserver la relation et les deux clés. |
| `E.alias.E04` | 28-G · 59-G | Couronne tressée commune ; les arrangements D restent indépendants. Conserver la relation et les deux clés. |
| `E.alias.E07` | 47-G · 50-G | La couleur de 50-G reste une information historique, sans nouvelle entrée biologique. Conserver la relation et les deux clés. |
| `E.alias.E09` | 49-G · 62-D | Contraste de 62-D conservé. 71-G garde son entrée et son rendu. Conserver la relation et les deux clés. |
| `E.alias.E10` | 64-G · 70-G | Chignon central commun ; les deux arrangements D restent indépendants. Conserver la relation et les deux clés. |
| `E.alias.V01` | 56-G · 61-G | Compromis de catalogue : 61-G garde ses deux mèches supplémentaires dans son rendu historique. Conserver la relation et les deux clés. |
| `E.alias.BIO-INV-01-C` | 48-D · 65-D | 65-D reste ouvrable par son identifiant. 48-D est le représentant ordinaire. Conserver la relation et les deux clés. |

Références du catalogue. [BIO-COL](../../../bio-col-01/catalogue.mjs) · [Extension de l’atelier](../../../bio-yeux-01/catalogue.mjs) · [P5-I6](../../../preview/bio-vis-p5-i6/model.mjs)

## F — Peau, marques et cicatrices

### F1 — Marques cutanées

Coordonnées de peau recalculées avec contour, yeux, lèvres et narines. Jusqu’à 24 marques/groupes. Les réglages visibles dépendent du type et les coordonnées peuvent garder une demande même si le placement est empêché. Masquer la liste conserve les entrées. Le canon garantit l’unicité des identifiants entre ses deux listes.

**Canon** `biology.marks ou acquired.marks selon origine déclarée`. **Archive et provenance** `marks v8+ · requested/effective ou latent · identifiants m…`. [marks](../../../bio-yeux-01/marks.mjs) · [marks-editor](../../../bio-yeux-01/marks-editor.mjs) · [surface](../../../bio-yeux-01/surface.mjs)

*Potentiel générateur.* Rendre l’origine explicite avant toute génération. Les listes de zones et la graine peuvent servir d’entrées facultatives.

*Arbitrages proposés.* Conserver IDs, types et coordonnées. Regrouper les options par type. Recalibrer zones ou réserves déplace les marques persistantes. Supprimer la lecture d’une forme ou d’un type casserait une fiche ou une archive.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `F1.marks-type` « Type de marque » | Marques cutanées | Grain de beauté · Grain de beauté (`mole`), Tache de naissance (`birth`), Tache pigmentaire (`pigment`), Groupe de taches de rousseur (`freckles`), Groupe de taches pigmentaires (`pigmentGroup`) | Choisit le type de la prochaine marque. Individuelle ou groupée selon le type. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |
| `F1.marks-add` « Ajouter » | Marques cutanées | — | Crée une marque du type choisi, lui attribue un identifiant et l’affiche. Plafond 24. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-list` « Marque à modifier » | Marques cutanées | vide · liste dynamique | Sélectionne une marque existante pour édition, par identifiant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-show` « Afficher les marques » | Marques cutanées | Coché | Masque ou restitue la liste de marques sans effacer les réglages. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-shape` « Forme » | Marques cutanées | Circulaire · Circulaire (`circle`), Ovale (`oval`), Irrégulière (`irregular`), Diffuse (`diffuse`) | Change le contour individuel ou la forme des taches du groupe. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-tone` « Teinte » | Marques cutanées | aucune sélection (Brune est affiché avant ajout) · Brune (`brown`), Foncée (`dark`), Rosée (`rose`), Claire (`light`) · à l’ajout selon le type | Change le ton relatif du pigment du calque. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-seed` « Graine du groupe » | Marques cutanées | Microcosme m… à l’ajout · 128 caractères | Redistribue le groupe de façon déterministe dans les zones autorisées. Aucune graine pour une marque individuelle. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `F1.zone.forehead` « Front » | Zones du groupe | Décoché par défaut dans chaque groupe | Autorise les taches groupées dans la zone front, sous réserve de place sur le visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.zone.temples` « Tempes » | Zones du groupe | Coché à l’ajout pour Groupe de taches pigmentaires | Autorise les taches groupées dans la zone tempes, sous réserve de place sur le visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.zone.nose` « Nez » | Zones du groupe | Coché à l’ajout pour Groupe de taches de rousseur | Autorise les taches groupées dans la zone nez, sous réserve de place sur le visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.zone.cheeks` « Joues » | Zones du groupe | Coché à l’ajout pour Groupe de taches de rousseur, Groupe de taches pigmentaires | Autorise les taches groupées dans la zone joues, sous réserve de place sur le visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.zone.perioral` « Pourtour de la bouche » | Zones du groupe | Décoché par défaut dans chaque groupe | Autorise les taches groupées dans la zone pourtour de la bouche, sous réserve de place sur le visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.zone.jaw` « Menton et mâchoire » | Zones du groupe | Décoché par défaut dans chaque groupe | Autorise les taches groupées dans la zone menton et mâchoire, sous réserve de place sur le visage. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-x` « Position horizontale » | Marques cutanées | Liste vide · à l’ajout mole 30, birth 76, pigment 27 · 0 à 100 | Position horizontale de la marque individuelle dans le repère de peau. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-y` « Position verticale » | Marques cutanées | Liste vide · à l’ajout mole 70, birth 71, pigment 75 · 0 à 100 | Position verticale de la marque individuelle dans le repère de peau. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-size` « Taille » | Marques cutanées | Liste vide · à l’ajout mole 28, birth 44, pigment 39, freckles 45, pigmentGroup 35 · 0 à 100 | Rayon de la marque individuelle ou taille moyenne du groupe. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-elongation` « Allongement » | Marques cutanées | Liste vide · à l’ajout mole 42, birth 42, pigment 42 · 0 à 100 | Rapport des axes du contour d’une marque individuelle. Disponible si sa forme le permet. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-irregularity` « Irrégularité » | Marques cutanées | Liste vide · à l’ajout mole 57, birth 57, pigment 57 · 0 à 100 | Variation du bord d’une marque individuelle. Disponible avec le contour Irrégulière. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-intensity` « Intensité chromatique » | Marques cutanées | Liste vide · à l’ajout mole 68, birth 68, pigment 68, freckles 58, pigmentGroup 64 · 0 à 100 | Intensité chromatique dérivée du ton et de la peau. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-angle` « Orientation » | Marques cutanées | Liste vide · à l’ajout mole 23, birth 23, pigment 23 · 0 à 180 | Rotation de la marque individuelle. Bornes utiles selon symétrie et contour. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-density` « Densité » | Marques cutanées | Liste vide · à l’ajout freckles 64, pigmentGroup 42 · 0 à 100 | Nombre de taches candidates à l’intérieur des zones d’un groupe. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-extent` « Étendue » | Marques cutanées | Liste vide · à l’ajout freckles 72, pigmentGroup 72 · 0 à 100 | Emprise de la distribution dans les zones autorisées. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-sizeVariation` « Variation des tailles » | Marques cutanées | Liste vide · à l’ajout freckles 65, pigmentGroup 57 · 0 à 100 | Dispersion des tailles individuelles autour de la taille moyenne. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F1.marks-remove` « Supprimer la marque » | Marques cutanées | — | Retire la marque sélectionnée en gardant les autres. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F1.marks-reset` « Rétablir la peau historique » | Marques cutanées | — | Efface la liste et recommence la numérotation des marques. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `F1.marks-place` « Placer sur le visage » | Marques cutanées | Inactif au démarrage | Place une marque individuelle via le gros plan, avec conversion en coordonnées de surface. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |

### F2 — Cicatrices

Jusqu’à 16 cicatrices, géométrie linéaire ou surfacique, projetées dans les réserves. Maturité et sutures sont des paramètres graphiques. Le tracé et le tirage sont reproductibles par graine.

**Canon** `acquired.scars`. **Archive et provenance** `scars v9+ · requested/effective ou latent · identifiants s…`. [scars](../../../bio-yeux-01/scars.mjs) · [scars-editor](../../../bio-yeux-01/scars-editor.mjs) · [surface](../../../bio-yeux-01/surface.mjs)

*Potentiel générateur.* Projeter un état acquis déclaré. Une liaison à une histoire et à un temps d’évolution demande décision.

*Arbitrages proposés.* Conserver IDs et réglages de projection. Regrouper les formes proches dans l’édition si leur domaine reste lisible. Recalibrer change l’apparence de marques anciennes. Supprimer des réglages casserait leur restitution.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `F2.scars-preset` « Forme de référence » | Cicatrices | Linéaire · Linéaire (`linear`), Courbe (`curved`), Irrégulière (`irregular`), Multiple (`multiple`), Suturée (`sutured`), Surfacique (`surface`) | Choisit l’une des six références utilisées par Ajouter ou Appliquer la forme. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-add` « Ajouter » | Cicatrices | — | Ajoute une trace préconfigurée, lui attribue un identifiant et la sélectionne. Plafond 16. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-apply` « Appliquer la forme » | Cicatrices | — | Applique la référence à la cicatrice sélectionnée, en gardant son identifiant et sa maturité. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-list` « Cicatrice à modifier » | Cicatrices | vide · liste dynamique | Sélectionne une cicatrice existante pour édition, par identifiant. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-show` « Afficher les cicatrices » | Cicatrices | Coché | Masque ou réaffiche le calque. Conserve la liste lorsque masqué. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-mode` « Géométrie » | Cicatrices | Tracé · Tracé (`line`), Surface (`patch`) | Choisit la géométrie linéaire ou surfacique de la cicatrice. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-sutures` « Traces de suture cicatrisées » | Cicatrices | Décoché | Demande des traces de suture, bornées par les conditions géométriques de la cicatrice. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-x` « Position horizontale » | Cicatrices | Liste vide · Linéaire 27, référence 31 · 0 à 100 | Position horizontale de l’ancrage en coordonnées de surface. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-y` « Position verticale » | Cicatrices | Liste vide · Linéaire 68, référence 63 · 0 à 100 | Position verticale de l’ancrage en coordonnées de surface. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-length` « Longueur » | Cicatrices | Liste vide · Linéaire 48, référence 46 · 0 à 100 | Extension de la trace principale. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-width` « Largeur » | Cicatrices | Liste vide · Linéaire 24, référence 24 · 0 à 100 | Largeur de l’emprise linéaire ou surfacique. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-angle` « Orientation » | Cicatrices | Liste vide · Linéaire 65, référence 72 · 0 à 360 | Rotation de la trace dans la surface faciale. Période effective liée à sa symétrie. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-curve` « Courbure » | Cicatrices | Liste vide · Linéaire 0, référence 0 · -100 à 100 | Courbure de la trace linéaire. Latente en mode surfacique. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-irregularity` « Irrégularité » | Cicatrices | Liste vide · Linéaire 0, référence 14 · 0 à 100 | Déviation déterministe du tracé à partir de la graine. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-intensity` « Intensité chromatique » | Cicatrices | Liste vide · Linéaire 67, référence 67 · 0 à 100 | Visibilité du calque et intensité pigmentaire. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-traces` « Nombre de traces » | Cicatrices | Liste vide · Linéaire 1, référence 1 · 1 à 5 | Nombre admissible de traces linéaires dans la réserve. Latent en mode surfacique. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-spacing` « Espacement des traces » | Cicatrices | Liste vide · Linéaire 34, référence 34 · 0 à 100 | Écart relatif des traces multiples. Latent si les traces ne sont pas parallèles. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-maturity` « Maturation graphique » | Cicatrices | Liste vide · Linéaire 47, référence 47 · 0 à 100 | Interpolation graphique de teinte et texture. Aucun échéancier n’est calculé. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `F2.scars-seed` « Graine » | Cicatrices | Microcosme s… à l’ajout · 128 caractères | Fixe la graine du tracé irrégulier et du tirage, par défaut Microcosme suivi de l’identifiant. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `F2.scars-draw` « Tirer une cicatrice » | Cicatrices | — | Tire une cicatrice reproductible dans les réserves ou propose une première entrée. Signale l’échec si aucune ne convient. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `F2.scars-remove` « Supprimer » | Cicatrices | — | Retire la cicatrice sélectionnée et garde les autres. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `F2.scars-reset` « Rétablir la peau sans cicatrices » | Cicatrices | — | Efface la liste et recommence la numérotation des cicatrices. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `F2.scars-place` « Placer sur le visage » | Cicatrices | Inactif au démarrage | Active le placement sur le gros plan et réécrit les coordonnées de surface de la cicatrice. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |

### F.types — Réglages à l’ajout et états de cicatrice

| ID et libellé | Défaut normalisé lors de la création | Arbitrage proposé |
| --- | --- | --- |
| `F.type.mole` « Grain de beauté » | shape=circle, tone=dark, size=28, intensity=68, x=30, y=70, elongation=42, irregularity=57, angle=23 | Conserver le type et ses demandes · masquer derrière le choix de type · changer sa référence modifie les nouvelles marques |
| `F.type.birth` « Tache de naissance » | shape=irregular, tone=rose, size=44, intensity=68, x=76, y=71, elongation=42, irregularity=57, angle=23 | Conserver le type et ses demandes · masquer derrière le choix de type · changer sa référence modifie les nouvelles marques |
| `F.type.pigment` « Tache pigmentaire » | shape=diffuse, tone=light, size=39, intensity=68, x=27, y=75, elongation=42, irregularity=57, angle=23 | Conserver le type et ses demandes · masquer derrière le choix de type · changer sa référence modifie les nouvelles marques |
| `F.type.freckles` « Groupe de taches de rousseur » | shape=irregular, tone=brown, size=45, intensity=58, seed=Microcosme m1, zones=nose, cheeks, density=64, extent=72, sizeVariation=65 | Conserver le type et ses demandes · masquer derrière le choix de type · changer sa référence modifie les nouvelles marques |
| `F.type.pigmentGroup` « Groupe de taches pigmentaires » | shape=diffuse, tone=light, size=35, intensity=64, seed=Microcosme m1, zones=temples, cheeks, density=42, extent=72, sizeVariation=57 | Conserver le type et ses demandes · masquer derrière le choix de type · changer sa référence modifie les nouvelles marques |

**F.cicatrice — Six formes de cicatrice**

| ID et libellé en interface | Valeurs appliquées ou usage | Arbitrage proposé |
| --- | --- | --- |
| `F.cicatrice.linear` « Linéaire » | x=27, y=68, length=48, width=24, angle=65, irregularity=0 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `F.cicatrice.curved` « Courbe » | x=65, y=57, length=59, width=23, angle=74, curve=59, irregularity=11 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `F.cicatrice.irregular` « Irrégulière » | x=37, y=59, length=65, width=28, angle=112, curve=-20, irregularity=81 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `F.cicatrice.multiple` « Multiple » | x=67, y=70, length=38, width=14, angle=109, curve=-17, irregularity=25, traces=3, spacing=40 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `F.cicatrice.sutured` « Suturée » | x=31, y=69, length=48, width=28, angle=48, curve=25, irregularity=19, sutures=oui | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |
| `F.cicatrice.surface` « Surfacique » | mode=patch, x=71, y=68, length=39, width=54, angle=23, irregularity=59 | Conserver la demande · masquer ou archiver le raccourci garde le réglage individuel |

| ID et libellé | Valeur de maturité · effet | Proposition |
| --- | --- | --- |
| `F.maturation.0` « Récente » | 0 · teinte et visibilité de contrôle | Conserver comme repère de rendu · aucun âge ou délai canonique associé |
| `F.maturation.34` « Intermédiaire » | 34 · teinte et visibilité de contrôle | Conserver comme repère de rendu · aucun âge ou délai canonique associé |
| `F.maturation.72` « Ancienne » | 72 · teinte et visibilité de contrôle | Conserver comme repère de rendu · aucun âge ou délai canonique associé |
| `F.maturation.100` « Très ancienne » | 100 · teinte et visibilité de contrôle | Conserver comme repère de rendu · aucun âge ou délai canonique associé |

Le grain de beauté et les deux autres marques individuelles utilisent X/Y. Pour les deux groupes, la liste de zones, la taille moyenne, la densité, l’étendue, la variation et la graine remplacent la pose d’un point individuel. Une même famille graphique peut être déclarée naturelle ou acquise dans la fiche habitant. Les cinq types n’encodent donc pas l’origine.

## G — Palettes et couleurs

### G1 — Personnage et palette · cheveux

Les couleurs sont des jetons finis avec aplat et contour dérivé. Par défaut le rendu hérité conserve ses pigments avec la teinte Châtain clair en mémoire. Le choix de nuancier peut être désactivé si aucun SVG ne change.

**Canon** `biology.naturalHairColor · voluntary.dye · nuance éventuellement réutilisée par les modules liés`. **Archive et provenance** `palette.colour/mode · dès v1 · état de l’onglet dérivé de la nuance importée`. [catalogue](../../../bio-yeux-01/catalogue.mjs) · [availability](../../../bio-yeux-01/availability.mjs) · [render](../../../bio-yeux-01/render.mjs)

*Potentiel générateur.* Réserver les nuances naturelles au trait déclaré et la teinture à la couche volontaire.

*Arbitrages proposés.* Conserver les clés. Regrouper les nuanciers par usage. Masquer un choix d’interface garde sa lecture. Recalibrer une couleur change aussi les calques liés et les anciennes projections. Supprimer une clé casse les références.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `G1.category.natural` « Naturelles » | Personnage et palette | Actif | Affiche les nuanciers naturelles sans modifier la couleur choisie. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `G1.category.fantasy` « Fantaisie » | Personnage et palette | Inactif au démarrage | Affiche les nuanciers fantaisie sans modifier la couleur choisie. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `G1.colour.noir-profond` « Noir profond » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.noir-ebene` « Noir ébène » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.brun-sombre` « Brun sombre » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.brun-chocolat` « Brun chocolat » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.chatain` « Châtain » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.chatain-clair` « Châtain clair » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.blond-cendre` « Blond cendré » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.blond-dore` « Blond doré » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.blond-pale` « Blond pâle » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.roux-cuivre` « Roux cuivré » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.roux-auburn` « Roux auburn » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.gris-acier` « Gris acier » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.gris-perle` « Gris perle » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.colour.blanc-ivoire` « Blanc ivoire » | Personnage et palette | Voir G.cap | Sélectionne la nuance et active son aplat si la coiffure peut changer de palette. | Conserver la clé · masquer garde la lecture · retirer casse ses références |
| `G1.flat-mode` « Appliquer l’aplat et le contour » | Personnage et palette | Décoché | Projette l’aplat et le contour de la nuance choisie. Décoché, le style conserve par défaut ses pigments historiques. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |

### G.cap — Nuances des cheveux et nuances indépendantes des sourcils ou de la barbe

Emplacements « Naturelles », « Fantaisie », « Nuance indépendante » et « Couleur indépendante ». La colonne défaut rappelle les sélections initiales. Source et contours calculés en OKLab. [Nuancier BIO-COL](../../../bio-col-01/palette.mjs)

| ID et libellé | Onglet · famille | Aplat · contour | Défaut, rôle et proposition |
| --- | --- | --- | --- |
| `G.cap.noir-profond` « Noir profond » | Naturelles · Noirs | `#29272f` · `#08070c` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.noir-ebene` « Noir ébène » | Naturelles · Noirs | `#3a3035` · `#120b0f` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.brun-sombre` « Brun sombre » | Naturelles · Bruns | `#4b2f25` · `#1c0904` | Défaut de barbe indépendante · Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.brun-chocolat` « Brun chocolat » | Naturelles · Bruns | `#694332` · `#2e1407` | Défaut des sourcils indépendants · Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.chatain` « Châtain » | Naturelles · Châtains | `#875435` · `#3f1c04` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.chatain-clair` « Châtain clair » | Naturelles · Châtains | `#a57950` · `#503112` | Défaut cheveux mémorisé · Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.blond-cendre` « Blond cendré » | Naturelles · Blonds | `#b7a17a` · `#59492d` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.blond-dore` « Blond doré » | Naturelles · Blonds | `#d7b966` · `#6c5612` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.blond-pale` « Blond pâle » | Naturelles · Blonds | `#f0dfad` · `#786c48` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.roux-cuivre` « Roux cuivré » | Naturelles · Roux | `#b95d32` · `#5a2000` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.roux-auburn` « Roux auburn » | Naturelles · Roux | `#853d2d` · `#3f0b02` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.gris-acier` « Gris acier » | Naturelles · Gris | `#737a83` · `#2f343b` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.gris-perle` « Gris perle » | Naturelles · Gris | `#cbd0d4` · `#616467` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.blanc-ivoire` « Blanc ivoire » | Naturelles · Blancs | `#f5f1e7` · `#797770` | Jeton naturel canonique ou teinture · conserver la clé. Masquer garde les archives. |
| `G.cap.rouge-vif` « Rouge vif » | Fantaisie · Rouges | `#ed344f` · `#74001b` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.rouge-profond` « Rouge profond » | Fantaisie · Rouges | `#a12746` · `#490017` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.rose-clair` « Rose clair » | Fantaisie · Roses | `#f0b6ce` · `#7b5364` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.rose-framboise` « Rose framboise » | Fantaisie · Roses | `#d74691` · `#6d0042` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.violet-amethyste` « Violet améthyste » | Fantaisie · Violets | `#9756bf` · `#481564` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.violet-profond` « Violet profond » | Fantaisie · Violets | `#643c92` · `#2b0849` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.bleu-vif` « Bleu vif » | Fantaisie · Bleus | `#3b66e3` · `#0b207d` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.bleu-nuit` « Bleu nuit » | Fantaisie · Bleus | `#304680` · `#08153e` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.turquoise-clair` « Turquoise clair » | Fantaisie · Turquoises | `#6dcfc8` · `#136661` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.turquoise-profond` « Turquoise profond » | Fantaisie · Turquoises | `#238f96` · `#003f43` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.vert-emeraude` « Vert émeraude » | Fantaisie · Verts | `#2c9b70` · `#00462f` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |
| `G.cap.vert-sauge` « Vert sauge » | Fantaisie · Verts | `#99b57a` · `#43562c` | Teinture ou nuance de calque indépendante · conserver la clé. Masquer garde les archives. |

### G.iris — Nuances des iris

Emplacement « Nuance principale » et « Nuance secondaire ». Les seize nuances sont validées dans le canon et dans les documents d’apparence. Le pigment est découpé à l’ouverture. Une suppression de jeton empêcherait de relire certaines fiches. [Palette des iris](../../../bio-yeux-01/iris.mjs)

| ID et libellé | Famille · aplat · contour | Défaut et proposition |
| --- | --- | --- |
| `G.iris.brun-sombre` « Brun sombre » | natural · `#4c3226` · `#1d0b04` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.marron` « Marron » | natural · `#82532f` · `#3c1c00` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.noisette` « Noisette » | natural · `#9b864a` · `#493a09` | Défaut principal · Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.ambre` « Ambre » | natural · `#c18b36` · `#5d3d00` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.vert` « Vert » | natural · `#748b58` · `#2f3f19` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.gris` « Gris » | natural · `#929da4` · `#40484d` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.bleu` « Bleu » | natural · `#638cae` · `#213e56` | Défaut secondaire latent · Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.bleu-clair` « Bleu clair » | natural · `#a2c9df` · `#456170` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.rouge` « Rouge » | fantasy · `#b73943` · `#5a0011` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.rose` « Rose » | fantasy · `#df83b1` · `#733254` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.violet` « Violet » | fantasy · `#9668bc` · `#472461` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.turquoise` « Turquoise » | fantasy · `#40b9b5` · `#005856` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.or` « Or » | fantasy · `#e8bb39` · `#725800` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.argent` « Argent » | fantasy · `#d5dbe0` · `#666a6e` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.orange` « Orange » | fantasy · `#ed873c` · `#773900` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |
| `G.iris.blanc` « Blanc » | fantasy · `#f4f2e9` · `#797771` | Conserver la clé. Regrouper ou masquer des choix garde la lecture des archives. |

### G.maquillage — Pigments des cinq familles

Emplacement « Couleur » et couleurs principale, secondaire ou de contour. Les options portent leur teinte hexadécimale. Les mêmes clés sont utilisées par le compositeur, les compositions exportées et la fiche habitant. L’option vide est admise pour la couleur secondaire du fard à paupières. [Nuancier et validation](../../../bio-yeux-01/makeup.mjs)

| ID · libellé | Groupe | Référence et action possible |
| --- | --- | --- |
| `G.maquillage.e7c5a9` « #e7c5a9 » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.c89a7c` « #c89a7c » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.ae785e` « #ae785e » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.85543d` « #85543d » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.684331` « #684331 » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.493026` « #493026 » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.c88e80` « #c88e80 » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.ad7467` « #ad7467 » | « Naturelles » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.edb3ba` « #edb3ba » | « Roses et rouges » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.d78399` « #d78399 » | « Roses et rouges » | Défaut Fard à joues / Couleur · Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.cf526f` « #cf526f » | « Roses et rouges » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.a52f47` « #a52f47 » | « Roses et rouges » | Défaut Lèvres / Couleur · Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.79243e` « #79243e » | « Roses et rouges » | Défaut Lèvres / Couleur du contour · Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.a83d30` « #a83d30 » | « Roses et rouges » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.db7452` « #db7452 » | « Roses et rouges » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.733447` « #733447 » | « Roses et rouges » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.e0b43f` « #e0b43f » | « Fantaisie » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.dc8437` « #dc8437 » | « Fantaisie » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.829e4d` « #829e4d » | « Fantaisie » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.397e62` « #397e62 » | « Fantaisie » | Défaut Peintures faciales / Couleur · Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.4d9eab` « #4d9eab » | « Fantaisie » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.3f649b` « #3f649b » | « Fantaisie » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.79549e` « #79549e » | « Fantaisie » | Défaut Fard à paupières / Couleur principale · Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.ac65b2` « #ac65b2 » | « Fantaisie » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.fff8e9` « #fff8e9 » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.e5e2d9` « #e5e2d9 » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.b7b8bd` « #b7b8bd » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.85858e` « #85858e » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.53545e` « #53545e » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.28272d` « #28272d » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.151519` « #151519 » | « Neutres et contrastes » | Défaut Eyeliner / Couleur · Conserver le jeton · une suppression casse les compositions utilisant ce pigment |
| `G.maquillage.b38b4f` « #b38b4f » | « Neutres et contrastes » | Conserver le jeton · une suppression casse les compositions utilisant ce pigment |

### G.peau — Palette héritée de scène et pigments d’étude

La peau courante est une constante de la scène héritée. Aucun sélecteur d’atelier ne définit une pigmentation globale de l’habitant. Les quatre choix de peau des planches alimentent les rendus de contrôle. Les pigments dérivés des lèvres, paupières, marques, cicatrices et aréoles sont des calculs locaux. [Palette de scène](../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs) · [Cas de peau](../../../bio-yeux-01/marks-study.mjs)

| ID · usage | Référence et effet | Proposition |
| --- | --- | --- |
| `G.scene.skin` | `#dbbf88` · aplat de peau | Conserver comme constante du dessin. Toute modification se propage aux dessins et aux teintes dérivées. |
| `G.scene.contour` | `#c2a873` · contour de scène | Conserver comme constante du dessin. Toute modification se propage aux dessins et aux teintes dérivées. |
| `G.scene.detail` | `#c2a873` · détail de scène | Conserver comme constante du dessin. Toute modification se propage aux dessins et aux teintes dérivées. |
| `G.scene.white` | `#ebebeb` · blanc de l’œil | Conserver comme constante du dessin. Toute modification se propage aux dessins et aux teintes dérivées. |
| `G.scene.pupil` | `#171713` · pupille et traits | Conserver comme constante du dessin. Toute modification se propage aux dessins et aux teintes dérivées. |
| `G.scene.hair` | `#75470f` · référence de cheveux héritée | Conserver comme constante du dessin. Toute modification se propage aux dessins et aux teintes dérivées. |
| `G.peau-etude.dbbf88` « Miel » | `#dbbf88` · échantillon de planche | Archiver avec les planches. Masquer le choix ne retire aucune donnée canonique. |
| `G.peau-etude.f4cfb6` « Rosée » | `#f4cfb6` · échantillon de planche | Archiver avec les planches. Masquer le choix ne retire aucune donnée canonique. |
| `G.peau-etude.a57155` « Cuivrée » | `#a57155` · échantillon de planche | Archiver avec les planches. Masquer le choix ne retire aucune donnée canonique. |
| `G.peau-etude.573222` « Brune » | `#573222` · échantillon de planche | Archiver avec les planches. Masquer le choix ne retire aucune donnée canonique. |

## H — Outils historiques et expérimentaux

### H1 — Planches de corps et études visuelles

Les planches utilisent le compositeur et des entrées temporaires propres aux études. Les sélecteurs des études déclenchent le rendu du tableau, indépendamment des demandes d’habitant.

**Canon** —. **Archive et provenance** —. [app](../../../bio-yeux-01/app.mjs) · [body-study](../../../bio-yeux-01/body-study.mjs) · [structure-study](../../../bio-yeux-01/structure-study.mjs) · [corpulence-study](../../../bio-yeux-01/corpulence-study.mjs) · [chest-study](../../../bio-yeux-01/chest-study.mjs) · [pectorals-study](../../../bio-yeux-01/pectorals-study.mjs) · [thorax-details-study](../../../bio-yeux-01/thorax-details-study.mjs) · [bone-relief-study](../../../bio-yeux-01/bone-relief-study.mjs) · [abdominal-study](../../../bio-yeux-01/abdominal-study.mjs) · [belly-detail-study](../../../bio-yeux-01/belly-detail-study.mjs) · [pelvic-anatomy-study](../../../bio-yeux-01/pelvic-anatomy-study.mjs)

*Potentiel générateur.* Fournir cas de référence et limites de cadrage pour des tests reproductibles.

*Arbitrages proposés.* Archiver ou masquer dans un espace de validation. Recalibrer les cas fausse la comparaison avec les décisions antérieures si la référence disparaît. Supprimer l’affichage fait perdre l’accès visuel de recette.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `H1.volet.planche-corps.311` « Planche des corps » | planche corps | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-ossature.312` « Planche de l’ossature » | planche ossature | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.structure-study-scale` « Échelle » | planche ossature | Corps · 178 px · Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-corpulence.314` « Corpulence avant et après correction » | planche corpulence | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.corpulence-study-structure` « Ossature » | planche corpulence | Ossature standard · Ossature standard (`reference`), Ossature fine (`fine`), Ossature large (`wide`), Tous les minima (`min`), Tous les maxima (`max`), Haut large, bassin étroit (`upper`), Haut étroit, bassin large (`lower`) | Choisit les six largeurs du gabarit de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.corpulence-study-scale` « Échelle » | planche corpulence | Corps · 178 px · Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-poitrine.317` « Poitrine féminine adulte · avant et après correction » | planche poitrine | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.chest-study-scale` « Échelle » | planche poitrine | Corps · 178 px · Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`), Thorax · détail (`detail`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.chest-study-skin` « Teinte de peau » | planche poitrine | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-pectoraux.320` « Pectoraux adultes » | planche pectoraux | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pectoral-study-scale` « Échelle » | planche pectoraux | Corps · 178 px · Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pectoral-study-skin` « Teinte de peau » | planche pectoraux | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-details-thorax.323` « Aréoles et mamelons adultes » | planche details thorax | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.thorax-details-study-scale` « Échelle » | planche details thorax | Thorax · détail · Thorax · détail (`detail`), Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.thorax-details-study-skin` « Teinte de peau » | planche details thorax | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-reliefs-osseux.326` « Reliefs osseux et maigreur » | planche reliefs osseux | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.bone-relief-scale` « Échelle » | planche reliefs osseux | Tronc · détail · Tronc · détail (`detail`), Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.bone-relief-structure` « Ossature » | planche reliefs osseux | Ossature standard · Ossature standard (`reference`), Ossature fine (`fine`), Ossature large (`wide`), Tous les minima (`min`), Tous les maxima (`max`), Haut large, bassin étroit (`upper`), Haut étroit, bassin large (`lower`) | Choisit les six largeurs du gabarit de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.bone-relief-skin` « Teinte de peau » | planche reliefs osseux | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-abdominaux.330` « Musculature abdominale » | planche abdominaux | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.abdominal-study-scale` « Échelle » | planche abdominaux | Abdomen · détail · Abdomen · détail (`detail`), Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.abdominal-study-structure` « Ossature » | planche abdominaux | Ossature standard · Ossature standard (`reference`), Ossature fine (`fine`), Ossature large (`wide`), Tous les minima (`min`), Tous les maxima (`max`), Haut large, bassin étroit (`upper`), Haut étroit, bassin large (`lower`) | Choisit les six largeurs du gabarit de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.abdominal-study-skin` « Teinte de peau » | planche abdominaux | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-pli-nombril.334` « Pli abdominal et nombril » | planche pli nombril | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.belly-study-scale` « Échelle » | planche pli nombril | Abdomen · détail · Abdomen · détail (`detail`), Corps · 178 px (`tile`), Tête · 300 px (`head`), Miniature · 70 × 70 px (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.belly-study-structure` « Ossature » | planche pli nombril | Ossature standard · Ossature standard (`reference`), Ossature fine (`fine`), Ossature large (`wide`), Tous les minima (`min`), Tous les maxima (`max`), Haut large, bassin étroit (`upper`), Haut étroit, bassin large (`lower`) | Choisit les six largeurs du gabarit de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.belly-study-skin` « Teinte de peau » | planche pli nombril | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.belly-study-muscle` « Volume musculaire » | planche pli nombril | Plat · 0 % · Plat · 0 % (`0`), Athlétique · 50 % (`50`), Très musclé · 100 % (`100`) | Change le volume abdominal du cas de contrôle du pli. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.diagnostic-pelvien.339` « Diagnostic pelvien » | diagnostic pelvien | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pelvic-study-structure` « Ossature » | diagnostic pelvien | Ossature standard · Ossature standard (`reference`), Ossature fine (`fine`), Ossature large (`wide`), Tous les minima (`min`), Tous les maxima (`max`), Haut large, bassin étroit (`upper`), Haut étroit, bassin large (`lower`) | Choisit les six largeurs du gabarit de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pelvic-study-corpulence` « Corpulence » | diagnostic pelvien | Très obèse · Très maigre (`0`), Maigre (`12.5`), Mince (`25`), Légèrement mince (`37.5`), Standard (`50`), Enrobé (`62.5`), Corpulent (`75`), Obèse (`87.5`), Très obèse (`100`) | Choisit une valeur de corpulence du cas de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.volet.planche-anatomie-pelvienne.342` « Anatomie pelvienne et pilosité » | planche anatomie pelvienne | Replié | Déplie les cas de référence et rend leurs comparaisons. Voir les axes et cas de la planche ci-dessous. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pubic-study-scale` « Échelle » | planche anatomie pelvienne | Bassin · détail · Bassin · détail (`detail`), Corps · 178 px (`tile`), Échelle tête · 300 px · cadrage pelvien (`head`), Miniature · 70 × 70 px · cadrage pelvien (`mini`) | Change le cadrage et les détails affichés dans cette planche seulement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pubic-study-structure` « Ossature » | planche anatomie pelvienne | Ossature standard · Ossature standard (`reference`), Ossature fine (`fine`), Ossature large (`wide`), Tous les minima (`min`), Tous les maxima (`max`), Haut large, bassin étroit (`upper`), Haut étroit, bassin large (`lower`) | Choisit les six largeurs du gabarit de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pubic-study-corpulence` « Corpulence » | planche anatomie pelvienne | 50 % · Standard · 0 % · Très maigre (`0`), 12.5 % · Maigre (`12.5`), 25 % · Mince (`25`), 37.5 % · Légèrement mince (`37.5`), 50 % · Standard (`50`), 62.5 % · Enrobé (`62.5`), 75 % · Corpulent (`75`), 87.5 % · Obèse (`87.5`), 100 % · Très obèse (`100`) | Choisit une valeur de corpulence du cas de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pubic-study-skin` « Teinte de peau » | planche anatomie pelvienne | Miel · Miel (`#dbbf88`), Rosée (`#f4cfb6`), Cuivrée (`#a57155`), Brune (`#573222`) | Applique un pigment de contrôle à cette planche uniquement. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H1.pubic-study-hair` « Couleur des cheveux » | planche anatomie pelvienne | Châtain clair · Noir profond (`noir-profond`), Châtain clair (`chatain-clair`), Roux cuivré (`roux-cuivre`), Blond pâle (`blond-pale`), Blanc ivoire (`blanc-ivoire`) | Change le pigment de référence utilisé pour le pointillé de cette planche. | Archiver · masquer conserve le cas, supprimer retire un contrôle |

### H2 — Planches de visage et variantes

Les planches génèrent des cas indépendants. Les boutons de la Planche des formes et des études de palette appliquent en revanche une sélection au personnage.

**Canon** `— sauf une action d’application explicite`. **Archive et provenance** `— sauf une action d’application explicite`. [app](../../../bio-yeux-01/app.mjs) · [eye-contour-study](../../../bio-yeux-01/eye-contour-study.mjs) · [marks-study](../../../bio-yeux-01/marks-study.mjs) · [scars-study](../../../bio-yeux-01/scars-study.mjs) · [makeup-study](../../../bio-yeux-01/makeup-study.mjs)

*Potentiel générateur.* Conserver des témoins d’effets à différentes échelles, utiles en non-régression.

*Arbitrages proposés.* Archiver les cas de QA et masquer leur accès général si l’outil est simplifié. Une suppression d’un raccourci d’application garde le preset s’il reste ailleurs. Supprimer les données d’étude perd la référence.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `H2.volet.eye-contour-panel.68` « Comparer les rendus avant et après » | Contour naturel des yeux | Replié | Déplie et rend six cas avant/après de contours, cils et eyeliner à quatre cadrages de contrôle. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H2.volet.makeup-study-panel.126` « Voir les sept cas aux trois échelles » | Planche de contrôle du maquillage | Replié | Déplie et rend sept compositions de référence aux trois échelles usuelles et en détail. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H2.volet.scar-study-panel.150` « Comparer les six formes et les quatre maturations » | Planche de cicatrices | Replié | Déplie six formes et quatre maturités de cicatrice pour le cas sélectionné. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H2.scar-study-case` « Cas d’étude » | Planche de cicatrices | Neutre · Miel · Amande · Neutre · Miel · Amande (`0`), Visage long · Rosée · Iris (`1`), Visage large · Cuivrée · Argile (`2`), Pommettes marquées · Brune · Sienne (`3`) | Change le visage, la teinte et la graine de référence des cas de l’étude. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H2.freckle-case` « Cas d’étude » | Planche de rousseur | Neutre · Miel · Amande · Neutre · Miel · Amande (`0`), Visage long · Rosée · Iris (`1`), Visage large · Cuivrée · Argile (`2`), Pommettes marquées · Brune · Sienne (`3`) | Change le visage, la teinte et la graine de référence des cas de l’étude. | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H2.eyeForm.historical` « Historique » | Planche des formes | Actif | Applique la forme Historique au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.round` « Rond » | Planche des formes | Inactif au démarrage | Applique la forme Rond au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.oval` « Ovale » | Planche des formes | Inactif au démarrage | Applique la forme Ovale au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.almond` « Amande » | Planche des formes | Inactif au démarrage | Applique la forme Amande au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.narrow` « Étroit » | Planche des formes | Inactif au démarrage | Applique la forme Étroit au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.upturned` « Relevé » | Planche des formes | Inactif au démarrage | Applique la forme Relevé au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.downturned` « Tombant » | Planche des formes | Inactif au démarrage | Applique la forme Tombant au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.heavy` « Paupière lourde » | Planche des formes | Inactif au démarrage | Applique la forme Paupière lourde au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.crescent` « Demi-lune » | Planche des formes | Inactif au démarrage | Applique la forme Demi-lune au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.minimum` « Extrême minimum » | Planche des formes | Inactif au démarrage | Applique la forme Extrême minimum au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.eyeForm.maximum` « Extrême maximum » | Planche des formes | Inactif au démarrage | Applique la forme Extrême maximum au personnage. Même action que la forme correspondante dans le sélecteur. | Regrouper · retirer ce raccourci garde le choix dans Forme |
| `H2.volet.series-panel.432` « Une coiffure dans les 26 teintes » | Étude des 26 teintes | Replié | Déplie 26 rendus d’une même coupe et génère les boutons Choisir… | Archiver · masquer conserve le cas, supprimer retire un contrôle |
| `H2.volet.variety-panel.433` « Une teinte sur plusieurs coiffures » | Étude de plusieurs coiffures | Replié | Déplie 16 variantes d’une même teinte et génère les boutons Inspecter… | Archiver · masquer conserve le cas, supprimer retire un contrôle |

### H.planche — Études, cas et usage

| ID et titre | Ce que le cas vérifie | Réglages ou cas repérés | Sortie et action possible |
| --- | --- | --- | --- |
| `H.planche.eye-contour-panel` « Contour naturel des yeux » | Avant/après R02. Inclut l’ouverture héritée et les interactions avec les cils et l’eyeliner. | Ouverture historique · Avant · Après · Contour seul · Avant · Après · Cils naturels · faible densité · Avant | 48 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [eye-contour-study](../../../bio-yeux-01/eye-contour-study.mjs) |
| `H.planche.makeup-study-panel` « Planche de contrôle du maquillage » | Sept compositions, combinaison des familles et asymétrie. | Lèvres · contour de prune · Fard à paupières · dégradé bicolore · Eyeliner · pointe montante · Fard à joues · pommettes hautes · Peintures · croissants en miroir · Lèvres, paupières, eyeliner et joues · Cinq familles · composition asymétrique | 28 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [makeup-study](../../../bio-yeux-01/makeup-study.mjs) |
| `H.planche.scar-study-panel` « Planche de cicatrices » | Six formes et quatre maturités. Quatre cas visage/peau/graine. | Linéaire · Courbe · Irrégulière · Multiple · Suturée · Surfacique · Récente · Intermédiaire | 40 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [scars-study](../../../bio-yeux-01/scars-study.mjs) |
| `H.planche.planche-corps` « Planche des corps » | Compare six gabarits hérités et deux bases adultes. Repères externes et trois échelles. | Repères anatomiques · Base adulte masculine (H) · Base adulte féminine (F) · Corps de référence · Silhouette mince · Silhouette large · Épaules étroites · Épaules larges | 26 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [body-study](../../../bio-yeux-01/body-study.mjs) |
| `H.planche.planche-ossature` « Planche de l’ossature » | Sept combinaisons des six largeurs, puis leurs extrêmes individuels sur H et F. | Référence et combinaisons · Référence · Ossature fine · Ossature large · Tous les minima · Tous les maxima · Haut large, bassin étroit · Haut étroit, bassin large | 38 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [structure-study](../../../bio-yeux-01/structure-study.mjs) |
| `H.planche.planche-corpulence` « Corpulence avant et après correction » | Enveloppe originale puis corrigée à neuf niveaux pour H et F. | 0 % · Très maigre · 12,5 % · Maigre · 25 % · Mince · 37,5 % · Légèrement mince · 50 % · Standard · 62,5 % · Enrobé · 75 % · Corpulent · 87,5 % · Obèse | 36 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [corpulence-study](../../../bio-yeux-01/corpulence-study.mjs) |
| `H.planche.planche-poitrine` « Poitrine féminine adulte · avant et après correction » | R01/R02, volumes, variations de forme, corpulences et ossatures. | Corpulence standard · 0 % · Plate · 25 % · Petite · 50 % · Moyenne · 75 % · Volumineuse · 100 % · Très volumineuse · Corpulence à 100 % · 25 % · Petite | 70 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [chest-study](../../../bio-yeux-01/chest-study.mjs) |
| `H.planche.planche-pectoraux` « Pectoraux adultes » | Cinq axes, volume par corpulence, ossature et comparaison H/F. | Corpulence et volume musculaire · Variations des cinq réglages · Ossatures · Comparaison des bases H et F · Mince · Volume 75 % · Standard · Volume 75 % · Très obèse · Volume 75 % | 35 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [pectorals-study](../../../bio-yeux-01/pectorals-study.mjs) |
| `H.planche.planche-details-thorax` « Aréoles et mamelons adultes » | Détail centré avant/après et limites des cinq axes avec variations du porteur. | Comparaison du détail centré · Avant · R01 · Après · R02 · Variations des cinq réglages aréolaires · Taille de l’aréole · Forme de l’aréole · Pigmentation · Position horizontale | 48 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [thorax-details-study](../../../bio-yeux-01/thorax-details-study.mjs) |
| `H.planche.planche-reliefs-osseux` « Reliefs osseux et maigreur » | Avant/après et recouvrement par des volumes thoraciques. | Avant et après aux neuf niveaux de corpulence · 0 % · Très maigre · 12,5 % · Maigre · 25 % · Mince · 37,5 % · Légèrement mince · 50 % · Standard · 62,5 % · Enrobé · 75 % · Corpulent | 40 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [bone-relief-study](../../../bio-yeux-01/bone-relief-study.mjs) |
| `H.planche.planche-abdominaux` « Musculature abdominale » | Volumes, corpulences et variations des quatre axes sur H et F. | Corpulence et volume musculaire · Mince · Volume 0 % · Mince · Volume 50 % · Mince · Volume 100 % · Standard · Volume 0 % · Standard · Volume 50 % · Standard · Volume 100 % · Très obèse · Volume 0 % | 42 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [abdominal-study](../../../bio-yeux-01/abdominal-study.mjs) |
| `H.planche.planche-pli-nombril` « Pli abdominal et nombril » | Comparaison R01/R02 aux neuf niveaux de corpulence avec volume musculaire de contrôle. | Comparaison aux neuf niveaux de corpulence · 0 % · Très maigre · 12,5 % · Maigre · 25 % · Mince · 37,5 % · Légèrement mince · 50 % · Standard · 62,5 % · Enrobé · 75 % · Corpulent | 36 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [belly-detail-study](../../../bio-yeux-01/belly-detail-study.mjs) |
| `H.planche.diagnostic-pelvien` « Diagnostic pelvien » | Montre les repères et la marge sous le pli, en unités SVG. | Base H · Base F | 2 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [belly-detail-study](../../../bio-yeux-01/belly-detail-study.mjs) |
| `H.planche.planche-anatomie-pelvienne` « Anatomie pelvienne et pilosité » | Compare R01/R02 aux six paliers de pousse, avec ossature, corpulence, peau et pigment de contrôle. | 0 % · Rasé · 10 % · Début de repousse · 25 % · Texture fine · 50 % · Texture dense · 75 % · Points rapprochés · 100 % · Couverture presque pleine | 24 figures au réglage initial observé · Archiver avec ses constantes et son accès de recette. [pelvic-anatomy-study](../../../bio-yeux-01/pelvic-anatomy-study.mjs) |
| `H.planche.series-panel` « Une coiffure dans les 26 teintes » | Rendu corps et deux miniatures de la même coupe. Chaque bouton applique une teinte. | Noir profond · Noir ébène · Brun sombre · Brun chocolat · Châtain · Châtain clair · Blond cendré · Blond doré | Archiver avec ses constantes et son accès de recette. [app](../../../bio-yeux-01/app.mjs) |
| `H.planche.variety-panel` « Une teinte sur plusieurs coiffures » | Corps et miniature sur 16 entrées. Chaque bouton applique le choix au personnage. | 38-G · 48-G · 08 · 14 · 10 · 41-G · 56-D · 61-D | Archiver avec ses constantes et son accès de recette. [app](../../../bio-yeux-01/app.mjs) |
| `H.planche.planche` « Planche des formes » | Compare le contour historique, huit formes et deux extrêmes. Les boutons appliquent la forme. | Voir `C.forme.*` et `H2.eyeForm.*`. | Regrouper · masquer conserve les formes dans le sélecteur. [app](../../../bio-yeux-01/app.mjs) |
| `H.planche.planche-rousseur` « Planche de rousseur » | Vérifie la densité et la distribution de groupes de taches selon le cas. | 4 cas × 3 densités (27, 59, 100) × 4 cadrages. | Archiver au titre de la validation des marques. [marks-study](../../../bio-yeux-01/marks-study.mjs) |

**Cas nommés.** Chaque identifiant ci-dessous désigne un cas, une famille de figures ou un bloc titré à l’intérieur d’une planche. Les figures aux différentes échelles héritent de la même entrée. Les planches et cas peuvent s’archiver indépendamment. Leur retrait supprimerait la comparaison associée. Leur rôle est de fournir des témoins reproductibles, sans écrire dans le canon ou les archives.

- **Contour naturel des yeux** · `H.cas.eye-contour-panel.01` « Ouverture historique » · `H.cas.eye-contour-panel.02` « Contour seul » · `H.cas.eye-contour-panel.03` « Cils naturels · faible densité » · `H.cas.eye-contour-panel.04` « Cils naturels · forte densité » · `H.cas.eye-contour-panel.05` « Cils et eyeliner noir » · `H.cas.eye-contour-panel.06` « Eyeliner bleu »
- **Planche de contrôle du maquillage** · `H.cas.makeup-study-panel.01` « Lèvres · contour de prune » · `H.cas.makeup-study-panel.02` « Fard à paupières · dégradé bicolore » · `H.cas.makeup-study-panel.03` « Eyeliner · pointe montante » · `H.cas.makeup-study-panel.04` « Fard à joues · pommettes hautes » · `H.cas.makeup-study-panel.05` « Peintures · croissants en miroir » · `H.cas.makeup-study-panel.06` « Lèvres, paupières, eyeliner et joues » · `H.cas.makeup-study-panel.07` « Cinq familles · composition asymétrique »
- **Planche de cicatrices** · `H.cas.scar-study-panel.01` « Linéaire » · `H.cas.scar-study-panel.02` « Courbe » · `H.cas.scar-study-panel.03` « Irrégulière » · `H.cas.scar-study-panel.04` « Multiple » · `H.cas.scar-study-panel.05` « Suturée » · `H.cas.scar-study-panel.06` « Surfacique » · `H.cas.scar-study-panel.07` « Récente » · `H.cas.scar-study-panel.08` « Intermédiaire » · `H.cas.scar-study-panel.09` « Ancienne » · `H.cas.scar-study-panel.10` « Très ancienne »
- **Planche des corps** · `H.cas.planche-corps.01` « Repères anatomiques » · `H.cas.planche-corps.02` « Base adulte masculine (H) » · `H.cas.planche-corps.03` « Base adulte féminine (F) » · `H.cas.planche-corps.04` « Corps de référence » · `H.cas.planche-corps.05` « Silhouette mince » · `H.cas.planche-corps.06` « Silhouette large » · `H.cas.planche-corps.07` « Épaules étroites » · `H.cas.planche-corps.08` « Épaules larges » · `H.cas.planche-corps.09` « Buste volumineux »
- **Planche de l’ossature** · `H.cas.planche-ossature.01` « Référence et combinaisons » · `H.cas.planche-ossature.02` « Référence » · `H.cas.planche-ossature.03` « Ossature fine » · `H.cas.planche-ossature.04` « Ossature large » · `H.cas.planche-ossature.05` « Tous les minima » · `H.cas.planche-ossature.06` « Tous les maxima » · `H.cas.planche-ossature.07` « Haut large, bassin étroit » · `H.cas.planche-ossature.08` « Haut étroit, bassin large » · `H.cas.planche-ossature.09` « Extrêmes de chaque largeur » · `H.cas.planche-ossature.10` « Largeur du cou » · `H.cas.planche-ossature.11` « Largeur des épaules » · `H.cas.planche-ossature.12` « Largeur du thorax » · `H.cas.planche-ossature.13` « Largeur de la taille » · `H.cas.planche-ossature.14` « Largeur du bassin » · `H.cas.planche-ossature.15` « Largeur de la base du pion »
- **Corpulence avant et après correction** · `H.cas.planche-corpulence.01` « 0 % · Très maigre » · `H.cas.planche-corpulence.02` « 12,5 % · Maigre » · `H.cas.planche-corpulence.03` « 25 % · Mince » · `H.cas.planche-corpulence.04` « 37,5 % · Légèrement mince » · `H.cas.planche-corpulence.05` « 50 % · Standard » · `H.cas.planche-corpulence.06` « 62,5 % · Enrobé » · `H.cas.planche-corpulence.07` « 75 % · Corpulent » · `H.cas.planche-corpulence.08` « 87,5 % · Obèse » · `H.cas.planche-corpulence.09` « 100 % · Très obèse »
- **Poitrine féminine adulte · avant et après correction** · `H.cas.planche-poitrine.01` « Corpulence standard » · `H.cas.planche-poitrine.02` « 0 % · Plate » · `H.cas.planche-poitrine.03` « 25 % · Petite » · `H.cas.planche-poitrine.04` « 50 % · Moyenne » · `H.cas.planche-poitrine.05` « 75 % · Volumineuse » · `H.cas.planche-poitrine.06` « 100 % · Très volumineuse » · `H.cas.planche-poitrine.07` « Corpulence à 100 % » · `H.cas.planche-poitrine.08` « 25 % · Petite » · `H.cas.planche-poitrine.09` « 50 % · Moyenne » · `H.cas.planche-poitrine.10` « 75 % · Volumineuse » · `H.cas.planche-poitrine.11` « 100 % · Très volumineuse » · `H.cas.planche-poitrine.12` « Variations de forme » · `H.cas.planche-poitrine.13` « Largeur · 0 % » · `H.cas.planche-poitrine.14` « Largeur · 50 % » · `H.cas.planche-poitrine.15` « Largeur · 100 % » · `H.cas.planche-poitrine.16` « Allongement · 0 % » · `H.cas.planche-poitrine.17` « Allongement · 50 % » · `H.cas.planche-poitrine.18` « Allongement · 100 % » · `H.cas.planche-poitrine.19` « Affaissement · 0 % » · `H.cas.planche-poitrine.20` « Affaissement · 50 % » · `H.cas.planche-poitrine.21` « Affaissement · 100 % » · `H.cas.planche-poitrine.22` « Rondeur · 0 % » · `H.cas.planche-poitrine.23` « Rondeur · 50 % » · `H.cas.planche-poitrine.24` « Rondeur · 100 % » · `H.cas.planche-poitrine.25` « Écartement · 0 % » · `H.cas.planche-poitrine.26` « Écartement · 50 % » · `H.cas.planche-poitrine.27` « Écartement · 100 % » · `H.cas.planche-poitrine.28` « Ossature et corpulence » · `H.cas.planche-poitrine.29` « Ossature standard · Corpulence 0 % » · `H.cas.planche-poitrine.30` « Ossature standard · Corpulence 50 % » · `H.cas.planche-poitrine.31` « Ossature standard · Corpulence 100 % » · `H.cas.planche-poitrine.32` « Ossature fine · Corpulence 0 % » · `H.cas.planche-poitrine.33` « Ossature fine · Corpulence 50 % » · `H.cas.planche-poitrine.34` « Ossature fine · Corpulence 100 % » · `H.cas.planche-poitrine.35` « Ossature large · Corpulence 0 % » · `H.cas.planche-poitrine.36` « Ossature large · Corpulence 50 % » · `H.cas.planche-poitrine.37` « Ossature large · Corpulence 100 % » · `H.cas.planche-poitrine.38` « Tous les minima » · `H.cas.planche-poitrine.39` « Tous les maxima »
- **Pectoraux adultes** · `H.cas.planche-pectoraux.01` « Corpulence et volume musculaire » · `H.cas.planche-pectoraux.02` « Variations des cinq réglages » · `H.cas.planche-pectoraux.03` « Ossatures » · `H.cas.planche-pectoraux.04` « Comparaison des bases H et F » · `H.cas.planche-pectoraux.05` « Mince · Volume 75 % » · `H.cas.planche-pectoraux.06` « Standard · Volume 75 % » · `H.cas.planche-pectoraux.07` « Très obèse · Volume 75 % »
- **Aréoles et mamelons adultes** · `H.cas.planche-details-thorax.01` « Comparaison du détail centré » · `H.cas.planche-details-thorax.02` « Avant · R01 » · `H.cas.planche-details-thorax.03` « Après · R02 » · `H.cas.planche-details-thorax.04` « Variations des cinq réglages aréolaires » · `H.cas.planche-details-thorax.05` « Taille de l’aréole » · `H.cas.planche-details-thorax.06` « Forme de l’aréole » · `H.cas.planche-details-thorax.07` « Pigmentation » · `H.cas.planche-details-thorax.08` « Position horizontale » · `H.cas.planche-details-thorax.09` « Position verticale » · `H.cas.planche-details-thorax.10` « Volumes, ossatures et corpulences » · `H.cas.planche-details-thorax.11` « Thorax plat · deux bases » · `H.cas.planche-details-thorax.12` « Ossature fine · corpulence 0 % » · `H.cas.planche-details-thorax.13` « Ossature et corpulence standards » · `H.cas.planche-details-thorax.14` « Ossature large · corpulence 75 % » · `H.cas.planche-details-thorax.15` « Corpulence 100 % · volumes 100 % » · `H.cas.planche-details-thorax.16` « Limites basses · détails petits et hauts » · `H.cas.planche-details-thorax.17` « Limites hautes · détails ovales et bas »
- **Reliefs osseux et maigreur** · `H.cas.planche-reliefs-osseux.01` « Avant et après aux neuf niveaux de corpulence » · `H.cas.planche-reliefs-osseux.02` « 0 % · Très maigre » · `H.cas.planche-reliefs-osseux.03` « 12,5 % · Maigre » · `H.cas.planche-reliefs-osseux.04` « 25 % · Mince » · `H.cas.planche-reliefs-osseux.05` « 37,5 % · Légèrement mince » · `H.cas.planche-reliefs-osseux.06` « 50 % · Standard » · `H.cas.planche-reliefs-osseux.07` « 62,5 % · Enrobé » · `H.cas.planche-reliefs-osseux.08` « 75 % · Corpulent » · `H.cas.planche-reliefs-osseux.09` « 87,5 % · Obèse » · `H.cas.planche-reliefs-osseux.10` « 100 % · Très obèse » · `H.cas.planche-reliefs-osseux.11` « Recouvrement par les volumes thoraciques » · `H.cas.planche-reliefs-osseux.12` « Base H · Corpulence 0 % » · `H.cas.planche-reliefs-osseux.13` « Base F · Corpulence 0 % »
- **Musculature abdominale** · `H.cas.planche-abdominaux.01` « Corpulence et volume musculaire » · `H.cas.planche-abdominaux.02` « Mince · Volume 0 % » · `H.cas.planche-abdominaux.03` « Mince · Volume 50 % » · `H.cas.planche-abdominaux.04` « Mince · Volume 100 % » · `H.cas.planche-abdominaux.05` « Standard · Volume 0 % » · `H.cas.planche-abdominaux.06` « Standard · Volume 50 % » · `H.cas.planche-abdominaux.07` « Standard · Volume 100 % » · `H.cas.planche-abdominaux.08` « Très obèse · Volume 0 % » · `H.cas.planche-abdominaux.09` « Très obèse · Volume 50 % » · `H.cas.planche-abdominaux.10` « Très obèse · Volume 100 % » · `H.cas.planche-abdominaux.11` « Variations des quatre réglages » · `H.cas.planche-abdominaux.12` « Volume musculaire · 0 % » · `H.cas.planche-abdominaux.13` « Volume musculaire · 50 % » · `H.cas.planche-abdominaux.14` « Volume musculaire · 100 % » · `H.cas.planche-abdominaux.15` « Définition musculaire · 0 % » · `H.cas.planche-abdominaux.16` « Définition musculaire · 50 % » · `H.cas.planche-abdominaux.17` « Définition musculaire · 100 % » · `H.cas.planche-abdominaux.18` « Largeur · 0 % » · `H.cas.planche-abdominaux.19` « Largeur · 50 % » · `H.cas.planche-abdominaux.20` « Largeur · 100 % » · `H.cas.planche-abdominaux.21` « Développement des obliques · 0 % » · `H.cas.planche-abdominaux.22` « Développement des obliques · 50 % » · `H.cas.planche-abdominaux.23` « Développement des obliques · 100 % »
- **Pli abdominal et nombril** · `H.cas.planche-pli-nombril.01` « Comparaison aux neuf niveaux de corpulence » · `H.cas.planche-pli-nombril.02` « 0 % · Très maigre » · `H.cas.planche-pli-nombril.03` « 12,5 % · Maigre » · `H.cas.planche-pli-nombril.04` « 25 % · Mince » · `H.cas.planche-pli-nombril.05` « 37,5 % · Légèrement mince » · `H.cas.planche-pli-nombril.06` « 50 % · Standard » · `H.cas.planche-pli-nombril.07` « 62,5 % · Enrobé » · `H.cas.planche-pli-nombril.08` « 75 % · Corpulent » · `H.cas.planche-pli-nombril.09` « 87,5 % · Obèse » · `H.cas.planche-pli-nombril.10` « 100 % · Très obèse »
- **Diagnostic pelvien** · `H.cas.diagnostic-pelvien.01` « Base H » · `H.cas.diagnostic-pelvien.02` « Base F »
- **Anatomie pelvienne et pilosité** · `H.cas.planche-anatomie-pelvienne.01` « 0 % · Rasé » · `H.cas.planche-anatomie-pelvienne.02` « 10 % · Début de repousse » · `H.cas.planche-anatomie-pelvienne.03` « 25 % · Texture fine » · `H.cas.planche-anatomie-pelvienne.04` « 50 % · Texture dense » · `H.cas.planche-anatomie-pelvienne.05` « 75 % · Points rapprochés » · `H.cas.planche-anatomie-pelvienne.06` « 100 % · Couverture presque pleine »

| ID · bouton généré | Position et action | Proposition |
| --- | --- | --- |
| `H.carte.series-panel.noir-profond` « Choisir Noir profond » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.noir-ebene` « Choisir Noir ébène » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.brun-sombre` « Choisir Brun sombre » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.brun-chocolat` « Choisir Brun chocolat » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.chatain` « Choisir Châtain » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.chatain-clair` « Choisir Châtain clair » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.blond-cendre` « Choisir Blond cendré » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.blond-dore` « Choisir Blond doré » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.blond-pale` « Choisir Blond pâle » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.roux-cuivre` « Choisir Roux cuivré » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.roux-auburn` « Choisir Roux auburn » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.gris-acier` « Choisir Gris acier » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.gris-perle` « Choisir Gris perle » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.blanc-ivoire` « Choisir Blanc ivoire » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.rouge-vif` « Choisir Rouge vif » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.rouge-profond` « Choisir Rouge profond » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.rose-clair` « Choisir Rose clair » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.rose-framboise` « Choisir Rose framboise » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.violet-amethyste` « Choisir Violet améthyste » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.violet-profond` « Choisir Violet profond » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.bleu-vif` « Choisir Bleu vif » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.bleu-nuit` « Choisir Bleu nuit » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.turquoise-clair` « Choisir Turquoise clair » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.turquoise-profond` « Choisir Turquoise profond » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.vert-emeraude` « Choisir Vert émeraude » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.series-panel.vert-sauge` « Choisir Vert sauge » | « Une coiffure dans les 26 teintes » · applique la nuance et son aplat | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-038:G` « Inspecter 38-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-048:G` « Inspecter 48-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.curls:U` « Inspecter 08 » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.waist_waves:U` « Inspecter 14 » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.braids:U` « Inspecter 10 » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-041:G` « Inspecter 41-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-056:D` « Inspecter 56-D » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-061:D` « Inspecter 61-D » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-071:G` « Inspecter 71-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-029:G` « Inspecter 29-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-034:G` « Inspecter 34-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-051:G` « Inspecter 51-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-058:G` « Inspecter 58-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-068:G` « Inspecter 68-G » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-024:D` « Inspecter 24-D » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |
| `H.carte.variety-panel.p5-058:D` « Inspecter 58-D » | « Une teinte sur plusieurs coiffures » · applique l’entrée capillaire | Archiver la planche ou masquer le bouton · le même choix reste dans le panneau principal |

Les cadrages de contrôle supplémentaires (« Détail des yeux », « Gros plan », thorax ou bassin) agrandissent des projections. Ils restent indépendants du format habitant. Les trois représentations publiques correspondent à `head`/`portrait`, `tile`/`pawn` et `mini`/`thumbnail`. Le lien entre cadrages et profils est documenté dans [Dépendances](DEPENDANCES.md#rendu-et-représentations).

### H.archives — Commandes corporelles retirées

Ces éléments étaient exposés dans les révisions indiquées. Leur disparition de l’interface R02 est déjà acquise. Les actions d’archivage proposées concernent la documentation et la lecture des données. Aucun de ces anciens contrôles ne constitue un axe du générateur courant.

| ID et ancien libellé | Défaut · domaine | Fonction historique et restitution |
| --- | --- | --- |
| `H.ancien.poitrine.divergence` « Divergence » | 0 · −100 à 100 | Inclinait latéralement les volumes de poitrine. La valeur transite par `chestOrigin.divergence`. Archiver en gardant sa lecture. |
| `H.ancien.poitrine.position` « Position verticale » | 52 · 0 à 100 | Déplaçait l’ancrage selon les niveaux épaules/thorax. La valeur transite par `chestOrigin.position`. Archiver en gardant sa lecture. |
| `H.ancien.poitrine.reference` « Forme de référence » | Personnalisée · six références | Appliquait un sous-ensemble de demandes de la poitrine initiale. Le document conserve les demandes, indépendamment de ce raccourci retiré. Archiver le sélecteur et ses vecteurs. |
| `H.ancien.thorax.nippleSize` « Taille du mamelon » | H 34, F 42 · 0 à 100 | Modulait la taille du mamelon sur l’aréole. La valeur originale validée reste dans `historicalSource`. |
| `H.ancien.thorax.relief` « Relief du mamelon » | H 31, F 37 · 0 à 100 | Modulait le modelé du mamelon. La valeur originale validée reste dans `historicalSource`. |
| `H.ancien.nombril.size` « Taille » | 38 · 0 à 100 | Taille du nombril, limitée par le volume disponible. Conserver en lecture v20 et archiver. |
| `H.ancien.nombril.shape` « Forme » | 36 · 0 à 100 | Aplatissement et allongement de la géométrie du nombril. Conserver en lecture v20 et archiver. |
| `H.ancien.nombril.relief` « Relief » | 28 · 0 à 100 | Modifiait le modelé et les opacités du nombril. Conserver en lecture v20 et archiver. |

Les anciens vecteurs ci-dessous suivent l’ordre Largeur, Allongement, Rondeur, Écartement, Divergence, Position verticale, Affaissement. Le volume courant était conservé lors de l’application. Le raccourci n’a plus d’usage en canon. Retirer la documentation perdrait la référence, les demandes historiques restant prises en charge par le lecteur.

| ID et libellé | Vecteur d’origine |
| --- | --- |
| `H.ancien.poitrine.round` « Arrondie » | 76, 28, 94, 38, 0, 61, 12 |
| `H.ancien.poitrine.drop` « En goutte » | 56, 57, 78, 42, 8, 55, 56 |
| `H.ancien.poitrine.long` « Allongée » | 23, 98, 57, 44, −8, 53, 33 |
| `H.ancien.poitrine.cone` « Conique » | 46, 44, 4, 38, 11, 62, 8 |
| `H.ancien.poitrine.divergent` « Divergente » | 55, 52, 65, 74, 90, 57, 38 |
| `H.ancien.poitrine.low` « Affaissée » | 68, 58, 64, 48, 18, 47, 96 |

[Poitrine initiale](https://github.com/Thsethse/Microcosme/blob/c24b5b0/bio-yeux-01/chest.mjs) · [Anciennes références du thorax](https://github.com/Thsethse/Microcosme/blob/9d2963a/bio-yeux-01/thorax-details.mjs) · [Ancien nombril](../../../bio-yeux-01/belly-details-before.mjs) · [Lecture actuelle](../../../bio-yeux-01/appearance.mjs)

### H.origine — Héritages graphiques et outils indépendants

Les ID ci-dessous repèrent les ateliers et références antérieurs qui expliquent le périmètre. Les apparences R02 chargent les composants de rendu utilisés par P5, BIO-COL et les lots de dédoublonnage via leurs modules. Les pages indépendantes et leurs commandes sont des objets de référence hors de la surface de R02. Le sort des commandes actuelles se décide dans les tableaux A à J.

| ID et référence | Lien avec R02 et proposition |
| --- | --- |
| `H.origine.bio-vec-p0` BIO-VEC-P0 — Atelier des visages | Origine de l’atelier vectoriel des visages. Archive de conception. [Source](../../../preview/bio-vec-p0/README.md) |
| `H.origine.bio-vis-p1` BIO-VIS-P1 — Les habitants | Premières représentations historiques. Archive de conception. [Source](../../../preview/bio-vis-p1/README.md) |
| `H.origine.bio-vis-p2` BIO-VIS-P2 — Construction capillaire vectorielle | Gabarits et composition capillaire hérités. Conserver les modules utilisés et archiver l’atelier. [Source](../../../preview/bio-vis-p2/README.md) |
| `H.origine.bio-vis-p3` BIO-VIS-P3 — Adaptation morphologique continue | Référence d’adaptation continue. Conserver l’héritage des axes et archiver les démonstrations. [Source](../../../preview/bio-vis-p3/README.md) |
| `H.origine.bio-vis-p3-r1` BIO-VIS-P3-R1 — Correction du recouvrement capillaire | Garde-fous de couverture du crâne. Conserver la fixture du cas combiné. [Source](../../../preview/bio-vis-p3-r1/README.md) |
| `H.origine.bio-vis-p4` BIO-VIS-P4 — Catalogue capillaire | Bibliothèque initiale des 18 références avant les six lots P5. Conserver les clés et le dessin. [Source](../../../preview/bio-vis-p4/README.md) |
| `H.origine.bio-vis-p4-r1` BIO-VIS-P4-R1 — Finitions capillaires | Finitions utilisées dans la lignée du catalogue. Conserver la référence. [Source](../../../preview/bio-vis-p4-r1/README.md) |
| `H.origine.bio-vis-p5-i1` BIO-VIS-P5-I1 — Lot A expérimental | Lot A. Garde des références capillaires et leur rendu. [Source](../../../preview/bio-vis-p5-i1/README.md) |
| `H.origine.bio-vis-p5-i2` BIO-VIS-P5-I2 — Lot B expérimental | Lot B. Garde des références capillaires et leur rendu. [Source](../../../preview/bio-vis-p5-i2/README.md) |
| `H.origine.bio-vis-p5-i3` BIO-VIS-P5-I3 — Lot C expérimental | Lot C. Garde des références capillaires et leur rendu. [Source](../../../preview/bio-vis-p5-i3/README.md) |
| `H.origine.bio-vis-p5-i4` BIO-VIS-P5-I4 — Lot D expérimental | Lot D. Garde des références capillaires et leur rendu. [Source](../../../preview/bio-vis-p5-i4/README.md) |
| `H.origine.bio-vis-p5-i5` BIO-VIS-P5-I5 — Lot E version 1 | Lot E. Source des axes exportés par P5-I6. Conserver gabarits et axes. [Source](../../../preview/bio-vis-p5-i5/README.md) |
| `H.origine.bio-vis-p5-i6` BIO-VIS-P5-I6 — Lot F, références 64–72 | Lot F, source courante du modèle de tête et des arrangements. Conserver les modules actifs. [Source](../../../preview/bio-vis-p5-i6/README.md) |
| `H.origine.bio-vis-dedup-lot-1` Microcosme · Cheveux · Lot 1 | Quatre corrections locales. Conserver leurs variantes par clé. Archiver l’écran de comparaison. [Source](../../../preview/bio-vis-dedup-lot-1/index.html) |
| `H.origine.bio-vis-dedup-lot-2` Microcosme · Catalogue capillaire · Lot 2 | Six groupes et imports historiques transparents. Conserver le résolveur et les clés. [Source](../../../preview/bio-vis-dedup-lot-2/index.html) |
| `H.origine.bio-vis-dedup-lot-3` Microcosme · Lot 3 · Volumes, pointes et panneaux | Corrections locales et reprise de la sélection du lot 2. Conserver les dessins individuels. [Source](../../../preview/bio-vis-dedup-lot-3/index.html) |
| `H.origine.bio-gen-t1` BIO-GEN-T1 — Lot B | Prototype séparé de génération. Archive de recherche, aucun réglage repris par les formulaires R02. [Source](../../../preview/bio-gen-t1/README.md) |
| `H.origine.bio-gen-t1-b2` BIO-GEN-T1 — B2 | Prototype séparé avec témoins B1/B2. Archive de recherche. [Source](../../../preview/bio-gen-t1-b2/README.md) |
| `H.origine.bio-gen-t2` BIO-GEN-T2 | Prototype géométrique indépendant. Archive de recherche. [Source](../../../preview/bio-gen-t2/README.md) |
| `H.origine.bio-struct-t3-a` BIO-STRUCT-T3-A | Expérimentation structurelle hors parcours R02. Archive de recherche. [Source](../../../preview/bio-struct-t3-a/README.md) |
| `H.origine.bio-struct-t3-a-r1` BIO-STRUCT-T3-A-R1 | Corrections et ancrages faciaux du prototype. Archive de recherche. [Source](../../../preview/bio-struct-t3-a-r1/README.md) |
| `H.origine.bio-struct-t3-a-r2` BIO-STRUCT-T3-A-R2 | Variante autonome du prototype. Archive de recherche. [Source](../../../preview/bio-struct-t3-a-r2/README.md) |
| `H.origine.bio-struct-t3-a-r3` BIO-STRUCT-T3-A-R3 | Variante autonome du prototype. Archive de recherche. [Source](../../../preview/bio-struct-t3-a-r3/README.md) |
| `H.origine.bio-struct-t3-b1` BIO-STRUCT-T3-B1 | Variante autonome du prototype. Archive de recherche. [Source](../../../preview/bio-struct-t3-b1/README.md) |
| `H.origine.bio-struct-t3-b2` BIO-STRUCT-T3-B2 | Variante autonome du prototype. Archive de recherche. [Source](../../../preview/bio-struct-t3-b2/README.md) |

BIO-COL conserve l’identité et le dessin des références historiques en changeant la manière de projeter leurs pigments. Ses 26 nuances sont reprises par R02. Les sous-modèles historiques de corps restent chargés par P5. Les laboratoires autonomes n’écrivent ni dans les archives atelier ni dans le canon R02. [Lecture BIO-COL](../../../bio-col-01/selection.mjs) · [Rendu BIO-COL](../../../bio-col-01/render.mjs) · [Modèle P5](../../../preview/bio-vis-p5-i6/model.mjs)

## I — Outils techniques

### I1 — Aides de comparaison et navigation

Guides, fond, cibles de liens et références Avant / après relèvent de l’interface. Aucune sortie canonique.

**Canon** —. **Archive et provenance** —. [app](../../../bio-yeux-01/app.mjs) · [index.html](../../../bio-yeux-01/index.html)

*Potentiel générateur.* Support d’inspection et validation, hors choix de phénotype.

*Arbitrages proposés.* Regrouper ou masquer en mode simplifié. Un recalibrage du cadrage change la lisibilité, pas les mesures. Supprimer un lien ou un guide fait perdre un accès ou un contrôle de recette.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `I1.workshop-archive-link` « Archive H/F » | Navigation | — | Accès à la section `#appearance-panel`. Ouvre le volet des archives. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.resident-preview` « Habitants témoins » | Navigation | — | Accès à la section `#resident-preview`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-contours` « Comparatif des yeux » | Navigation | — | Accès à la section `#planche-contours`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.makeup` « Maquillage » | Navigation | — | Accès à la section `#makeup`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-maquillage` « Planche de maquillage » | Navigation | — | Accès à la section `#planche-maquillage`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.scars` « Cicatrices » | Navigation | — | Accès à la section `#scars`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-cicatrices` « Planche de cicatrices » | Navigation | — | Accès à la section `#planche-cicatrices`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.marks` « Marques cutanées » | Navigation | — | Accès à la section `#marks`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-rousseur` « Planche de rousseur » | Navigation | — | Accès à la section `#planche-rousseur`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.beard` « Pilosité faciale » | Navigation | — | Accès à la section `#beard`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.nose` « Nez » | Navigation | — | Accès à la section `#nose`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.mouth` « Bouche et lèvres » | Navigation | — | Accès à la section `#mouth`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.brows` « Sourcils » | Navigation | — | Accès à la section `#brows`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.details` « Paupières et cils » | Navigation | — | Accès à la section `#details`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.atelier` « Atelier » | Navigation | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-corps` « Planche des corps » | Navigation | — | Accès à la section `#planche-corps`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-ossature` « Planche de l’ossature » | Navigation | — | Accès à la section `#planche-ossature`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-corpulence` « Planche de la corpulence » | Navigation | — | Accès à la section `#planche-corpulence`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-poitrine` « Planche de la poitrine » | Navigation | — | Accès à la section `#planche-poitrine`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-pectoraux` « Planche des pectoraux » | Navigation | — | Accès à la section `#planche-pectoraux`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-details-thorax` « Planche des aréoles et mamelons » | Navigation | — | Accès à la section `#planche-details-thorax`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-reliefs-osseux` « Planche des reliefs osseux » | Navigation | — | Accès à la section `#planche-reliefs-osseux`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-abdominaux` « Planche des abdominaux » | Navigation | — | Accès à la section `#planche-abdominaux`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-pli-nombril` « Planche du pli et du nombril » | Navigation | — | Accès à la section `#planche-pli-nombril`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.diagnostic-pelvien` « Diagnostic pelvien » | Navigation | — | Accès à la section `#diagnostic-pelvien`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.atelier-thorax` « Atelier du thorax » | Navigation | — | Accès à la section `#atelier-thorax`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.atelier-bassin` « Atelier du bassin » | Navigation | — | Accès à la section `#atelier-bassin`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche-anatomie-pelvienne` « Planche pelvienne H/F » | Navigation | — | Accès à la section `#planche-anatomie-pelvienne`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.iris` « Iris et pupilles » | Navigation | — | Accès à la section `#iris`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.planche` « Planche des formes » | Navigation | — | Accès à la section `#planche`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.nav.personnage` « Personnage et palette » | Navigation | — | Accès à la section `#personnage`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.background` « Fond » | Atelier du visage | Ivoire · Ivoire (`light`), Ardoise (`dark`) | Choisit le fond des surfaces de comparaison. Change la lecture des contrastes à l’écran. | Masquer en mode simple · retirer réduit la vérification |
| `I1.iris-before-mode` « Référence » | Atelier du visage | Ouverture actuelle · Ouverture actuelle (`same`), Ouverture historique (`historical`) | Référence de comparaison pour iris. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.makeup-before-mode` « Référence » | Atelier du visage | Visage actuel sans maquillage · Visage actuel sans maquillage (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour makeup. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.scars-before-mode` « Référence » | Atelier du visage | Visage actuel sans cicatrices · Visage actuel sans cicatrices (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour scars. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.marks-before-mode` « Référence » | Atelier du visage | Visage actuel sans marques · Visage actuel sans marques (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour marks. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.beard-before-mode` « Référence » | Atelier du visage | Visage actuel, imberbe · Visage actuel, imberbe (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour beard. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.nose-before-mode` « Référence » | Atelier du visage | Nez historique · Nez historique (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour nose. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.mouth-before-mode` « Référence » | Atelier du visage | Bouche historique seule · Bouche historique seule (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour mouth. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.brows-before-mode` « Référence » | Atelier du visage | Sourcils historiques seuls · Sourcils historiques seuls (`same`), Détails du visage historiques (`historical`) | Référence de comparaison pour brows. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.details-before-mode` « Référence » | Atelier du visage | Ouverture et iris actuels · Ouverture et iris actuels (`same`), Ouverture et iris historiques (`historical`) | Référence de comparaison pour details. Compare au même visage ou au rendu hérité selon l’option et l’empilement actif. | Masquer en mode simple · retirer réduit la vérification |
| `I1.eye-guides` « Afficher les enveloppes » | Atelier du visage | Décoché | Superpose ouvertures admissibles, limites et repères. Masqués au démarrage. | Masquer en mode simple · retirer réduit la vérification |
| `I1.link.makeup.atelier` « Comparer aux trois échelles » | Maquillage | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.beard.atelier` « Comparer aux trois échelles » | Pilosité faciale | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.nose.mouth` « Voir les réglages de la bouche » | Nez | — | Accès à la section `#mouth`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.mouth.atelier` « Comparer aux trois échelles » | Bouche et lèvres | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.brows.atelier` « Comparer aux trois échelles » | Sourcils | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.details.atelier` « Comparer aux trois échelles » | Paupières, cils et contours | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.iris.atelier` « Comparer aux trois échelles » | Iris et pupilles | — | Accès à la section `#atelier`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.thorax-details-link` « Aréoles et mamelons » | Atelier du thorax | — | Accès à la section `#thorax-details-panel`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.corpulence-link` « Corpulence » | Atelier du thorax | — | Accès à la section `#structure-panel`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.abdominal-link` « Abdominaux » | Atelier du thorax | — | Accès à la section `#abdominal-panel`. | Regrouper ou masquer le lien · son absence retire le raccourci |
| `I1.link.FOOTER.rapport` « Rapport de validation » | Pied de page | — | Ouvre le rapport R02 de GitHub. | Regrouper ou masquer le lien · son absence retire le raccourci |

### I2 — Archives de travail et sélections

Le JSON est copié/restauré explicitement. L’archive atelier et la sélection brute ont des fonctions différentes. La mémoire H/F est restaurée par l’archive atelier.

**Canon** `— pour ces commandes d’atelier`. **Archive et provenance** `microcosme.workshop v1 · microcosme.appearance v1–v22 · sélection brute séparée`. [workshop-archive](../../../bio-yeux-01/workshop-archive.mjs) · [appearance](../../../bio-yeux-01/appearance.mjs) · [adult-settings](../../../bio-yeux-01/adult-settings.mjs) · [app](../../../bio-yeux-01/app.mjs) · [catalogue](../../../bio-yeux-01/catalogue.mjs)

*Potentiel générateur.* Les archives sont des fixtures de compatibilité, pas un format de population.

*Arbitrages proposés.* Conserver les entrées de restauration et de diagnostic. Regrouper en distinguant le type. Masquer le JSON brut conserve son parseur. Supprimer le chemin de lecture ferait perdre des archives.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `I2.volet.appearance-panel.424` « Exporter ou importer l’archive de l’atelier » | Archive H/F | Replié | Déplie les commandes d’échange de l’archive atelier H/F. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.appearance-json` « Archive JSON » | Archive H/F | Vide au départ | Zone d’échange avec archive atelier ou anciennes apparences compatibles. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.appearance-export` « Exporter l’apparence » | Archive H/F | — | Écrit une archive de travail avec base active, mémoire H/F, latences prises en charge et profil graphique. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.appearance-import` « Importer l’apparence » | Archive H/F | — | Valide et restaure une archive atelier ou une apparence historique. Remplace la mémoire H/F. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.volet.json-panel.428` « Données de la sélection historique » | Sélection historique | Replié | Déplie l’affichage ou la restauration de la sélection brute du catalogue. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.selection-json` « Sélection JSON » | Sélection historique | Sélection par défaut 38-G, Corps de référence, options actives | Zone JSON brute pour les clés et valeurs historiques du catalogue. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.export` « Afficher les données conservées » | Sélection historique | — | Affiche le JSON brut de la sélection et ses valeurs historiques conservées. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I2.reload` « Relire ces données » | Sélection historique | — | Relit la sélection brute via le résolveur historique. | Conserver · masquer le détail sans perdre l’accès à la restauration |

### I3 — Habitants témoins et démarrage

Témoin F affiché au démarrage du panneau. Validation et rendu utilisent l’API habitant. Le bouton de relance relève du démarrage de l’atelier et reste masqué en régime normal.

**Canon** `microcosme.adult-resident v1 pour le panneau témoins`. **Archive et provenance** `— · le panneau ne manipule pas les archives atelier`. [resident-preview](../../../bio-yeux-01/resident-preview.mjs) · [resident-witnesses](../../../bio-yeux-01/resident-witnesses.mjs) · [resident](../../../bio-yeux-01/resident.mjs) · [app](../../../bio-yeux-01/app.mjs)

*Potentiel générateur.* Valider les projections d’une fiche et le maintien de son identité avant intégration.

*Arbitrages proposés.* Conserver le panneau et la relance. Masquer éventuellement la fiche détaillée derrière un volet. Supprimer l’outil n’efface pas le contrat mais retire la vérification en interface.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `I3.examiner` « Habitant » | Habitants témoins | Témoin F · Témoin F (`0`), Témoin H (`1`) | Choisit Témoin F ou Témoin H à charger. Au départ, le panneau affiche le témoin F. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I3.resident-open` « Afficher le témoin » | Habitants témoins | — | Charge la fiche du témoin sélectionné et recalcule ses trois SVG et le panneau canonique. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I3.volet.resident-preview.33` « Caractéristiques canoniques » | Habitants témoins | Replié | Déplie le JSON de la fiche affichée, avec ses champs canoniques et ses données préservées. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I3.resident-archive` « Archive de l’habitant » | Habitants témoins | Vide au départ | Champ texte pour transporter une fiche habitant JSON, vide au démarrage. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I3.resident-export` « Exporter l’habitant » | Habitants témoins | — | Écrit le document habitant affiché dans le champ JSON à copier. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I3.resident-import` « Restaurer l’habitant » | Habitants témoins | — | Valide le JSON et reconstruit les trois vues. Si l’identifiant correspond à un témoin, signale une éventuelle différence de caractéristiques. | Conserver · masquer le détail sans perdre l’accès à la restauration |
| `I3.atelier-retry` « Recharger l’atelier » | Atelier du visage | — | Recharge la page en cas d’échec du démarrage. Masqué lorsque l’atelier est prêt. | Conserver · masquer le détail sans perdre l’accès à la restauration |

### I4 — Demander un ajustement conjoint

Examine une demande hors réglage direct, calcule une proposition admissible et attend une confirmation. Un refus garde les valeurs précédentes.

**Canon** `biology.face.eyes pour le résultat accepté uniquement`. **Archive et provenance** `eyes pour le résultat accepté · proposition et annulation hors archive`. [app](../../../bio-yeux-01/app.mjs) · [eye-domain](../../../bio-yeux-01/eye-domain.mjs) · [eyes](../../../bio-yeux-01/eyes.mjs)

*Potentiel générateur.* Réutiliser le calcul et la validation du domaine si besoin, sans la boîte de confirmation.

*Arbitrages proposés.* Conserver en mode avancé ou automatiser la recherche avec des règles explicites. Masquer garde le solveur. Supprimer rend l’ajustement conjoint inaccessible en saisie manuelle.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `I4.volet.eye-request-panel.58` « Demander un ajustement conjoint » | Ajustement conjoint | Replié | Déplie le formulaire de demande conjointe des axes des yeux. | Masquer en mode simple · retirer réduit la vérification |
| `I4.eye-request-axis` « Paramètre » | Ajustement conjoint | Largeur · Largeur (`width`), Hauteur d’ouverture (`height`), Courbure supérieure (`upper`), Courbure inférieure (`lower`), Inclinaison (`tilt`), Effilement des coins (`taper`), Décalage du sommet supérieur (`upperPeak`), Décalage du sommet inférieur (`lowerPeak`) | Sélectionne l’un des huit axes à examiner conjointement avec les autres. | Masquer en mode simple · retirer réduit la vérification |
| `I4.eye-request-value` « Valeur demandée » | Ajustement conjoint | 90 affiché pour Largeur au démarrage · 75 à 120, pas 1 · bornes selon l’axe | Chiffre la demande dans le domaine nominal de l’axe sélectionné. Bornes dynamiques d’après le paramètre. | Masquer en mode simple · retirer réduit la vérification |
| `I4.examiner` « Examiner la demande » | Ajustement conjoint | — | Évalue une demande et présente le changement conjoint proposé aux axes. | Masquer en mode simple · retirer réduit la vérification |
| `I4.eye-confirm` « Appliquer l’ajustement » | Ajustement à confirmer | — | Accepte une proposition admissible et applique les axes recalculés. Indisponible hors proposition. | Masquer en mode simple · retirer réduit la vérification |
| `I4.eye-cancel` « Annuler » | Ajustement à confirmer | — | Ferme la proposition et conserve l’apparence précédente. | Masquer en mode simple · retirer réduit la vérification |

### I — Surfaces, états et automatismes de l’atelier

| ID · composant | Fonction et disponibilité | Implication d’une épuration |
| --- | --- | --- |
| `I.vue.comparison` « Avant / après » | Paires à trois échelles, ouverture historique au démarrage. L’outil sélectionne la référence en fonction des calques actifs. | Conserver en atelier ou masquer en mode habitant. Ne change aucun champ sauvegardé. Retirer perd la recette comparative. |
| `I.vue.resident-portrait` « Portrait » | Représentation par défaut de l’API, tête 300 px dans le panneau. | Conserver le contrat. Une suppression de l’affichage retire la validation visuelle. |
| `I.vue.resident-pawn` « Corps / pion » | Corps entier, silhouette et calques adultes. Trois vues recalculées à partir du même habitant. | Conserver le contrat et le même identifiant dans les trois projections. |
| `I.vue.resident-thumbnail` « Miniature » | Cadrage de tête à petite échelle, avec simplifications dépendantes du compositeur. | Conserver la projection et tester la lisibilité avant tout changement de cadrage. |
| `I.temoin.temoin-f-01` « Témoin F » | Identité persistante, base F, buste/aréoles, pousse, iris et maquillage déclaré. Témoin initial. | Conserver en recette. Garde un cas combiné. Sans usage automatique comme défaut biologique. |
| `I.temoin.temoin-h-01` « Témoin H » | Identité persistante, base H, pectoraux, pousse, barbe et cicatrice acquise. | Conserver en recette. Garde un cas indépendant du témoin F. |
| `I.auto.disponibilite` · Options effectives | Teste les différences de SVG dans les trois représentations pour arrangement, accessoires, contrastes, palette et implantation capillaire. Conserve la demande latente. | Conserver ou regrouper l’indication. Retirer le calcul fait perdre l’indication de l’absence d’effet. |
| `I.auto.reference` · Priorité de comparaison | Comparaison de maquillage, cicatrices, marques, barbe, nez, bouche, sourcils, détails et iris selon les calques visibles. | Regrouper en diagnostic sans toucher à la composition. Changer la priorité modifie ce qui est comparé. |
| `I.auto.domaine` · Appliqué et demandé | Calcule les crans admissibles ou l’ajustement conjoint selon le module. Expose la valeur latente, effective ou la raison d’une suspension. | Conserver le signal de blocage. Remplacer par un résumé garde le solveur. Retirer toute information rend les ajustements opaques. |
| `I.auto.ids-svg` · Instances SVG | IDs de découpes et masques propres à une instance. Pour une comparaison de chaînes déterministe, fournir un ID stable. | Conserver. Supprimer l’isolation peut lier un SVG à la découpe d’un autre. |
| `I.auto.restauration` · Validation avant application | Parse les schémas et versions, vérifie les domaines et reconstruit le rendu. Les erreurs sont présentées dans le panneau concerné. | Conserver et regrouper les messages. Retirer la validation compromet la restitution et les réimports. |

| ID et surface | Panneau et dépendance | Proposition |
| --- | --- | --- |
| `I.zoom.makeup-zoom` | Gros plan de maquillage et placement sur le visage | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.scars-zoom` | Gros plan du visage · Cicatrices | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.marks-zoom` | Gros plan du visage · Marques cutanées | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.beard-zoom` | Gros plan du bas du visage | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.nose-zoom` | Gros plan du nez | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.mouth-zoom` | Gros plan de la bouche | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.brows-zoom` | Gros plan des sourcils | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.details-zoom` | Gros plan des contours | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.iris-zoom` | Gros plan des yeux | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.structure-live` | Pion adulte · Thorax | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.thorax-live-detail` | Détail aréolaire actif | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.abdominal-live-detail` | Détail abdominal | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |
| `I.zoom.pubic-live-detail` | Détail pelvien | Conserver si placement direct ou diagnostic actif. Masquer la surface préserve les champs, le retrait supprime le retour visuel. |

### I.signal — Indications et diagnostics de sortie

Les 180 éléments sémantiques de sortie relevés sont associés individuellement ci-dessous. Ils annoncent une grandeur appliquée ou demandée, un état, une erreur ou une information d’identité. Aucun de ces nœuds ne constitue un champ de données. Pour chaque ligne, **regrouper ou masquer** l’indication redondante conserve les données. **Conserver** les erreurs, l’état absent/latent et les réponses de validation préserve l’intelligibilité et l’accessibilité. La conséquence d’une suppression porte sur le retour donné à l’utilisateur.

| ID de sortie | Panneau · type | Commande associée ou retour |
| --- | --- | --- |
| `I.signal.resident-preview-0.0` | `resident-preview` · output | Retour du panneau habitant · temoin-f-01 |
| `I.signal.resident-preview-1.1` | `resident-preview` · status | Retour du panneau habitant |
| `I.signal.resident-preview-2.2` | `resident-preview` · alert | Retour du panneau habitant |
| `I.signal.atelier-startup.3` | `atelier` · status | atelier startup · Chargement de l’atelier… |
| `I.signal.atelier-startup-error.4` | `atelier` · alert | atelier startup error · L’atelier n’a pas pu démarrer. Recharger l’atelier |
| `I.signal.eye-width.5` | `atelier` · output | « Largeur » |
| `I.signal.eye-height.6` | `atelier` · output | « Hauteur d’ouverture » |
| `I.signal.eye-upper.7` | `atelier` · output | « Courbure supérieure » |
| `I.signal.eye-lower.8` | `atelier` · output | « Courbure inférieure » |
| `I.signal.eye-tilt.9` | `atelier` · output | « Inclinaison » |
| `I.signal.eye-taper.10` | `atelier` · output | « Effilement des coins » |
| `I.signal.eye-upperPeak.11` | `atelier` · output | « Décalage du sommet supérieur » |
| `I.signal.eye-lowerPeak.12` | `atelier` · output | « Décalage du sommet inférieur » |
| `I.signal.eye-proposal-status.13` | `eye-proposal` · status | eye proposal status |
| `I.signal.eye-status.14` | `atelier` · status | eye status · Rendu historique actif. Déplacer un curseur démarre une forme personnalisée. |
| `I.signal.draw-error.15` | `atelier` · alert | draw error |
| `I.signal.makeup-lips-intensity.16` | `makeup` · output | « Intensité » |
| `I.signal.makeup-lips-coverage.17` | `makeup` · output | « Couverture » |
| `I.signal.makeup-lips-edge.18` | `makeup` · output | « Épaisseur du contour » |
| `I.signal.makeup-shadow-intensity.19` | `makeup` · output | « Intensité » |
| `I.signal.makeup-shadow-height.20` | `makeup` · output | « Hauteur » |
| `I.signal.makeup-shadow-extent.21` | `makeup` · output | « Étendue horizontale » |
| `I.signal.makeup-shadow-outer.22` | `makeup` · output | « Concentration externe » |
| `I.signal.makeup-liner-top.23` | `makeup` · output | « Épaisseur supérieure » |
| `I.signal.makeup-liner-bottom.24` | `makeup` · output | « Épaisseur inférieure » |
| `I.signal.makeup-liner-wing.25` | `makeup` · output | « Longueur de la pointe externe » |
| `I.signal.makeup-liner-slant.26` | `makeup` · output | « Inclinaison de la pointe » |
| `I.signal.makeup-liner-intensity.27` | `makeup` · output | « Intensité » |
| `I.signal.makeup-blush-intensity.28` | `makeup` · output | « Intensité » |
| `I.signal.makeup-blush-x.29` | `makeup` · output | « Position horizontale » |
| `I.signal.makeup-blush-y.30` | `makeup` · output | « Position verticale » |
| `I.signal.makeup-blush-extent.31` | `makeup` · output | « Étendue » |
| `I.signal.makeup-blush-diffusion.32` | `makeup` · output | « Diffusion » |
| `I.signal.makeup-paint-x.33` | `makeup` · output | « Position horizontale » |
| `I.signal.makeup-paint-y.34` | `makeup` · output | « Position verticale » |
| `I.signal.makeup-paint-size.35` | `makeup` · output | « Taille » |
| `I.signal.makeup-paint-stretch.36` | `makeup` · output | « Allongement » |
| `I.signal.makeup-paint-rotation.37` | `makeup` · output | « Orientation » |
| `I.signal.makeup-paint-weight.38` | `makeup` · output | « Épaisseur » |
| `I.signal.makeup-paint-intensity.39` | `makeup` · output | « Intensité » |
| `I.signal.makeup-message.40` | `makeup` · status | makeup message |
| `I.signal.scars-x.41` | `scars-edit` · output | « Position horizontale » |
| `I.signal.scars-y.42` | `scars-edit` · output | « Position verticale » |
| `I.signal.scars-length.43` | `scars-edit` · output | « Longueur » |
| `I.signal.scars-width.44` | `scars-edit` · output | « Largeur » |
| `I.signal.scars-angle.45` | `scars-edit` · output | « Orientation » |
| `I.signal.scars-curve.46` | `scars-edit` · output | « Courbure » |
| `I.signal.scars-irregularity.47` | `scars-edit` · output | « Irrégularité » |
| `I.signal.scars-intensity.48` | `scars-edit` · output | « Intensité chromatique » |
| `I.signal.scars-traces.49` | `scars-edit` · output | « Nombre de traces » |
| `I.signal.scars-spacing.50` | `scars-edit` · output | « Espacement des traces » |
| `I.signal.scars-maturity.51` | `scars-edit` · output | « Maturation graphique » |
| `I.signal.scars-status.52` | `scars` · status | scars status · Aucune cicatrice. |
| `I.signal.scars-error.53` | `scars` · alert | scars error |
| `I.signal.marks-x.54` | `marks-edit` · output | « Position horizontale » |
| `I.signal.marks-y.55` | `marks-edit` · output | « Position verticale » |
| `I.signal.marks-size.56` | `marks-edit` · output | « Taille » |
| `I.signal.marks-elongation.57` | `marks-edit` · output | « Allongement » |
| `I.signal.marks-irregularity.58` | `marks-edit` · output | « Irrégularité » |
| `I.signal.marks-intensity.59` | `marks-edit` · output | « Intensité chromatique » |
| `I.signal.marks-angle.60` | `marks-edit` · output | « Orientation » |
| `I.signal.marks-density.61` | `marks-edit` · output | « Densité » |
| `I.signal.marks-extent.62` | `marks-edit` · output | « Étendue » |
| `I.signal.marks-sizeVariation.63` | `marks-edit` · output | « Variation des tailles » |
| `I.signal.marks-status.64` | `marks` · status | marks status · Aucune marque cutanée. |
| `I.signal.beard-length-value.65` | `beard-parameters` · output | « Longueur de barbe » |
| `I.signal.beard-volume-value.66` | `beard-parameters` · output | « Volume de barbe » |
| `I.signal.beard-density-value.67` | `beard-parameters` · output | « Densité » |
| `I.signal.beard-chinShape-value.68` | `beard-parameters` · output | « Forme du menton » |
| `I.signal.beard-moustacheWidth-value.69` | `beard-parameters` · output | « Largeur de la moustache » |
| `I.signal.beard-moustacheThickness-value.70` | `beard-parameters` · output | « Épaisseur de la moustache » |
| `I.signal.beard-moustacheCurl-value.71` | `beard-parameters` · output | « Courbure de la moustache » |
| `I.signal.beard-sideburnLength-value.72` | `beard-parameters` · output | « Longueur des favoris » |
| `I.signal.beard-sideburnWidth-value.73` | `beard-parameters` · output | « Largeur des favoris » |
| `I.signal.beard-status.74` | `beard` · status | beard status · Rendu historique actif. |
| `I.signal.beard-error.75` | `beard` · alert | beard error |
| `I.signal.nose-length-value.76` | `nose-parameters` · output | « Longueur » |
| `I.signal.nose-bridge-value.77` | `nose-parameters` · output | « Largeur de l’arête » |
| `I.signal.nose-wings-value.78` | `nose-parameters` · output | « Largeur des ailes » |
| `I.signal.nose-tip-value.79` | `nose-parameters` · output | « Volume de la pointe » |
| `I.signal.nose-roundness-value.80` | `nose-parameters` · output | « Arrondi de la pointe » |
| `I.signal.nose-nostrils-value.81` | `nose-parameters` · output | « Taille des narines » |
| `I.signal.nose-tilt-value.82` | `nose-parameters` · output | « Inclinaison des narines » |
| `I.signal.nose-fills-value.83` | `nose-parameters` · output | « Intensité des aplats » |
| `I.signal.nose-lines-value.84` | `nose-parameters` · output | « Intensité des traits » |
| `I.signal.nose-status.85` | `nose` · status | nose status · Nez historique actif. |
| `I.signal.nose-error.86` | `nose` · alert | nose error |
| `I.signal.mouth-width-value.87` | `mouth-parameters` · output | « Largeur » |
| `I.signal.mouth-upper-value.88` | `mouth-parameters` · output | « Volume supérieur » |
| `I.signal.mouth-lower-value.89` | `mouth-parameters` · output | « Volume inférieur » |
| `I.signal.mouth-cupid-value.90` | `mouth-parameters` · output | « Arc de Cupidon » |
| `I.signal.mouth-peaks-value.91` | `mouth-parameters` · output | « Écartement des sommets » |
| `I.signal.mouth-corners-value.92` | `mouth-parameters` · output | « Hauteur des commissures » |
| `I.signal.mouth-curvature-value.93` | `mouth-parameters` · output | « Courbure de séparation » |
| `I.signal.mouth-intensity-value.94` | `mouth-parameters` · output | « Intensité chromatique » |
| `I.signal.mouth-thickness-value.95` | `mouth-parameters` · output | « Épaisseur de séparation » |
| `I.signal.mouth-status.96` | `mouth` · status | mouth status · Bouche historique active. |
| `I.signal.mouth-error.97` | `mouth` · alert | mouth error |
| `I.signal.brow-length-value.98` | `brows-parameters` · output | « Longueur » |
| `I.signal.brow-thickness-value.99` | `brows-parameters` · output | « Épaisseur » |
| `I.signal.brow-arc-value.100` | `brows-parameters` · output | « Hauteur d’arc » |
| `I.signal.brow-summit-value.101` | `brows-parameters` · output | « Position du sommet » |
| `I.signal.brow-tilt-value.102` | `brows-parameters` · output | « Inclinaison » |
| `I.signal.brow-angularity-value.103` | `brows-parameters` · output | « Angularité » |
| `I.signal.brow-height-value.104` | `brows-parameters` · output | « Hauteur sur le visage » |
| `I.signal.brow-taper-value.105` | `brows-parameters` · output | « Affinement de la pointe » |
| `I.signal.brow-spacing-value.106` | `brows-parameters` · output | « Écartement » |
| `I.signal.brows-status.107` | `brows` · status | brows status · Sourcils historiques actifs. |
| `I.signal.brows-error.108` | `brows` · alert | brows error |
| `I.signal.detail-lashes-count-value.109` | `details-parameters` · output | « Nombre de pointes » |
| `I.signal.detail-lashes-length-value.110` | `details-parameters` · output | « Longueur » |
| `I.signal.detail-lashes-spacing-value.111` | `details-parameters` · output | « Espacement » |
| `I.signal.detail-contours-upper-value.112` | `details-parameters` · output | « Contour supérieur » |
| `I.signal.detail-contours-lower-value.113` | `details-parameters` · output | « Contour inférieur » |
| `I.signal.detail-upper-count-value.114` | `details-parameters` · output | « Nombre de plis » |
| `I.signal.detail-upper-distance-value.115` | `details-parameters` · output | « Distance à l’œil » |
| `I.signal.detail-upper-length-value.116` | `details-parameters` · output | « Longueur » |
| `I.signal.detail-upper-curve-value.117` | `details-parameters` · output | « Courbure » |
| `I.signal.detail-upper-thickness-value.118` | `details-parameters` · output | « Épaisseur » |
| `I.signal.detail-upper-intensity-value.119` | `details-parameters` · output | « Intensité » |
| `I.signal.detail-lower-count-value.120` | `details-parameters` · output | « Nombre de plis » |
| `I.signal.detail-lower-distance-value.121` | `details-parameters` · output | « Distance à l’œil » |
| `I.signal.detail-lower-length-value.122` | `details-parameters` · output | « Longueur » |
| `I.signal.detail-lower-curve-value.123` | `details-parameters` · output | « Courbure » |
| `I.signal.detail-lower-thickness-value.124` | `details-parameters` · output | « Épaisseur » |
| `I.signal.detail-lower-intensity-value.125` | `details-parameters` · output | « Intensité » |
| `I.signal.detail-shadows-intensity-value.126` | `details-parameters` · output | « Intensité des cernes » |
| `I.signal.detail-shadows-width-value.127` | `details-parameters` · output | « Largeur des cernes » |
| `I.signal.detail-shadows-height-value.128` | `details-parameters` · output | « Hauteur des cernes » |
| `I.signal.detail-shadows-volume-value.129` | `details-parameters` · output | « Volume des poches » |
| `I.signal.detail-shadows-puffWidth-value.130` | `details-parameters` · output | « Largeur des poches » |
| `I.signal.details-status.131` | `details` · status | details status · Rendu des contours historiques actif. |
| `I.signal.details-error.132` | `details` · alert | details error |
| `I.signal.iris-output-irisSize.133` | `iris-parameters` · output | « Taille de l’iris » |
| `I.signal.iris-output-irisRatio.134` | `iris-parameters` · output | « Rapport largeur/hauteur » |
| `I.signal.iris-output-pupilSize.135` | `iris-parameters` · output | « Taille de la pupille » |
| `I.signal.iris-output-outline.136` | `iris-parameters` · output | « Contour de l’iris » |
| `I.signal.iris-output-secondarySize.137` | `iris-parameters` · output | « Zone secondaire » |
| `I.signal.iris-status.138` | `iris` · status | iris status · Pigments historiques actifs. |
| `I.signal.iris-error.139` | `iris` · alert | iris error |
| `I.signal.chest-volume.140` | `chest-panel` · output | « Volume » |
| `I.signal.chest-width.141` | `chest-panel` · output | « Largeur » |
| `I.signal.chest-length.142` | `chest-panel` · output | « Allongement » |
| `I.signal.chest-roundness.143` | `chest-panel` · output | « Rondeur » |
| `I.signal.chest-spacing.144` | `chest-panel` · output | « Écartement » |
| `I.signal.chest-sag.145` | `chest-panel` · output | « Affaissement » |
| `I.signal.pectoral-volume.146` | `pectoral-panel` · output | « Volume musculaire » |
| `I.signal.pectoral-width.147` | `pectoral-panel` · output | « Largeur » |
| `I.signal.pectoral-height.148` | `pectoral-panel` · output | « Hauteur » |
| `I.signal.pectoral-angularity.149` | `pectoral-panel` · output | « Angularité » |
| `I.signal.pectoral-definition.150` | `pectoral-panel` · output | « Définition » |
| `I.signal.thorax-detail-size.151` | `thorax-details-panel` · output | « Taille de l’aréole » |
| `I.signal.thorax-detail-shape.152` | `thorax-details-panel` · output | « Forme de l’aréole » |
| `I.signal.thorax-detail-pigment.153` | `thorax-details-panel` · output | « Pigmentation » |
| `I.signal.thorax-detail-horizontal.154` | `thorax-details-panel` · output | « Position horizontale » |
| `I.signal.thorax-detail-vertical.155` | `thorax-details-panel` · output | « Position verticale » |
| `I.signal.abdominal-volume.156` | `abdominal-panel` · output | « Volume musculaire » |
| `I.signal.abdominal-definition.157` | `abdominal-panel` · output | « Définition musculaire » |
| `I.signal.abdominal-width.158` | `abdominal-panel` · output | « Largeur » |
| `I.signal.abdominal-obliques.159` | `abdominal-panel` · output | « Développement des obliques » |
| `I.signal.corpulence-value.160` | `structure-panel` · output | « Corpulence » |
| `I.signal.structure-neck.161` | `structure-panel` · output | « Largeur du cou » |
| `I.signal.structure-shoulders.162` | `structure-panel` · output | « Largeur des épaules » |
| `I.signal.structure-thorax.163` | `structure-panel` · output | « Largeur du thorax » |
| `I.signal.structure-waist.164` | `structure-panel` · output | « Largeur de la taille » |
| `I.signal.structure-pelvis.165` | `structure-panel` · output | « Largeur du bassin » |
| `I.signal.structure-base.166` | `structure-panel` · output | « Largeur de la base du pion » |
| `I.signal.pubic-hair-value.167` | `personnage` · output | « État de pousse » |
| `I.signal.morph-skull_width.168` | `morph-panel` · output | « Largeur du crâne » |
| `I.signal.morph-skull_height.169` | `morph-panel` · output | « Hauteur du crâne » |
| `I.signal.morph-forehead_width.170` | `morph-panel` · output | « Largeur du front » |
| `I.signal.morph-forehead_height.171` | `morph-panel` · output | « Implantation capillaire » |
| `I.signal.morph-temple_width.172` | `morph-panel` · output | « Largeur des tempes » |
| `I.signal.morph-cheek_width.173` | `morph-panel` · output | « Largeur des joues » |
| `I.signal.morph-jowls.174` | `morph-panel` · output | « Volume des bajoues » |
| `I.signal.morph-jaw_width.175` | `morph-panel` · output | « Largeur de la mâchoire » |
| `I.signal.appearance-message.176` | `appearance-panel` · status | appearance message |
| `I.signal.appearance-error.177` | `appearance-panel` · alert | appearance error |
| `I.signal.selection-message.178` | `json-panel` · status | selection message |
| `I.signal.selection-error.179` | `json-panel` · alert | selection error |

## J — Maquillage

### J1 — Maquillage · familles et peintures

Cinq familles. Interrupteur global activé, familles éteintes au départ. Le compositeur réserve la géométrie du visage. Les paramètres inactifs restent dans une composition. Jusqu’à 36 peintures ordonnées.

**Canon** `voluntary.makeup`. **Archive et provenance** `makeup v10+ · requested/effective ou latent`. [makeup](../../../bio-yeux-01/makeup.mjs) · [makeup-editor](../../../bio-yeux-01/makeup-editor.mjs) · [makeup-render](../../../bio-yeux-01/makeup-render.mjs)

*Potentiel générateur.* La composition et sa graine peuvent servir d’entrées volontaires, après décision sur leur contexte.

*Arbitrages proposés.* Conserver la lecture et les calques. Regrouper par famille et masquer l’avancé hors atelier. Recalibrer change les compositions préexistantes. Retirer une forme ou couleur fait échouer des imports.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `J1.makeup-show` « Afficher le maquillage » | Maquillage | Coché | Masque ou restitue la composition courante et garde les demandes en mémoire. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-family` « Famille » | Maquillage | Lèvres · Lèvres (`lips`), Fard à paupières (`shadow`), Eyeliner (`liner`), Fard à joues (`blush`), Peintures faciales (`paint`) | Sélectionne le panneau et la famille à éditer, sans changer le rendu par ce seul geste. | Conserver ou regrouper · masquer conserve les valeurs · retirer le résolveur affecte les archives |
| `J1.makeup-enabled` « Afficher cette famille » | Maquillage | Décoché | Active ou met en sommeil la famille. Pour Peintures faciales, le libellé devient Afficher les peintures faciales. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-reference` « Référence » | Maquillage | Personnalisé · références dynamiques · voir J.ref | Applique une composition partielle à la famille active. Les références disponibles changent selon la famille. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-paint-kind` « Forme à ajouter » | Maquillage | Point · Point (`point`), Cercle (`circle`), Anneau (`ring`), Ligne (`line`), Bande (`stripe`), Triangle (`triangle`), Losange (`diamond`), Croissant (`crescent`), Arc (`arc`), Vague (`wave`), Zigzag (`zigzag`), Étoile (`star`) | Fixe la forme du prochain élément ajouté. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-add` « Ajouter » | Maquillage | — | Ajoute la forme demandée, active le calque Peintures faciales et sélectionne le nouvel élément. Plafond 36. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-paint-list` « Élément à modifier » | Maquillage | vide · liste dynamique | Sélectionne un élément dans la liste ordonnée de la composition. Liste vide au départ. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-down` « Reculer » | Maquillage | — | Recule l’élément sélectionné d’un rang dans l’ordre de superposition. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-up` « Avancer » | Maquillage | — | Avance l’élément sélectionné d’un rang dans l’ordre de superposition. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-remove` « Supprimer » | Maquillage | — | Supprime l’élément sélectionné tout en conservant les autres. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-paint-shape` « Forme de l’élément » | Maquillage | Point · Point (`point`), Cercle (`circle`), Anneau (`ring`), Ligne (`line`), Bande (`stripe`), Triangle (`triangle`), Losange (`diamond`), Croissant (`crescent`), Arc (`arc`), Vague (`wave`), Zigzag (`zigzag`), Étoile (`star`) | Remplace la forme du seul élément sélectionné en conservant ses réglages compatibles ou latents. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-mirror` « Reproduire en miroir » | Maquillage | Décoché à l’ajout | Projette une symétrie quand elle produit un effet et que l’élément est actif et visible. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-place` « Placer sur le visage » | Maquillage | Inactif au démarrage | Active le placement au toucher ou au clic sur le gros plan et écrit les coordonnées de peinture. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-lips-colour` « Couleur » | Lèvres | #a52f47 · nuancier G.maquillage | Pigment appliqué à la surface des lèvres. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-lips-intensity` « Intensité » | Lèvres | 66 % · 0 à 100 % | Opacité relative de l’aplat des lèvres. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-lips-coverage` « Couverture » | Lèvres | 76 % · 0 à 100 % | Part de la géométrie des lèvres couverte. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-lips-edge` « Épaisseur du contour » | Lèvres | 0 % · 0 à 100 % | Épaisseur du trait de contour. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-lips-edgeColour` « Couleur du contour » | Lèvres | #79243e · nuancier G.maquillage | Pigment du trait de contour, latent lorsque le contour est nul. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-shadow-colour` « Couleur principale » | Fard à paupières | #79549e · nuancier G.maquillage | Pigment principal au-dessus de l’ouverture. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-shadow-accent` « Couleur secondaire » | Fard à paupières | aucune · nuancier G.maquillage ou vide | Pigment facultatif du dégradé bicolore. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-shadow-intensity` « Intensité » | Fard à paupières | 57 % · 0 à 100 % | Force du fard dans la réserve de paupière. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-shadow-height` « Hauteur » | Fard à paupières | 66 % · 0 à 100 % | Extension verticale du fard. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-shadow-extent` « Étendue horizontale » | Fard à paupières | 82 % · 0 à 100 % | Extension horizontale du fard. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-shadow-outer` « Concentration externe » | Fard à paupières | 38 % · 0 à 100 % | Concentration du fard vers le coin externe. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-liner-colour` « Couleur » | Eyeliner | #151519 · nuancier G.maquillage | Pigment du trait suivant les bords de l’œil. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-liner-top` « Épaisseur supérieure » | Eyeliner | 43 % · 0 à 100 % | Épaisseur sur le bord supérieur. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-liner-bottom` « Épaisseur inférieure » | Eyeliner | 0 % · 0 à 100 % | Épaisseur sur le bord inférieur. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-liner-wing` « Longueur de la pointe externe » | Eyeliner | 37 % · 0 à 100 % | Longueur de la pointe vers l’extérieur. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-liner-slant` « Inclinaison de la pointe » | Eyeliner | 0 ° · -45 à 45 ° | Angle de la pointe, conditionné par son tracé actif. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-liner-intensity` « Intensité » | Eyeliner | 89 % · 0 à 100 % | Force du pigment sur les bords. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-blush-colour` « Couleur » | Fard à joues | #d78399 · nuancier G.maquillage | Pigment de la joue. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-blush-intensity` « Intensité » | Fard à joues | 65 % · 0 à 100 % | Force du fard. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-blush-x` « Position horizontale » | Fard à joues | 50 % · 0 à 100 % | Décalage horizontal des deux zones de joue. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-blush-y` « Position verticale » | Fard à joues | 35 % · 0 à 100 % | Décalage vertical des deux zones de joue. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-blush-extent` « Étendue » | Fard à joues | 62 % · 0 à 100 % | Emprise des zones de fard. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-blush-diffusion` « Diffusion » | Fard à joues | 72 % · 0 à 100 % | Progressivité du contour du fard. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-x` « Position horizontale » | Peintures faciales | 24 pour le premier, puis 24 + 13 × (indice modulo 5) % · 0 à 100 % | Coordonnée horizontale de l’élément dans le repère facial. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-y` « Position verticale » | Peintures faciales | 62 % · 0 à 100 % | Coordonnée verticale de l’élément dans le repère facial. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-size` « Taille » | Peintures faciales | 35 % · 0 à 100 % | Échelle de la forme. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-stretch` « Allongement » | Peintures faciales | 30 % · 0 à 100 % | Étirement de certaines formes, latent pour celles sans effet. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-rotation` « Orientation » | Peintures faciales | 0 ° · -180 à 179 ° | Rotation de l’élément, latente si la forme est indifférente. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-weight` « Épaisseur » | Peintures faciales | 38 % · 0 à 100 % | Épaisseur du tracé, utile aux formes qui possèdent un contour réglable. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-paint-colour` « Couleur » | Peintures faciales | #397e62 · nuancier G.maquillage | Pigment de l’élément. | Conserver ou regrouper · masquer garde les données · retirer la commande enlève ce geste |
| `J1.makeup-paint-intensity` « Intensité » | Peintures faciales | 84 % · 0 à 100 % | Opacité relative de l’élément. | Conserver ou masquer en avancé · recalibrer change la projection des valeurs sauvegardées · supprimer perd la demande |
| `J1.makeup-reset` « Réinitialiser la famille » | Maquillage | — | Remplace la famille sélectionnée par sa référence normalisée. Pour les peintures faciales, vide la liste. | Conserver une remise à zéro explicite · retirer rend le retour manuel |
| `J1.makeup-remove-all` « Retirer tout le maquillage » | Maquillage | — | Masque le maquillage en conservant la composition. Réafficher restitue les valeurs. | Conserver une remise à zéro explicite · retirer rend le retour manuel |

### J2 — Maquillage · Compositions

Les compositions nommées sont locales à ce navigateur. Le JSON permet de les transférer. Le tirage est reproductible, les valeurs obtenues sont conservées dans la composition.

**Canon** `voluntary.makeup pour la composition appliquée · nom et liste hors canon`. **Archive et provenance** `microcosme.makeup v1 et stockage local · application dans makeup v10+`. [makeup-editor](../../../bio-yeux-01/makeup-editor.mjs) · [makeup](../../../bio-yeux-01/makeup.mjs) · [makeup-render](../../../bio-yeux-01/makeup-render.mjs)

*Potentiel générateur.* Se servir de compositions témoins ou fournies, sans faire du stockage local un référentiel de population.

*Arbitrages proposés.* Regrouper la bibliothèque et les échanges de composition. Masquer sans toucher au stockage. Supprimer l’import perd la possibilité de relire des compositions nommées transférées.

| ID et libellé | Emplacement | Défaut et domaine | Usage, effet et condition | Action possible et conséquence |
| --- | --- | --- | --- | --- |
| `J2.volet.makeup-library.116` « Compositions » | Compositions | Replié | Déplie enregistrement local, tirage et échange JSON des compositions. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-name` « Nom » | Compositions | vide · 80 caractères | Saisit le nom local utilisé pour enregistrer ou remplacer une composition. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-save` « Enregistrer ou remplacer » | Compositions | — | Enregistre ou remplace la composition courante sous son nom dans le stockage de ce navigateur. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-saved` « Compositions enregistrées » | Compositions | Choisir une composition · liste dynamique | Liste les compositions de ce navigateur. L’option vide représente l’absence de sélection. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-apply` « Réappliquer » | Compositions | — | Remplace la composition courante par la composition locale sélectionnée. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-seed` « Graine » | Compositions | Microcosme · 128 caractères | Saisit la graine du tirage d’une composition. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `J2.makeup-draw` « Tirer une composition » | Compositions | — | Remplace la composition courante par une proposition reproductible et la rend visible. | Regrouper avec le tirage · retirer la commande fait perdre le rejeu manuel |
| `J2.makeup-json` « Composition JSON » | Compositions | Vide au départ | Zone JSON éditable de transport indépendant d’une composition. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-export` « Exporter la composition » | Compositions | — | Écrit le JSON de la composition courante dans le champ dédié. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |
| `J2.makeup-import` « Importer et appliquer » | Compositions | — | Valide la composition du champ JSON et l’applique à l’atelier. | Regrouper · masquer conserve les compositions · supprimer réduit leur échange ou leur sélection |

### J.ref — Références de composition et formes

« Personnalisé » signale la saisie libre. Le sélecteur « Référence » existe pour le fard à paupières, l’eyeliner et le fard à joues. Les valeurs omises restent celles de la composition active.

| ID et libellé | Famille · demandes fixées | Proposition et conséquence |
| --- | --- | --- |
| `J.ref.shadow.0` « Discret » | « Fard à paupières » · intensity=35, height=41, extent=74, outer=21, accent=aucune | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.shadow.1` « Étendu » | « Fard à paupières » · intensity=63, height=89, extent=98, outer=14, accent=aucune | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.shadow.2` « Externe » | « Fard à paupières » · intensity=67, height=72, extent=51, outer=93, accent=aucune | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.shadow.3` « Bicolore » | « Fard à paupières » · intensity=77, height=79, extent=93, outer=56, accent=#ac65b2 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.liner.0` « Fin » | « Eyeliner » · top=23, bottom=0, wing=0, slant=0 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.liner.1` « Épais » | « Eyeliner » · top=80, bottom=0, wing=15, slant=8 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.liner.2` « Allongé » | « Eyeliner » · top=48, bottom=0, wing=92, slant=18 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.liner.3` « Complet » | « Eyeliner » · top=67, bottom=55, wing=40, slant=11 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.blush.0` « Discret » | « Fard à joues » · intensity=37, x=49, y=36, extent=48, diffusion=82 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.blush.1` « Marqué » | « Fard à joues » · intensity=84, x=49, y=49, extent=73, diffusion=65 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |
| `J.ref.blush.2` « Pommettes hautes » | « Fard à joues » · intensity=66, x=67, y=8, extent=58, diffusion=73 | Archiver le raccourci ou conserver comme composition · supprimer le raccourci laisse l’édition des valeurs |

| ID et libellé | Forme dans le rendu · réglages latents | Proposition |
| --- | --- | --- |
| `J.forme.point` « Point » | Premier choix de « Forme à ajouter » · sans allongement ni orientation · épaisseur sans effet | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.circle` « Cercle » | orientation inactive sans allongement · épaisseur sans effet | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.ring` « Anneau » | orientation inactive sans allongement · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.line` « Ligne » | orientation et allongement réglables · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.stripe` « Bande » | orientation et allongement réglables · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.triangle` « Triangle » | orientation et allongement réglables · épaisseur sans effet | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.diamond` « Losange » | orientation et allongement réglables · épaisseur sans effet | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.crescent` « Croissant » | orientation et allongement réglables · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.arc` « Arc » | orientation et allongement réglables · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.wave` « Vague » | orientation et allongement réglables · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.zigzag` « Zigzag » | orientation et allongement réglables · épaisseur réglable | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |
| `J.forme.star` « Étoile » | orientation et allongement réglables · épaisseur sans effet | Conserver la clé · masquer garde les imports · supprimer invalide des compositions |

Le stockage local utilise `microcosme.bio-maquillage-01.compositions`. La commande « Retirer tout le maquillage » masque la composition courante en gardant ses valeurs. « Réinitialiser la famille » efface les réglages de la seule famille sélectionnée, y compris la liste des peintures pour cette famille. [Commandes du maquillage](../../../bio-yeux-01/makeup-editor.mjs)
