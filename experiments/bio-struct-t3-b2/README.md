# BIO-STRUCT-T3-B2 — laboratoire indépendant

[Preview HTTPS](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b2/) · [Contrat et rapport](../../docs/bio-struct-t3-b2/implementation/RAPPORT.md)

Ouvrir index.html sans compilation. Galerie M/F/T immédiate, sélection tactile, cinq longueurs, quatre textures, six coupes réparties en trois familles, couleurs indépendantes. M/F : famille de présentation correspondante ; T : catalogue complet. M/T : moustache, barbe et rouflaquettes indépendantes en présence, taille et couleur. F : aucun contrôle ni dessin facial, y compris après import. Trois projections et portraits, corps R3 et visage B1 conservés, JSON v5 déterministe et migrations v1…v4 explicites. Les anciens profils restent chauves.

`grooming-settings.js` normalise les demandes et les corrections N2 ; `grooming-model.js` décrit les surfaces, mèches et racines dans le repère canonique du crâne ; `grooming-projection.js` produit les trois projections et leurs stries. Le rendu protège les pixels B1 des yeux, sourcils, lèvres et cils. Les plans de cheveux sont ordonnés en profondeur, les pilosités faciales sont réservées face/profil. Une moustache trop grande pour l'espace bouche/yeux est réduite avec rapport N1. Aucun nez ou nouvel ancrage nasal.

Les proportions numériques, six dessins de coupe et textures sont des propositions à valider artistiquement sur iPad. Aucun mécanisme de croissance, génétique ou vieillissement ajouté. Aucune intégration au jeu, aucune fusion. B1 et R3 demeurent sur leurs branches et previews indépendantes.

Tests : `node --test tests/bio-struct-t3-b2/contract.test.cjs` ; `node tests/bio-struct-t3-b2/browser.cjs` (Chromium/WebKit installés) ; `node tests/bio-struct-t3-b2/capture.cjs`.
