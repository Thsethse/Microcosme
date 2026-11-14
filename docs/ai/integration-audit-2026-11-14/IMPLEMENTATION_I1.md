# I1 — Laboratoire matériel implémenté

Date : 14 novembre 2026. Statut : code proposé pour revue ; aucune fusion de cette PR de code, aucun passage à I2. Aucun classement F1–F4 et aucune attestation d’intégration complète C1–C4.

## Autorisation et base

La demande utilisateur « applique le prompt de PR documentaire 6 […] passage au code » active explicitement le prompt `05_CODEX.md` et son périmètre I1. P-A à P-E sont repris uniquement pour cette tranche mécanique isolée : frontière décision/exécution, laboratoire borné, transactions et matière conservée, adaptateurs d’essai, revue avant incrément suivant. Cette autorisation n’approuve ni l’architecture C5 complète ni les formalismes biologiques ouverts.

La PR documentaire #6, tête `22a9993e692db66b0d226f5c58b9b9dbf2704235`, a été fusionnée par erreur dans `docs/llm-project-memory` lors de l’interprétation initiale de « applique ». La requête avait abouti avant son interruption ; cela a été signalé dans la conversation. Cette fusion documentaire est le commit `f416ab15c4367e8ced1f26d4ebd13813023d2434` ; elle ne modifie pas main. Aucun autre merge n’est effectué pour cette implémentation.

Base de travail : `f416ab1`, sur une nouvelle branche `codex/material-lab-i1`. Les fichiers du moteur et de l’application correspondent toujours au main audité `3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479`. Aucun AGENTS.md dans l’arbre suivi. Les six documents mémoire et le dossier de contrat v0.2 ont été lus. Les originaux conceptuels absents restent absents, sans reconstruction.

La PR de code cible `docs/llm-project-memory`, qui contient le contrat de référence. Son diff ajoute uniquement les dix chemins autorisés. Moteur, cognition et stockage historiques, interface, rendu, index, dépendances, workflow, anciens tests et previews sont inchangés.

## Essayer le laboratoire

Servir le dépôt comme application statique puis ouvrir **`material-lab.html` directement**. Aucun lien ni script n’est ajouté à `index.html`.

- « + 1 tick » ou « Démarrer » : les deux habitants décident et agissent seuls.
- Sur la scène initiale : tick1 approche, tick2 prélèvement, tick3 ingestion. La source de 12 passe à 10, consumed passe à 2, le bilan reste 12.
- Toucher une case pour la vérité locale ; sélectionner A/B pour les connaissances personnelles. Intention, plan, choix, résultat, coûts et journal sont inspectables séparément.
- Exporter fournit du JSON dans le champ et un téléchargement local. Import uniquement en pause, validation intégrale avant remplacement.
- Masquer le document ou quitter la page met en pause. Reprise manuelle, sans rattrapage depuis l’horloge réelle.
- Le lien de retour ouvre l’application existante ; ses clés de sauvegarde restent intactes.

## Surfaces et interfaces

| Fichier nouveau | Responsabilité / API |
| --- | --- |
| material-world.js | `createLab(config, seed)`, `stepLab(state)`, `observeAgent(state,id)`, `validateState`, `inspect` ; schéma, RNG et invariants |
| material-actions.js | `executeCommand(state,command)` ; MOVE, TRANSFER, INGEST, REST |
| material-cognition.js | `decideAgent(personalView,rng)` ; une primitive, raison, intention et plan bornés |
| material-storage.js | `serialize`, `deserialize`, `save`, `load` ; clé isolée |
| material-lab.html/js/css | Temps, carte d’inspection, vérité/croyances, bilan, journal et export/import |
| tests/material.test.js | Acceptation I1 et garde-fous de contrat |
| tests/material-browser.cjs | Parcours navigateur séparé avec serveur local |
| ce rapport | Résultats réels, interfaces et limites |

UMD/CommonJS, sans framework ni dépendance ajoutée. `createLab` accepte les fixtures initiales `sources: [{cellId,quantity}]`, `agents: [{pos,hunger,energy}]` et une seed non nulle. Les paramètres persistés I1 restent fixes : grille12×9, deux agents,16 lots actifs, rayon2, portage4, MOVE/TRANSFER coût1, INGEST faim−38, REST énergie+6, faim+2/tick, bornes100/130. Les autres quantités de départ sont des fixtures, pas une régénération.

### Transactions et matière

Un tick est construit sur une copie : faim+2, perceptions communes avant commit, décisions personnelles, commandes ordonnées par IDs puis rotation `tick % 2`, revalidation et commits atomiques. Le monde publié est remplacé seulement après validation. `executeCommand` utilise également un brouillon : tout refus conserve matière, positions, corps, IDs, ledger et révisions ; seuls résultat, événement et marqueur d’action sont publiés. Une seconde primitive au même tick est refusée sans écriture supplémentaire.

