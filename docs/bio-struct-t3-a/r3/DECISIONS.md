# BIO-STRUCT-T3-A-R3 — décisions de mise en œuvre

Autorité : `docs/bio-struct-t3-a-r3`, **`cf2e89f7e509713b3308ae9e72e7a7db9e2c3faa`**. Les deux documents R3 ont été lus intégralement, ainsi que CONTRAT.md et les corrections validées R1/R2. Les croquis utilisateur antérieurs restent l’autorité qualitative ; aucune illustration d’assistant ajoutée comme référence. Les nombres ci-dessous sont proposés pour essai, pas déclarés artistiquement validés.

Base R2 : PR #18, branche `codex/bio-struct-t3-a-r2`, **`bf9f6d002bed891344dd2f954a33c4126baa84e1`** ; application publiée `0f08780`. PR #15/#16/#17/#18 et autres branches ouvertes inspectées ; aucune fusion. Main avant publication R3 : `cb34f86c952165d86bf6128e68d7c1c12cb0812e`. Aucun AGENTS.md applicable trouvé. La présente programmation/publication est autorisée explicitement par la mission utilisateur R3 ; aucun élargissement à B1/B2.

## Paramètres indépendants

- Taille mammaire F/T : ancien paramètre P1 `breastVolume` 0…1, conservé ; forme indépendante : référence R2, arrondie, goutte stylisée. Ces trois formes sont un petit catalogue technique révisable. M n’a ni curseur ni sélecteur mammaire ; les éventuels anciens nombres mammaires M sont conservés dans le JSON historique, sans produire de poitrine féminine R3. Pectoraux et graisse sont ses contrôles de relief.
- Pectoraux : définition continue 0…1 ; superellipsoïde d’exposant 2…8, d’un volume rond et souple à une forme plus rectangulaire. Une légère descente dépend conjointement de la graisse et de la souplesse. Les attaches restent sur le thorax. Le réglage reste disponible sous la poitrine F/T.
- Abdomen : définition 0…1 et graisse 0…1 séparées. Une surface abdominale souple varie en profondeur avec les deux ; six reliefs progressifs apparaissent avec la définition. Ce sont des volumes canoniques avec profondeur, pas six rectangles de vue. Les ombres augmentent avec la définition. Les raccords et la silhouette générale restent ceux de R2 hors ce relief autorisé.
- Graisse : reste indépendante du volume musculaire P1 et des définitions locales ; même les abdominaux définis conservent un effet du réglage de graisse. Aucune catégorie n’impose une définition musculaire.
- Ombres brunes : intensité 0…1, défaut 0.40 ; mélange vers `#4c3027`, avec un renforcement mesuré sur peaux sombres. Coefficient maximal 0.22 sur peaux claires, 0.352 sur peaux sombres ; différence testée au plus 42 par canal. Bandes inférieures localisées, projetées depuis chaque volume puis limitées à son masque raster. Pas de nouveau contour noir systématique. Le contour mammaire discret R2 reste sur sa forme de référence ; les autres formes utilisent leur propre relief limité au masque.

Valeurs initiales communes R3 : définition pectorale 0.50, abdominale 0.25, graisse 0.15, ombres 0.40. Elles s’ajoutent aux références P2 conservées. Les dimensions initiales du squelette, les articulations, le visage et le signe génital R2 ne changent pas.

## Pilosité, pubis et nombril

La présence et la densité du torse et du ventre ont deux curseurs indépendants ; elles sont nulles par défaut, notamment pour F. **Interprétation de R3-D5 avec R3-08** : « pas de pilosité de torse/ventre imposée » pour F signifie zéro par défaut, sans interdiction d’un choix volontaire ; les contrôles restent disponibles. C’est un point d’ergonomie à confirmer visuellement, sans nouvelle règle biologique. M : pubis absent ou rectangulaire ; F/T : absent, triangle, carré, rectangle. T conserve toutes les combinaisons quelle que soit sa fonction.

Les poils sont de petits points déterministes (graine + indices), de couleur corporelle indépendante réglable. Leurs positions sont locales aux pectoraux, à la surface abdominale ou au bassin. Les points antérieurs sont cachés lorsque la surface est vue de dos ou tangente en profil ; pas de transpercement. Le pubis reste entièrement au-dessus de la base maximale du signe masculin R2, avec une marge de 0.4 unité neutre ; la région est identique pour les deux fonctions de T. Ni barbe, moustache, rouflaquettes ni cheveux.

Le nombril est un seul point de diamètre 0.60 unité neutre, attaché à la surface abdominale à la hauteur du repère R2. Il se dessine après les poils pour rester lisible, de face seulement. Aucun tiret.

## Compatibilité et bassin

Seule l’option ovale est retirée du sélecteur de bassin. Le volume pelvien, ses autres formes et la géométrie historique ovale restent dans le code de compatibilité. L’import utilisateur v1/v2 vers v3 applique un fallback **ovale → rectangle**, déterministe et annoncé, en conservant l’ancienne valeur dans la trace de migration. Pas de suppression des anciens fichiers ou previews.

L’API historique `generateBody` et la lecture v1/v2 restent inchangées pour restituer le canon R2 et exécuter les 39 tests historiques sans les réécrire. La nouvelle API explicite `generateBodyR3` construit le canon v3 ; l’interface utilise exclusivement cette API et `upgradeBody` à l’import. Les tests R3 et son parcours navigateur vérifient spécifiquement ce nouveau canon. Les parcours R1/R2 n’adaptent que les attentes d’import UI à la migration v3 désormais annoncée ; leurs autres contrôles sont conservés.

Hors périmètre : tout changement des sept têtes ou du visage, T3-B1/B2, pilosité faciale, jeu principal, sauvegardes historiques et fusion de PR. La réception artistique et Safari iPad physique restent à l’utilisateur.
