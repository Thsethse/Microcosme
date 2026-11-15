# T3-A — prévisualisation indépendante GitHub Pages

URL : **https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/**

Publication selon le mécanisme existant : copie des neuf fichiers applicatifs de `experiments/bio-struct-t3-a/` dans le seul nouveau dossier `preview/bio-struct-t3-a/` de main. Aucune modification de configuration Pages, aucun écrasement de T2 ou d'une autre preview, aucune fusion de PR.

## Vérifications effectuées

- Source applicative : `e122da5294daff8aaa1a8fbabe51a6ea635aa71f` ; révision testée en CI `ad6040ca0dbc306ef908ea53b3c50237f65d9111` (workflow corrigé seulement).
- Publication main : `1c28b507684836d91021732420fa998009a74d99` ; [déploiement Pages 43742970672](https://github.com/Thsethse/Microcosme/actions/runs/43742970672) **success**.
- Neuf fichiers applicatifs téléchargés HTTPS, tous **HTTP 200**, mêmes octets et empreintes SHA-256 que le code source. Preuves détaillées : `RESSOURCES-HTTPS.json`. Le README de publication est propre au snapshot et n'est pas une ressource applicative.
- [CI 43743148481](https://github.com/Thsethse/Microcosme/actions/runs/43743148481) **success** : l'URL a été ouverte et manipulée dans Chromium 151 et WebKit 26.5, avec trois corps affichés immédiatement, contrôle des proportions/volumes, fonction T, debug, export téléchargé/relu et import/rejet sans perte. Les résultats JSON des parcours locaux/publics figurent dans `MESURES-CI.jsonl`.

Aucune installation ni connexion ChatGPT requise. Le déploiement ne dépend d'aucune fusion de PR. Les derniers commits documentaires n'altèrent pas les ressources publiées.

WebKit Linux automatisé ne remplace pas Safari iPad physique. La preview est techniquement vérifiée ; son approbation physique et artistique reste réservée à l'utilisateur.
