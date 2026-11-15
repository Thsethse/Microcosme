# Preview GitHub Pages R1 indépendante

URL R1 : **https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r1/**

T3-A avant R1 conservé : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/

T2 conservé : https://thsethse.github.io/Microcosme/preview/bio-gen-t2/

La publication ajoute uniquement le nouveau dossier de snapshot sur main, selon le mécanisme Pages existant. Aucun changement de configuration, aucune fusion de PR, aucun remplacement de T3-A/T2 ou du jeu. Les onze fichiers applicatifs sont copiés depuis la branche R1 sans transformation ; le README de snapshot est spécifique à la publication.

## Références et preuves

- PR de code ouverte, non fusionnée : https://github.com/Thsethse/Microcosme/pull/17 ; branche `codex/bio-struct-t3-a-r1`, empilée sur la branche T3-A de #16.
- Source applicative finale : `5dcac5795c408ab72607477eaeedc9641acd11d8` (première version R1 : `c8ccd6c966e5e44a254949d9ffd023a8c2515d11`). Les ajouts documentaires ultérieurs ne changent pas cette source.
- Snapshot main : `66308659e5d25edd8f238c99caec25d93c6c33c5`, après ajout initial `523828062538b6f3af1ef4dfada655bf692214de`. Ces deux publications ne touchent que `preview/bio-struct-t3-a-r1/`.
- [Déploiement Pages final réussi](https://github.com/Thsethse/Microcosme/actions/runs/43754316775).
- [CI R1 finale réussie](https://github.com/Thsethse/Microcosme/actions/runs/43754301274) : 23 tests T3-A + 8 contrôles R1 + 35 tests historiques + 6 tests T2 = **72 tests Node, 0 échec** ; parcours T3-A et R1 dans Chromium 151 et WebKit 26.5, sur fichiers puis sur **l’URL publique HTTPS** ; non-régression navigateur T2 dans ces deux moteurs.
- [Workflow historique de non-régression réussi](https://github.com/Thsethse/Microcosme/actions/runs/43754301286).
- [Empreintes HTTPS](RESSOURCES-HTTPS.json) : onze ressources R1 HTTP 200 identiques octet pour octet à la source finale ; vérification des ressources applicatives T3-A et T2 identiques à leurs sources préservées. TLS vérifié, aucune désactivation de certificat.
- [Mesures brutes des dix parcours navigateur CI](MESURES-CI.jsonl) : deux suites T3-A/R1 × deux moteurs × deux contextes, puis T2 × deux moteurs. Les temps sont propres aux runners CI, sans certification de performances iPad.

Les parcours publics ont effectivement ouvert la page, modifié les paramètres, inspecté les pixels et essayé l’export/import JSON. Ce résultat dépasse un simple contrôle HTTP. Safari iPad physique n’a pas été testé : l’essai utilisateur et l’approbation artistique restent attendus. Voir les instructions et limites dans [RAPPORT.md](RAPPORT.md).
