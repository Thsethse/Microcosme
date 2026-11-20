# MICROCOSME — BIO-COL-01 — Contrat de préparation des palettes capillaires

**Statut : contrat documentaire prêt à soumettre à Codex ; aucune programmation, publication, fusion ou intégration au jeu autorisée par la seule création de ce document.**

Dépôt : https://github.com/Thsethse/Microcosme

## 1. Décisions utilisateur validées (20 novembre 2026)

- Intégrer **dès la première version** les familles de couleurs **naturelles et fantaisie**.
- Employer un **aplat de couleur uniforme** par coiffure, avec un **contour dans une teinte plus sombre** calculée de manière cohérente à partir de l'aplat.
- **Aucun ombrage ni effet de lumière complexe obligatoire**. Ne pas ajouter de dégradés, reflets, textures ou volumes lumineux pour simuler un résultat supérieur sans validation artistique spécifique.
- Les couleurs sont **indépendantes des géométries de coiffure** : aucune duplication des 126 choix pour chaque couleur.
- La coloration doit respecter les formes et détails existants, les choix historiques et la lisibilité en miniature.
- Le chantier doit être **court et borné**, après quoi les cheveux seront mis en pause. Les lots graphiques 4 et 5 restent suspendus.

Les exemples de couleurs évoqués en conversation étaient illustratifs : **les valeurs hexadécimales précises et le nombre exact de nuances ne sont pas encore validés**. Les palettes ci-dessous sont une proposition de départ à présenter à l'utilisateur, non des décisions irrévocables.

## 2. Base technique et périmètre

Consulter les instructions du dépôt, AGENTS.md s'il existe, l'état réel de main, des PR et des branches, puis les documents suivants :

- `docs/ai/bio-vis-dedup-01/CONTRAT_LOT_3.md`
- `docs/ai/bio-vis-dedup-lot-3/README.md` sur `codex/bio-vis-dedup-lot-3`
- `bio-vis-dedup-lot-3/README.md` sur cette même branche
- Les composants P5-I6 et les lots 1/2 réellement importés par le lot 3.

La PR #44 du lot 3 est une **base de prototype indépendante**, combinant les rendus publiés des lots 1 et 2 sans fusion de leurs PR. Ne pas présumer que #42, #43 ou #44 sont fusionnées. Utiliser la base effective après lot 3 et tracer ses commits/empreintes, sans modifier les artefacts précédents.

État documenté dans le rapport lot 3 : **72 références, 126 choix historiques, 120 entrées dans le catalogue ordinaire** et six regroupements du lot 2. Vérifier les chiffres sur la base effective et préserver les identifiants secondaires, notamment 61-G et ses deux mèches.

**Périmètre :** une couche de coloration capillaire dans le générateur/prototype isolé, avec palette sélectionnable, rendu à l'écran et inspection des résultats. Pas de modification de la biologie, des gènes, de l'hérédité, de la vieillesse, du moteur du jeu, des sauvegardes ni de l'interface principale de Microcosme. Pas de changement de silhouette, de forme des mèches, d'implantation ou d'accessoires.

## 3. Palettes proposées à la revue artistique

Les familles ci-dessous servent de catégories de navigation et de couverture des tests, **pas de liste exhaustive ni de codes couleur définitifs**.

- **Naturelles :** noirs, bruns/châtains, blonds, roux, gris et blancs, avec variations de profondeur/nuance.
- **Fantaisie :** rouges vifs, roses, violets, bleus, turquoises et verts, avec variations claires et foncées.

Présenter un jeu **fini et raisonnable** de nuances nommé et accompagné des valeurs hexadécimales dans la preview ; ne pas multiplier les teintes au seul motif que le code le permet. Les couleurs fantaisie sont des choix graphiques ; **aucune mécanique de teinture, de naissance avec cheveux fantaisie ou de transmission biologique** n'est décidée ici. Ces usages restent ouverts.

Une seule couleur principale est sélectionnée à la fois pour la coiffure entière dans cette première version. **Mèches multicolores, racines dégradées et coloration par zone ne sont pas requises.** Ne pas les implémenter sans nouvel accord.

## 4. Règle de rendu

Pour chaque teinte, appliquer :

1. **Aplat principal uniforme** sur les surfaces de cheveux concernées.
2. **Contour de la même famille chromatique, visiblement plus sombre** que l'aplat, sans contour noir systématique.
3. Conserver les séparations et tracés internes nécessaires à la lecture des mèches en les reliant à la teinte de contour, lorsque leur rôle est réellement capillaire.
4. Ne pas recolorer le visage, le corps, les yeux, les vêtements, les bijoux, les liens, les bandeaux, les objets ou les autres calques non capillaires.
5. Conserver le comportement historique des couches de contraste et des arrangements secondaires ; vérifier spécifiquement 50-G et 62-D.

