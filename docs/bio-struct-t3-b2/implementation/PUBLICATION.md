# Preview B2 — publiée et vérifiée

**https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b2/**

[PR #21 ouverte, brouillon non fusionné](https://github.com/Thsethse/Microcosme/pull/21), branche `codex/bio-struct-t3-b2`, base B1 `6d5fcfdcbc0645515462c4bcb5dadeb447c6718b`. B1 #20 et R3 #19 restent ouverts et non fusionnés.

Source applicative testée et publiée : **`5c82fdbf494ce22bf4ee985e1b2dbcf048074fd3`**. Snapshot main : **`155914993b675b61d33cb2b2cbfbf100e0d87f66`**, ajoutant exclusivement `preview/bio-struct-t3-b2/` (20 fichiers applicatifs identiques et un README spécifique). Les ajouts documentaires ultérieurs ne changent aucun de ces fichiers applicatifs. Configuration Pages main/racine et previews antérieures conservées ; aucune fusion de PR.

## Résultats automatisés

[CI dédiée réussie](https://github.com/Thsethse/Microcosme/actions/runs/43910300039) sur la source publiée : **112 tests Node réussis, zéro échec, trois contrôles humains explicitement ignorés**.

| Suite | Réussis | Contrôles humains en attente |
|---|---:|---:|
| T3-A | 23 | 0 |
| R1 | 8 | 0 |
| R2 | 8 | 0 |
| R3 | 10 | 1 (R3-11) |
| B1 | 11 | 1 (B1-12) |
| B2 | 11 | 1 (B2-12) |
| Jeu historique | 35 | 0 |
| T2 préservé | 6 | 0 |
| Total | **112** | **3** |

Les onze contrôles techniques B2 réussissent ; [B2-01…B2-12](CONTROLES-B2.md) détaille la portée de chaque vérification. B2-12 comporte les planches livrées mais reste en attente pour la réception artistique et Safari iPad physique.

**Chromium 151.0.7922.34 et WebKit 26.5** ont ouvert et manipulé le laboratoire B2, sur fichiers puis sur **l'URL publique HTTPS exacte ci-dessus**. Galerie immédiate, absence d'erreur de page et de ressource, sélection tactile, paramètres avec effet visuel, portraits et trois vues, export réel téléchargé, import v5, migration v4 F assainie, refus des fichiers invalides sans perte, largeurs 390/820/1180 vérifiés.

Chaque moteur et contexte B2 a vérifié :

- Cinq longueurs distinctes de face/profil/dos ; quatre textures distinctes pour chacune des quatre longueurs non chauves dans les trois vues.
- Six coupes distinctes de face. Certaines différences de coupe concernent la frange : cinq silhouettes dorsales distinctes pour six coupes, ce qui est attendu pour deux franges partageant un tombé arrière.
- Couleur capillaire et trois couleurs faciales indépendantes ; trois tailles faciales avec effet visible en face et profil.
- **744 masques connectés** sans élément flottant ni découpe aux bords, dont 24 cas extrêmes ; **480 vérifications des régions faciales B1 protégées** ; **36 rendus chauves identiques à B1** ; **240 vues dorsales sans traits ou pilosité faciale**.
- F sans dessin ni sélecteur facial, y compris import antérieur interdit ; T conserve coiffure, pilosités, visage et finition quand sa fonction change.

[Seize relevés navigateur CI](MESURES-CI.jsonl) : T3-A/R1/R2/R3/B1 × deux moteurs, B2 × deux moteurs × fichiers/HTTPS, puis T2 × deux moteurs. [Preuve CI complète et décomptes](CI-RESULTATS.json). Les parcours historiques du jeu passent aussi sur la [branche B2](https://github.com/Thsethse/Microcosme/actions/runs/43910299576) et sur [main après publication](https://github.com/Thsethse/Microcosme/actions/runs/43910239186).

Les [mesures locales Chromium](MESURES-B2-LOCAL.jsonl) portent sur les fichiers. Une tentative HTTPS depuis ce Chromium local a rencontré une autorité de certificat non reconnue dans cet environnement ; la validation publique a été réalisée avec les deux moteurs sur les runners standards GitHub Actions, sans ignorer les erreurs TLS.

## Publication et non-régression

[Déploiement Pages réussi](https://github.com/Thsethse/Microcosme/actions/runs/43910237688). [107 ressources HTTPS vérifiées](RESSOURCES-HTTPS.json) : 20 fichiers B2 et 87 ressources antérieures répondent HTTP 200 ; octets et SHA-256 identiques aux sources/snapshots. Certificats TLS vérifiés. [Périmètre des changements et onze modules B1 copiés sans modification](PERIMETRE-VERIFIE.json).

Le jeu principal, ses sauvegardes et les sources T3-A/R1/R2/R3/B1 sont inchangés. T2 a été testé à sa révision préservée `e057e5f906afba25ac943bcc617afb581eb8d296`. Les anciens laboratoires et previews restent accessibles : [B1](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b1/), [R3](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r3/), [R2](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r2/), [R1](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r1/), [T3-A](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/), [T2](https://thsethse.github.io/Microcosme/preview/bio-gen-t2/), [BIO-GEN B2](https://thsethse.github.io/Microcosme/preview/bio-gen-t1-b2/), [BIO-GEN B1](https://thsethse.github.io/Microcosme/preview/bio-gen-t1/).

## Réception restante

[Neuf captures et planches comparatives](COMPARAISONS.md), [manifeste SHA-256 des PNG](CAPTURES-MANIFESTE.json), [rapport et arbitrages graphiques](RAPPORT.md).

**Safari iPad physique non testé ; validation artistique exclusivement utilisateur.** À examiner : lisibilité lisse/raide et frisé/bouclé, dessins des coupes, épaisseur du profil, raccords moustache/lèvres et barbe/menton. Les repères et limites numériques sont des propositions, pas une validation artistique automatique. Aucune phase supplémentaire, aucune intégration canonique et aucune fusion engagées.
