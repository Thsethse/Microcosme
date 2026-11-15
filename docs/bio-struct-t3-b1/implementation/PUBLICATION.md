# Preview B1 indépendante — publiée et vérifiée

**URL : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b1/**

[PR #20 ouverte, non fusionnée](https://github.com/Thsethse/Microcosme/pull/20), branche `codex/bio-struct-t3-b1`, empilée sur R3 #19. Source applicative testée/publiée : **`dfee4e87c7bc7a5c6cda4d1c025bcbb078fb3f7e`**. Les derniers ajouts documentaires ne changent pas cette application.

Snapshot main **`13da86e8adb4fb4936ed7a261d093e00d270f1b3`**, ajoutant uniquement `preview/bio-struct-t3-b1/`. Dix-sept fichiers applicatifs copiés sans transformation ; README spécifique au snapshot. Mécanisme Pages main/racine conservé, aucune reconfiguration ni fusion de PR. Aucun remplacement d’une preview ou source précédente.

## Vérifications effectives

- [Déploiement Pages réussi](https://github.com/Thsethse/Microcosme/actions/runs/43772185586).
- [CI du code publié réussie](https://github.com/Thsethse/Microcosme/actions/runs/43772239847) : **101 tests Node réussis, 0 échec, 2 contrôles humains non exécutés**. Décompte : 23 T3-A + 8 R1 + 8 R2 + 10 R3 + 11 B1 + 35 historiques + 6 T2. R3-11/B1-12 sont réservés à l’essai iPad et à la réception artistique, explicitement ignorés par Node.
- **Chromium 151.0.7922.34 et WebKit 26.5** : parcours B1 complet sur fichiers puis sur **l’URL publique HTTPS**. La page a réellement été ouverte, ses contrôles manipulés, ses pixels vérifiés et les fichiers JSON exportés/importés. Chaque moteur/contexte vérifie 432 masques oculaires, 72 yeux de profil, 108 raccords de cils, les catalogues distincts, les couleurs, 108 silhouettes, quatre comparaisons de coins arrondis et 36 régions corporelles inchangées.
- Les parcours T3-A/R1/R2/R3 préservés passent sur leurs sources locales dans les deux moteurs. T2 préservé passe ses six tests Node et ses parcours Chromium/WebKit. Les [workflows historiques de la branche](https://github.com/Thsethse/Microcosme/actions/runs/43772239783) et de [main après publication](https://github.com/Thsethse/Microcosme/actions/runs/43772185903) réussissent également.
- [Quatorze relevés navigateur CI](MESURES-CI.jsonl) : quatre suites antérieures × deux moteurs, B1 × deux moteurs × deux contextes, puis T2 × deux moteurs. L’environnement CI ne certifie pas les performances d’un iPad.
- [87 ressources HTTPS](RESSOURCES-HTTPS.json) : **17 ressources B1 HTTP 200**, octets et SHA-256 identiques à la source publiée ; **70 ressources des previews B1/B2 BIO-GEN, T2, T3-A, R1/R2/R3 HTTP 200**, identiques aux snapshots préservés. JSON, PNG et fichiers de comparaison existants sont inclus. TLS vérifié, aucun contournement de certificat.

[R3 reste accessible](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r3/), comme [R2](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r2/), [R1](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r1/), [T3-A](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/), [T2](https://thsethse.github.io/Microcosme/preview/bio-gen-t2/), [BIO-GEN B2](https://thsethse.github.io/Microcosme/preview/bio-gen-t1-b2/) et [BIO-GEN B1](https://thsethse.github.io/Microcosme/preview/bio-gen-t1/).

**Safari iPad physique non testé.** WebKit automatisé ne remplace pas l’essai utilisateur. [Instructions et arbitrages visuels](RAPPORT.md) · [18 captures comparatives et catalogues](COMPARAISONS.md). Aucun T3-B2, aucun jeu/sauvegarde modifié, aucune fusion avant accord utilisateur.
