# BIO-GEN-T1 / Lot B — prototype expérimental

Branche : `codex/bio-gen-t1-lot-b`, base `7564d33` (main). Aucune fusion des PR #10/#12. Transmission consultée sur `docs/bio-gen-t1-transmission` ; aucune disposition non ratifiée présentée comme canonique. Les trois documents de transmission restent sur leur branche, sans copie altérée.

## Fichiers et architecture

- `experiments/bio-gen-t1/model.js` : B1, 18 paramètres graphiques bornés, validation stricte, PRNG entier stable à partir d'une graine texte, description JSON v1, dérivation des géométries et palettes. Aucun état biologique canonique.
- `experiments/bio-gen-t1/render.js` : B2, composition procédurale Canvas 2D ; portrait 96×96, corps 48×64 avant/arrière et profil droit schématique. Raster entier, agrandissement sans lissage. Même description pour toutes les vues ; aucun tirage propre à une vue. Géométries recalculées, aucun catalogue de personnages prédessinés.
- `experiments/bio-gen-t1/index.html`, `lab.css`, `lab.js` : B3, galerie, sélection, curseurs, graine individuelle, rejeu exact avec paramètres, génération depuis graine, export/import JSON validé. Toucher et clavier ; aucune sauvegarde ou requête distante applicative.
- `gallery.json` : 20 descriptions reproductibles, identiques à la galerie initiale `microcosme-b-001`…`020`.
- `tests/bio-gen-t1/model.test.cjs`, `browser.cjs` : tests dédiés, sans modifier les suites historiques.
- `.github/workflows/bio-gen-t1.yml` : CI isolée Node + Chromium/WebKit.
- Ce rapport, `PARAMETRES.md` (inventaire complet), `MESURES.jsonl` (résultats bruts) et `PUBLICATION.md`.

Le laboratoire s'ouvre directement par `experiments/bio-gen-t1/index.html` après téléchargement de son dossier ; aucun serveur ni compilation requis. Les fonctions pures B1/B2 peuvent être importées en CommonJS pour les tests. Ressources : code local original, formes primitives, palette définie dans le modèle, polices système. Les conventions de petites silhouettes orthographiques V4 sont reprises sans dépendance au moteur V3/V4.

## Expériences réalisées le 15 novembre 2026

| ID | Vérification exécutée | Résultat et réserve |
|---|---|---|
| B-01 | 20 profils de fixture distincts, galerie sélectionnable | Automatisé réussi ; diversité et reconnaissance à noter humainement |
| B-02 | Dérivation et pixels identiques après reconstruction, quatre vues | Réussi dans Chromium ; déterminisme entre versions de navigateurs non garanti pixel par pixel |
| B-03 | Modification taille, hauteur totale et sommes des segments | Réussi ; portrait cadré sur le visage, indépendant de la taille corporelle |
| B-04 | Ratio jambes modifie tronc/bras/jambes à hauteur constante, crâne stable | Réussi ; silhouette artistique à évaluer |
| B-05 | Paramètres faciaux : comparaison pixels min/max, changement mâchoire par interface | Réussi ; aucune preuve automatique de reconnaissance identitaire |
| B-06 | Palettes partagées et variation pixel peau/iris/cheveux | Réussi ; cohérence perceptive à confirmer |
| B-07 | Pilosité change les pixels sans changer la géométrie anatomique | Réussi ; texture parfois visible uniquement au portrait |
| B-08 | Longueurs des bras dérivées du tronc, jambes et attaches géométriques bornées | Réussi sur 2000 graines ; attaches visuelles et extrêmes à inspecter humainement |
| B-09 | JSON aller-retour, pixels identiques, import interface, rejet JSON invalide sans perte | Réussi Chromium et Node |
| B-10 | 100 profils, cinq séries de rendu, galerie DOM et deux RAF | Mesuré sur VM Linux ; aucune conclusion iPad |

