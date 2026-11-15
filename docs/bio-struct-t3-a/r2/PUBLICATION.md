# Publication R2 indépendante — vérifiée

**URL R2 : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r2/**

[PR #18 ouverte, non fusionnée](https://github.com/Thsethse/Microcosme/pull/18), branche `codex/bio-struct-t3-a-r2`, empilée sur R1 #17. Source applicative testée et publiée : **`0f08780e4c3505c828f18a01ad99aae8858e32b3`**. Les ajouts documentaires suivants ne changent pas cette source.

La publication reprend le mécanisme Pages existant (main, racine) : snapshot **`cb34f86c952165d86bf6128e68d7c1c12cb0812e`**, ajoutant seulement `preview/bio-struct-t3-a-r2/`. Aucun changement de configuration, aucune fusion de PR et aucun remplacement de fichier préexistant. Les onze fichiers applicatifs sont copiés sans transformation ; le README du snapshot précise leur source.

## Vérifications réalisées

- [Déploiement Pages réussi](https://github.com/Thsethse/Microcosme/actions/runs/43759429678).
- [CI R2 réussie](https://github.com/Thsethse/Microcosme/actions/runs/43759478609), source `0f08780` : **80 tests Node, 0 échec** = 23 T3-A + 8 R1 + 8 R2 + 35 historiques + 6 T2.
- Chromium **151.0.7922.34** et WebKit **26.5** : parcours T3-A, R1 et R2 réussis sur fichiers puis sur **l’URL publique HTTPS**. Les parcours ont réellement ouvert la page, manipulé les paramètres, testé le JSON et vérifié les pixels. R2 contrôle 432 masques connexes/non coupés par moteur et contexte, plus les règles de visibilité des quatre cas M/F/T male/T female. Les parcours navigateur T2 réussissent aussi dans ces deux moteurs.
- [Workflow historique jeu / non-régression réussi](https://github.com/Thsethse/Microcosme/actions/runs/43759478569) sur la source R2 ; [non-régression main après publication réussie](https://github.com/Thsethse/Microcosme/actions/runs/43759429627).
- [Empreintes et réponses HTTPS](RESSOURCES-HTTPS.json) : **11 ressources R2 HTTP 200**, mêmes octets et SHA-256 que la source ; **45 ressources des anciennes previews B1/B2/T2/T3-A/R1 HTTP 200**, mêmes octets que leurs snapshots préservés. TLS vérifié, aucun contournement de certificat. Les fichiers de comparaison, JSON et PNG existants sont inclus lorsqu’ils appartiennent à ces dossiers.
- [14 relevés bruts navigateur CI](MESURES-CI.jsonl) : trois suites × deux moteurs × deux contextes, plus T2 × deux moteurs. Les temps concernent les runners CI ; aucune performance physique iPad n’en est déduite.

Les anciennes URL restent disponibles : [R1](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r1/), [T3-A](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/), [T2](https://thsethse.github.io/Microcosme/preview/bio-gen-t2/), [B2](https://thsethse.github.io/Microcosme/preview/bio-gen-t1-b2/), [B1](https://thsethse.github.io/Microcosme/preview/bio-gen-t1/).

**Safari iPad physique non testé.** L’ouverture et la manipulation automatisées dans WebKit ne remplacent pas l’essai utilisateur. Instructions et points à valider dans [RAPPORT.md](RAPPORT.md) ; [captures comparatives](COMPARAISON.md). Attendre retour iPad et validation artistique avant toute fusion. Aucun R3/T3-B/C.
