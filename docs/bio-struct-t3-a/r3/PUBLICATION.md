# Publication indépendante R3 — vérifiée

**URL : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r3/**

[PR #19 ouverte, non fusionnée](https://github.com/Thsethse/Microcosme/pull/19) ; branche `codex/bio-struct-t3-a-r3`, empilée sur R2 #18. Source applicative finale testée/publiée : **`be0779be4809ea321ab4485bf66ff9c7900b1e65`**. Les ajouts documentaires suivants ne changent pas cette source. Première source R3 : `ee9bdbd059ff430c2acec7b5c274f97781f8fceb` ; dernière correction : quantification du nombril en point à toutes tailles.

Snapshot main final **`9a0c47047c4ef03e16bbf452980965f3142ad2e4`**, après ajout initial `106c5b9c30c34be13c78d1560d81e604263da24c`. Les deux publications touchent uniquement le nouveau dossier `preview/bio-struct-t3-a-r3/`. Mécanisme Pages existant main/racine, aucune reconfiguration et aucune fusion. Quatorze fichiers applicatifs copiés sans transformation ; README spécifique au snapshot.

## Preuves

- [Déploiement Pages final réussi](https://github.com/Thsethse/Microcosme/actions/runs/43764895695).
- [CI du code final réussie](https://github.com/Thsethse/Microcosme/actions/runs/43764854161), source `be0779b` : **90 tests Node réussis, 0 échec, 1 contrôle humain non exécuté**. Détail : 23 T3-A + 8 R1 + 8 R2 + 10 R3 + 35 historiques + 6 T2. R3-11 est explicitement ignoré par Node car réservé à la réception artistique et Safari iPad physique.
- **Chromium 151.0.7922.34 et WebKit 26.5** : quatre parcours T3-A/R1/R2/R3 réussis sur fichiers puis sur **l’URL publique HTTPS**. Ils ont réellement ouvert la preview et manipulé ses contrôles, pixels, fonctions et imports/exports. Le parcours R3 vérifie 360 masques connexes/non coupés, 24 masques de détails sans dépassement, 21 comparaisons de têtes inchangées et le point de nombril carré à trois tailles globales, par moteur et contexte.
- T2 : 6 tests Node et parcours navigateur Chromium/WebKit à sa révision préservée. [Workflow historique jeu réussi](https://github.com/Thsethse/Microcosme/actions/runs/43764854150) sur la branche de code ; [non-régression main après publication réussie](https://github.com/Thsethse/Microcosme/actions/runs/43764896288).
- [18 relevés navigateur CI](MESURES-CI.jsonl) : quatre suites × deux moteurs × deux contextes, plus T2 × deux moteurs. Les mesures de runners ne certifient pas les performances d’un iPad.
- [70 ressources HTTPS](RESSOURCES-HTTPS.json) : **14 fichiers R3 HTTP 200**, octets/SHA-256 identiques à la source finale ; **56 ressources des anciennes previews B1/B2/T2/T3-A/R1/R2 HTTP 200**, identiques aux snapshots préservés, y compris JSON/PNG et fichiers de comparaison. TLS vérifié, sans contournement de certificat.

Anciennes previews conservées : [R2](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r2/), [R1](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r1/), [T3-A](https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/), [T2](https://thsethse.github.io/Microcosme/preview/bio-gen-t2/), [B2](https://thsethse.github.io/Microcosme/preview/bio-gen-t1-b2/), [B1](https://thsethse.github.io/Microcosme/preview/bio-gen-t1/).

**Safari iPad physique non testé.** WebKit automatisé ne remplace pas la réception de l’utilisateur. [Instructions et arbitrages](RAPPORT.md) · [18 captures comparatives](COMPARAISON.md). Attendre accord utilisateur avant toute fusion. Aucun T3-B1/B2 ni phase suivante.