Le portage se dérive uniquement des locations des lots. Un transfert total garde ID et nombre de lots ; un fractionnement réussi crée un fragment positif. Les cellules source/destination concernées incrémentent leur révision une fois par transaction. L’ingestion retire immédiatement le dernier quantum et incrémente consumed dans le même commit. Aucune archive des lots supprimés. Le bilan entier sûr est vérifié à chaque frontière ; pas de clamp de matière ni de normalisation qui masquerait une perte.

Énergie0 : TRANSFER refuse NO_CAPACITY avant examen de portée/disponibilité pour une commande valide. Énergie1 : succès légal, énergie finale0. Le nombre final de lots, la capacité portée, les révisions et l’allocation d’un entier sûr sont contrôlés. Un ID jamais émis est une commande INVALID, journalisée sans référence inventée ; un ancien ID émis mais disparu peut produire EMPTY localement ou NOT_REACHABLE hors portée.

Les résultats contiennent choix d’intention référencé, commande, issue, cause, révisions consultées, delta, coût et parents causaux. La dernière ingestion décrit l’ancienne quantité, le zéro final, le retrait et le flux consommé. Au-delà de256 événements, les détails purgés ne sont pas reconstitués ; le bilan courant demeure vérifiable.

### Subjectivité, autonomie et RNG

`observeAgent` produit une copie personnelle : corps, portage propre et observations locales datées. Il ne modifie pas le monde. Le décideur reçoit exclusivement cette vue, sans référence au World. Les observations remplacent une entrée par lieu/matériau, au plus108, au plus16 IDs chacune. La disparition d’un lot ne parcourt jamais les mémoires distantes. La prochaine observation locale vide invalide l’étape périmée ; un simple échec de commande n’invente pas l’observation complète d’un lieu.

Politique bornée conforme aux seuils d’essai : ingérer si faim≥45 et portage disponible, repos si énergie<3, acquisition si porté<2 ou faim≥40 sans ration, sinon exploration. Les sources personnelles positives sont classées par distance et échec contextualisé ; une intention encore pertinente est conservée, avec au plus trois alternatives comparables. Le plan ne prédit pas l’ID d’un futur fragment : déplacement et prélèvement connus, puis ingestion choisie au tick suivant depuis le portage réellement observé. Une seule intention, au plus trois étapes ; traces C3 avancées exclues.

PRNG **xorshift32 (13,17,5)**, seed entière1…2³²−1, sortie uint32/2³². `seed` et `rngState` sont sauvegardés. Aucun hasard de l’horloge réelle, aucun `Math.random` dans les modules du laboratoire. Inspection et rendu n’avancent pas le RNG.

### Persistance

Clé exclusive : `microcosme-material-lab-v1`. Aucun accès aux clés historiques v03/v02. Schéma1 strict, champs inconnus et versions futures refusés, lots nuls/négatifs refusés, emplacements orphelins et bilan faux refusés. Les références épistémiques disparues sont admises, mais nextId doit dépasser tous les IDs actifs ou encore cités. Aucun recyclage ni recalcul du compteur après reprise.

Export/import/localStorage partagent le même validateur. Import invalide : session et sauvegarde précédentes intactes. Chargement corrompu/bloqué : nouvelle session en mémoire, message persistant et sauvegarde automatique suspendue jusqu’à un import valide ou une nouvelle expérience explicitement demandée. Échec d’écriture : session conservée, avertissement visible et export toujours disponible. Limite défensive de lecture JSON : 2 millions de caractères ; aucun état n’est tronqué pour entrer dans cette limite.

## Vérifications réellement exécutées

Linux, Node **v24.22.1**, Playwright **1.62.1**, Chromium **151.0.7922.34**, WebKit **26.5**.

| Commande | Résultat |
| --- | --- |
| `npm test` | **59/59**, dont35 existants et24 nouveaux |
| `npm run test:browser` | Parcours historique intégral Chromium et WebKit réussi |
| `node tests/material-browser.cjs` | Nouveau laboratoire : Chromium et WebKit réussis |
| Comparaison Git avec base / main audité | Seulement les nouveaux chemins autorisés ; fichiers historiques inchangés |
| Inspection visuelle automatisée puis lecture des captures | 1180×820 et390×844 ; aucun débordement horizontal constaté |

Les tests navigateur vérifient aussi820×1180,1180×820,390×844, DPR2, interactions tactiles synthétiques, pureté du rendu, téléchargement JSON, import invalide sans remplacement, reload, clés historiques, navigation, document masqué, reprise manuelle sans rattrapage, hors réseau après chargement et accès/écriture du stockage bloqués. Un snapshot local corrompu est conservé sans écrasement silencieux.