**Robustesse :** un simple multiplicateur RGB fixe (par exemple 0,57) n'est pas imposé. Codex doit choisir une méthode déterministe et simple qui donne un contour lisible et cohérent pour le noir très sombre, le blond clair, le blanc, les couleurs saturées et les couleurs peu saturées. Prévoir un garde-fou pour que le contour reste discernable sans devenir une couleur étrangère à la palette. Documenter le calcul et ses limites ; aucune physique d'éclairage.

**Compatibilité :** les appels sans couleur explicitement choisie doivent préserver le rendu historique, ou adopter une valeur par défaut clairement documentée sans casser les appels existants. Ne pas modifier silencieusement le sens des paramètres existants ni les données d'anciens choix. Si les surfaces capillaires et les accessoires ne sont pas isolables proprement, arrêter et documenter le blocage plutôt que recolorer des SVG entiers.

## 5. Prévisualisation demandée lors d'une future autorisation de code

Créer une branche dédiée, une **PR brouillon**, et une preview Pages indépendante, par exemple :

`https://thsethse.github.io/Microcosme/preview/bio-col-01/`

Cette URL est **une cible de publication, pas une adresse déjà disponible**.

La preview devra montrer :

- Les familles naturelles et fantaisie avec pastilles de couleur, noms et teintes exactes ; sélection tactile sur iPad.
- Une même coiffure avec plusieurs teintes et une même teinte sur plusieurs coiffures (courtes, longues, bouclées, tressées, chignons, mèches frontales).
- Une comparaison **rendu historique / aplat + contour** pour la même coiffure, avec le même visage, la même morphologie et les mêmes accessoires.
- Les trois tailles utilisées par les lots précédents : **300 px, 178 px et 70×70 px**, vues tête et entier si pertinentes.
- Les cas limites : noir profond, brun sombre, blond pâle, blanc/gris clair, rouge saturé, bleu foncé, rose clair, vert/turquoise ; arrière-plans clair et sombre pour tester la lisibilité.
- Les six corps, les huit paramètres morphologiques et les extrêmes disponibles dans la base, sans nouveaux réglages biologiques.
- Un contrôle explicite « aplat + contour », sans exiger de variante ombrée.
- L'accès aux **120 entrées ordinaires** et aux **126 choix historiques** si les comptes sont confirmés, y compris les six alias du lot 2.

La preview doit être **publiée et vérifiée sur son URL réelle**. Ne pas remplacer les previews des lots 1, 2 ou 3.

## 6. Vérifications minimales

- Contrôles déterministes de la génération de la teinte de contour pour toutes les palettes, y compris les extrêmes et des valeurs répétées.
- Lisibilité des contours et détails capillaires en miniature ; tests de contraste adaptés aux traits fins (ne pas prétendre qu'un seuil WCAG de texte prouve la qualité d'une coiffure).
- Aucun changement géométrique des chemins/ancres du modèle, du visage ou du corps ; aucune recoloration hors cheveux.
- Les **126 choix historiques**, les **six regroupements**, les rendus graphiques des lots 1 et 3 et les IDs secondaires restent disponibles.
- Tests des couches de contraste, accessoires activés/désactivés, couleurs neutres et fantaisie.
- Tests Node, Chromium et WebKit, formats iPad portrait/paysage et écran étroit ; contrôle tactile et absence de débordement.
- Comparaison de la géométrie des cheveux avant/après (une différence de couleur est attendue, pas une différence de silhouette).
- Non-régression des suites des lots 1–3 et du dépôt, journal des résultats, captures, CI et empreintes.
- **Validation artistique finale sur Safari iPad physique par l'utilisateur** ; les tests WebKit ne s'y substituent pas.

## 7. Critères d'acceptation

Le prototype est recevable si les couleurs naturelles et fantaisie sont immédiatement utilisables, si les cheveux restent lisibles en aplat avec contour sombre dans toutes les teintes, si les accessoires et la géométrie sont intacts, si les identifiants historiques sont préservés et si la preview indépendante fonctionne sur iPad.

**Priorité absolue : cohérence, sobriété et fiabilité.** Ne pas ajouter d'ombres/lumières pour « améliorer » le rendu. Si l'aplat + contour ne fonctionne pas pour une teinte, corriger la palette ou le calcul du contour, pas la géométrie des cheveux.

## 8. Limites d'autorisation

La demande « préparer le contrat pour Codex » autorise uniquement **la rédaction et le dépôt documentaire de ce contrat**. Une autorisation distincte sera nécessaire pour programmer BIO-COL-01, créer une PR de code, publier la preview et lancer les tests. **Aucune fusion GitHub, aucun lot 4 ou 5 et aucune intégration dans le jeu principal.**

À l'issue d'une future réalisation validée, placer le chantier capillaire en pause.