Commandes : `node --test tests/bio-gen-t1/model.test.cjs` : **5/5** ; `npm test` : **35/35** historiques. `node tests/bio-gen-t1/browser.cjs` : parcours Chromium réussi, puis échec de lancement WebKit 26.5 faute de bibliothèques Linux (GTK4, Graphene, Harfbuzz ICU, Manette, Hyphen, GLES). Le script complet retourne donc un échec local, pas un succès multi-navigateurs. CI configurée pour installer ces dépendances ; ses résultats sont à consulter dans la PR. Pas de validation Safari iPad physique.

Chromium 151.0.7922.34 headless, Playwright 1.62.1, Linux x86_64, VM 3 vCPU AMD EPYC 9V74, Node 24.22.1. Viewport 820×1180, DPR 2, toucher simulé ; absence de débordement horizontal aussi vérifiée à 390 et 1180 px. Test initial en `file://`. Génération de 100 profils : **0,8 ms**. Rendu de 100 sprites sans DOM, cinq passes : **18,8–22,2 ms**, médiane **20,8 ms**. Galerie complète : **23,9 ms** génération/Canvas/DOM, **53,8 ms** jusqu'à deux RAF. Mesures ponctuelles sans garantie de présentation physique ni débit continu. Mémoire native/GPU, batterie et latence tactile non mesurées.

## Limites et incohérences observées

- Anatomie simplifiée et poses debout fixes : bras rectilignes, mains en blocs, pieds stylisés. Pas d'animation, de vêtements paramétriques ou d'expressions.
- Profil droit approximatif : tête raccourcie, œil unique et nez projeté ; ce n'est pas une reconstruction volumétrique. Le qualifier de vue expérimentale, pas de profil anatomiquement validé.
- Le portrait montre un visage élargi, des paupières, iris, nez, bouche, oreilles et mèches, mais reste schématique. Volume central absent du cadrage portrait ; petites différences perdues à l'échelle sprite. La texture était initialement invisible dans le test de pixels : correction appliquée au portrait.
- Quantification : plusieurs valeurs proches produisent les mêmes pixels. Plusieurs individus peuvent sembler similaires malgré des JSON distincts. Même tenue et palette de vêtement pour ne pas masquer les différences corporelles.
- Palettes interpolées, paramètres indépendants : pas de population humaine réaliste revendiquée, pas de corrélations biologiques validées, familles ou hérédité. La graine fixe uniquement le profil initial et des marques graphiques.
- Gauche/droite symétriques hors asymétrie graphique bornée ; aucune fonction biologique déduite. Ni anatomie intime, ni génétique, croissance, physiologie ou psychologie simulée.
- Aucune référence de portrait approuvée dans la transmission ; le style ici est une proposition procédurale à auditer, pas une direction artistique validée.

## Audit humain et protocole iPad — ouvert

Sur Safari iPad physique, ouvrir le lien HTTPS de PUBLICATION.md. Noter appareil, iPadOS/Safari, orientation, date et température/conditions. Générer les 20 profils, en sélectionner cinq au toucher, modifier chaque famille de paramètres, exporter dans Fichiers puis réimporter et comparer. Tester les extrêmes et vérifier que pieds, mains et têtes ne sont pas coupés. Refaire trois générations de 100 et noter les temps affichés, la réactivité et toute erreur.

Évaluer séparément (pas encore exécuté) : diversité des silhouettes à taille égale ; distinction d'au moins cinq visages sans lire la graine ; association à l'aveugle de portraits et sprites ; cohérence avant/arrière/profil ; lisibilité à petite taille et aux bornes. Consigner des exemples d'échec et les graines/JSON concernés. Aucun de ces points artistiques n'est déclaré réussi par les tests de pixels.

Attendre audit utilisateur et arbitrage sur qualité des portraits/profil, budget des paramètres et validation iPad avant toute intégration. **Ne pas fusionner ; aucun passage automatique au lot C.**