Les navigateurs et bibliothèques étaient déjà présents dans le répertoire de travail. WebKit utilise les bibliothèques Debian extraites localement, liées dans son bundle de test. Le contrôle préalable Playwright fondé sur le cache système ldconfig a été désactivé par `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`, car ce cache ne voit pas ces bibliothèques locales ; les deux navigateurs ont ensuite réellement exécuté les assertions. Commandes locales : préfixe `PLAYWRIGHT_BROWSERS_PATH=/workspace/work/browsers`, `LD_LIBRARY_PATH=/workspace/work/work-libs/root/usr/lib/x86_64-linux-gnu` et la variable précédente. Aucun de ces chemins n’entre dans le jeu ni dans le workflow. Prettier3.6.2 a servi ponctuellement à formater uniquement les fichiers nouveaux, sans changer les dépendances du dépôt.

### Correspondance de l’acceptation

| IDs du dossier | Vérification exécutée |
| --- | --- |
| T01–T03 | Conservation, dernier lot, transfert total, concurrent EMPTY, rotation aux deux parités |
| T04 | Deux mondes cachés différents donnent mêmes vues/décisions à RNG identique ; vue gelée |
| T05 | MOVE→TRANSFER→INGEST sans commande d’action de fixture, trois positions/sources différentes |
| T06–T07 | Monde vide250 ticks sans création, refus capacité/absence atomiques |
| T08–T09 | Reprise20 ticks exacte, corruption/version/ledger/IDs/champs inconnus refusés |
| T10/T10-a | Split16→17 refusé ; transfert total à16 autorisé avec ID conservé |
| T11–T12 | Coûts et faim distincts, raison initiale distincte du refus, inspection pure |
| T13–T14 | Clés et application isolées ; mémoire/export fonctionnels avec stockage bloqué |
| T22-a/b | Énergie0 et1, coût nul au refus, aucun ID ni révision consommés ; faim du tick indépendante |
| T23-a/b | Vingt cycles effectifs : source20/consumed20, énergie80, au plus2 lots,20 IDs distincts ; reprise après transfert11 et ingestion11 identique au continu |
| T23-c/d | Mémoire distante périmée conservée à l’import, correction locale, EMPTY vs NOT_REACHABLE |
| T23-e |300 ticks, mémoire et journal bornés, export/reprise complet, aucune table de lots retirés |
| Garde-fous supplémentaires | Une primitive/tick, limites entiers/révisions, dépôt local, commandes malformées et hors grille |

Les tests T22 et T23-a/b sont des tests d’exécution à commandes explicites, avec ticks distincts et phase faim, second agent inactif dans la fixture. Ils ne prouvent pas l’autonomie. T05 utilise exclusivement `stepLab` et les conditions initiales, sans succession d’actions imposée. Les tests existants n’ont pas été modifiés.

Deux premiers cas de test utilisaient des IDs jamais émis tout en attendant EMPTY. Ils ont révélé la nécessité de distinguer références périmées et commandes incohérentes : les fixtures utilisent désormais un compteur attestant l’ancienne émission ; les commandes externes visant un ID futur sont rejetées sans injecter une référence invalide dans le journal. La publication des refus a également été placée sur copie avant validation. Résultat final59/59 ; aucun ancien test assoupli.

## Réserves et prochaine étape

- **Safari iPad physique : NON EXÉCUTÉ.** Les événements de visibilité du nouveau test sont synthétiques. Ils vérifient les gestionnaires, pas la suspension réelle par iPadOS ni le comportement après verrouillage prolongé.
- **Performance et tenue longue sur matériel cible : NON MESURÉES.** Les centaines de ticks de tests vérifient invariants et bornes ; ce ne sont pas un benchmark ni une preuve de plusieurs heures en production. Le mode à copies et validations complètes privilégie la vérifiabilité pour deux agents.
- Pas de rechargement à froid hors ligne garanti. Le mode réseau coupé est vérifié après chargement.
- Les souvenirs peuvent rester périmés tant qu’un lieu n’est pas observé. Le dernier quantum disputé peut favoriser l’un des agents ; la rotation ne garantit ni justice ni absence de famine.
- Le stock finit par s’épuiser ; aucune régénération, mort, assimilation biologique, obstacle/BFS, construction, communication sociale ou innovation n’est ajoutée. Le repos est un adaptateur d’essai.
- Grille d’inspection simple, sans nouveau pixel art. Sur petits écrans, les cases sont petites ; vérifier les cibles tactiles sur tablette physique. Les contrôles principaux restent44px.
- C5 et paramètres biologiques restent expérimentaux ; textes conceptuels intégraux toujours à récupérer avant toute certification C1–C4.

Prochaine étape autorisée : **revue de cette PR I1 et essai physique**. Aucun lancement de I2, aucune migration de partie ni remplacement du moteur sans nouvelle décision.
