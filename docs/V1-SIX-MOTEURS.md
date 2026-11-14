# Microcosme V1 — intégration verticale expérimentale

14 novembre 2026. Proposition de code et prévisualisation indépendante, sans fusion.
**J4, C5, C6 et C9 ne sont pas techniquement clos.** Les lois conceptuelles C1–C4 ne sont ni réécrites ni certifiées exhaustivement.

## Préparation et autorisation

La demande explicite de développement V1 autorise cette tranche isolée et sa publication de prévisualisation. Les mentions « aucune programmation » des décisions documentaires décrivent leur portée initiale ; elles ne sont pas utilisées comme autorisation implicite de programmer. Aucune contradiction conceptuelle détectée. Aucun mécanisme biologique ou social supplémentaire n'est ajouté.

- PR #7 examinée : ouverte, non fusionnée, branche `codex/material-lab-i1`, tête **`8767f15995818235498d31107eb32c714a567699`**, base `docs/llm-project-memory` / `f416ab15c4367e8ced1f26d4ebd13813023d2434`. Discussion vide au contrôle initial.
- Branche dédiée créée **depuis cette tête I1** : `codex/microcosme-v1-six-engines`. PR empilée sur `codex/material-lab-i1` pour isoler le diff V1. Aucun merge.
- Branche documentaire lue : `docs/catalogue-moteurs-universels-2026-11-14`, tête **`b604453d3d3634e2c2abd95847c957c3f5449391`**. Lecture de J3, J4-D1/D2/D3, J4-T1…T5 et J4-COUV-D1 (quatre documents `docs/ai/J*.md`).
- Aucun `AGENTS.md` applicable trouvé dans les parents du checkout, son arbre ni la branche documentaire.
- Contrats I1 et rapport `docs/ai/integration-audit-2026-11-14/IMPLEMENTATION_I1.md` examinés. I1 fournit déjà monde fini, transactions, capacité, concurrence, observations locales, RNG, validation et stockage isolé. Il mélange encore perception/consolidation/décision et ne démontre pas M6 influençant une décision future.
- Les noms **V1-01…V1-07** n'existaient pas dans la branche documentaire examinée. Le tableau ci-dessous formalise leurs critères opérationnels pour cette mission ; il ne prétend pas reproduire une spécification absente.

## Accès direct et manipulation

Prévisualisation prévue sur le système GitHub Pages déjà utilisé par Microcosme :

**https://thsethse.github.io/Microcosme/preview/v1/v1.html?v=1**

Publication sous un nouveau dossier `preview/v1/` de `main`, par copie statique des sept ressources de production, sans fusion de la PR. Le moteur historique, ses sauvegardes et les previews existantes ne sont pas modifiés. Le manifeste de publication dans ce dossier indique le commit source et les SHA-256. Cette copie reste figée, elle ne suit pas automatiquement la branche V1.

En local, servir le checkout comme site statique et ouvrir `v1.html`. Aucun build ni bibliothèque distante à l'exécution. Les ressources requises sont `v1.html`, `v1.css`, `v1-page.js`, `v1-storage.js`, `v1-engines.js`, `material-world.js`, `material-actions.js`. Les deux fichiers I1 sont réutilisés **sans modification**. Aucun script de l'application historique ou de l'île n'est chargé.

Trois scénarios, sélectionnés puis activés par « Nouvelle expérience » :

1. **La chaîne initiale** : approche au tick 1, prélèvement au tick 2, ingestion au tick 3 ; 10 rations présentes + 2 consommées = 12.
2. **Deux sources et une préférence acquise** : seed 7, 24 rations en 40 et 24 en 42. Au tick 33, A quitte 42 pour retourner vers 40, avec une préférence acquise +6. M4 expose base 98 + expérience 6 = score 104 ; prélever en 42 a une base 100. Le test contrefactuel supprime uniquement la préférence personnelle avant le tick 33 et obtient TRANSFER en 42 avec les mêmes signaux et RNG.
3. **Dernière ration disputée** : une ration en 40 et une seconde source en 28. Les deux choix précèdent l'arbitrage ; un prélèvement réussit, l'autre peut échouer EMPTY sans double effet. La source alternative reste un choix de l'habitant.

Toucher une case compare vérité et dernière observation personnelle ; sélectionner A/B puis les cartes M1…M6 pour examiner les événements. Le sélecteur causal et les boutons de parents remontent les causes conservées. Lancer, pauser, avancer un tick, exporter et importer sont disponibles sans commande d'action individuelle.

## Contrats des six moteurs

Les fonctions logiques sont regroupées dans `v1-engines.js` : six responsabilités ne signifient pas six modules obligatoires. Le monde I1 reste l'autorité matérielle. Les paramètres sont des adaptateurs d'essai, pas une nouvelle théorie biologique ou une architecture C5 globale.

| Moteur / déclenchement | Entrées et transformation | Sorties / autorité / persistance | Échec et inspection |
| --- | --- | --- | --- |
| M1 Réguler / temps commun | Corps propre ; faim +2 plafonnée à 130 | Corps et signaux, sans choix ; corps sauvegardé dans le monde I1 | Avant/après et cause temporelle ; coûts/récupération restent les effets des transactions I1 |
| M2 Percevoir / activation personnelle | Corps, inventaire propre, cellules en Manhattan ≤2 ; copie des observations avant actions | Signaux datés, positions et révisions observées ; aucune omniscience transmise à M3/M4 | Observation ignorée si perception externe désactivée ; données M2 figées dans la trace |
| M3 Comprendre / demande de décision | Signaux + acquis personnels ; superposition provisoire des observations sur les souvenirs | Hypothèses de sources et anticipation de disponibilité, avec âge et incertitude ; ne consolide rien | Souvenir positif admis même si le lot a disparu ; état interprété enregistré avant choix |
| M4 Évaluer puis Décider / activation de décision | Besoins, inventaire, hypothèses, préférence apprise ; options scorées puis arbitrage | Évaluation séparée du choix ; intention et prochaine primitive dans le monde I1 | Liste des scores, preuves, tirage en cas d'égalité et raison réelle du choix ; aucun résultat futur utilisé |
| M5 Agir / choix prêt | Commande MOVE/TRANSFER/INGEST/REST, capacités et préconditions réelles | Tentative puis résultat du monde ; seul `MaterialActions.executeCommand` publie les effets matériels | Révisions, delta, coût, succès/refus I1 ; résultat distinct de la raison initiale |
| M6 Apprendre / observations ou résultat accessibles | Observations M2 et résultat de sa propre tentative | Consolide les croyances ; préférence de source bornée −6…+6 et référence d'expérience ; persistance `minds` | Succès TRANSFER +4, échec −6, saturation aux bornes ; aucune expérience d'autrui injectée ni vérité distante apprise |

### Responsabilités des données et politique minimale

- `world` conserve strictement le schéma I1, ses identifiants, quantités entières, positions, capacités, ledger, révisions et résultats. `world.agents[].knowledge` reste vide dans V1 : les acquis V1 sont séparés pour éviter deux autorités de mémoire. Cela ne modifie pas le laboratoire I1 original.
- `minds[].beliefs` contient au plus 108 observations consolidées, datées et sourcées ; `preferences` contient au plus 108 préférences et leurs preuves M6. M3 produit des copies temporaires ; M6 est seul à publier les acquis. Une réussite n'apprend pas une quantité réelle actualisée après tous les commits.
- Options : ingestion si faim ≥45 et ration portée (score 2000), repos urgent si énergie <3 (1000), acquisition si porté <2 (100 − distance + préférence), exploration d'un voisin peu observé (≤10), repos ordinaire (−100). Ces coefficients sont expérimentaux. Ils n'établissent aucun calibrage C1/C2.
- La génération d'options est **fermée** à quatre primitives et aux lieux connus/voisins ; aucune invention ouverte ni composition générale n'est démontrée. Le plan contient la prochaine primitive ; une nouvelle perception précède la décision suivante par défaut. Un souvenir de lot périmé peut conduire à une tentative refusée.
- Une préférence est une association autobiographique minimale révisable, **pas** une pratique culturelle C3, un transfert de connaissance ou un jugement de vérité. Il n'y a ni oubli généralisé, ni communication sociale, ni biologie supplémentaire.

### Temps, causalité et concurrence

`step(state, {perceiveIds, decideIds})` est un ordonnanceur de démonstration remplaçable. M1 avance chaque tick ; les perceptions externes et les décisions de chaque habitant peuvent être activées séparément. M2 conserve les signaux internes ; M6 peut consolider des observations sans décision. Une intention et son étape peuvent rester sauvegardées pendant une activation de décision sautée. Le test V1-07 démontre ces activations différenciées. Ce dispositif ne prétend pas résoudre l'ordonnancement futur ni les actions longues.

Par défaut, les deux évaluations/choix précèdent toute transaction. Les commandes triées par acteur sont arbitrées avec la rotation I1 `tick % nombre de commandes`. Chaque commande est revalidée contre le monde courant. Un seul effet d'action par acteur/tick. L'égalité est départagée seulement par **xorshift32 I1**, dont seed et état sont persistés. L'inspection et le rendu ne consomment aucun tirage.

Tout le tick V1 est construit sur une copie et publié après validation complète. Chaque action I1 est elle-même atomique. Les échecs conservent matière, corps, positions, compteurs et révisions, hors résultat/marqueur d'action ; l'exposition de faim M1 est un événement distinct. La limite de 16 lots, le portage 4, les coûts et la suppression des lots épuisés sont hérités d'I1. L'ingestion conserve le bilan via `consumed`.

### Inspection fidèle, rétention et sauvegardes

Événements V1 monotones `v1:N` : `M1`, `M2`, `M3`, `EVALUATE`, `DECIDE`, `ATTEMPT`, `RESULT`, `M6`. Acteur, tick, parents et données déterminantes sont figés au moment concerné. L'évaluation enregistre les facteurs effectivement utilisés, le choix son éventuel tirage. Une explication n'est pas recalculée depuis l'état futur. Les résultats I1 restent intégraux, avec leurs références matérielles ; lorsque conservés, leurs prédécesseurs matériels sont aussi reliés dans le graphe V1.

Le journal V1 conserve **512 événements** (environ 32 ticks avec deux activations complètes) ; le journal matériel I1 garde sa propre borne 256. Les croyances et préférences peuvent survivre à la purge de leurs preuves détaillées. Les références restent identifiables ; l'inspecteur affiche « détail non conservé » sans inventer les détails. Ce choix borné ne clôt pas la politique de rétention C9. Aucune action habituelle inconsciente n'est implémentée ni racontée comme une délibération.

Enveloppe séparée `microcosme-six-1`, clé exclusive **`microcosme-six-engines-v1`**. Aucun accès aux clés I1/v03/v02. Export/import identiques au stockage local : monde, acquis, intentions, compteur causal, traces et RNG. Validation avant remplacement, refus des versions inconnues, invariants I1, parents futurs/cycliques, scores/choix incohérents et preuves personnelles conservées incohérentes. Les fichiers JSON ne sont pas authentifiés cryptographiquement et les détails déjà purgés ne peuvent être réaudités.

Import en pause uniquement ; import invalide sans remplacement de session ni de sauvegarde. Chargement corrompu/bloqué : mode mémoire avec sauvegarde automatique suspendue, valeur originale conservée jusqu'à import valide ou nouvelle expérience explicite. Quota d'écriture : avertissement, session et export disponibles. Lecture limitée à 8 millions de caractères ; aucun état n'est tronqué pour contourner une limite.

Document masqué ou `pagehide` : arrêt immédiat du minuteur, reprise manuelle sans rattrapage. Rechargement en pause. Hors ligne après chargement complet ; aucun service worker ni ouverture à froid hors ligne garantie.

## Validation automatisée

| Test | Assertions principales |
| --- | --- |
| V1-01 | Trois géométries initiales, MOVE→TRANSFER→INGEST autonomes ; chaîne des huit catégories d'événements pour les six responsabilités ; 12 = 10 + 2 |
| V1-02 | Croyance devenue fausse conservée sans nouvelle perception ; correction personnelle seulement ; deux mondes cachés donnent les mêmes signaux/choix ; M3 ne consolide pas |
| V1-03 | Préférence issue d'un vrai résultat personnel ; comparaison contrefactuelle au tick 33, signaux identiques ; autre primitive/destination sans la préférence |
| V1-04 | Dernier quantum aux deux parités ; un gagnant ; refus EMPTY sans coût, perte, création d'ID ou double effet ; apprentissage du refus distinct du choix |
| V1-05 | Reprises aux ticks 1, 2 et 32 puis 40 ticks identiques octet pour octet ; corruptions/versions/références/scores/choix invalides refusés |
| V1-06 | Remontée des six responsabilités depuis M6 ; inspection pure ; copie indépendante ; purge explicite ; sauvegarde après purge |
| V1-07 | Perception/décision activées indépendamment ; intention interrompue/sauvegardée/reprise sans duplication ; monde vide 200 ticks, bornes et aucun hasard non contrôlé |
| Stockage V1 | Clé propre, stockage bloqué/corrompu, valeurs I1/historiques intactes |

Commandes :

```sh
npm ci
npm test
npx playwright install --with-deps chromium webkit
npm run test:browser
node tests/material-browser.cjs
node tests/v1-browser.cjs
# Même parcours sur la copie publique :
V1_URL='https://thsethse.github.io/Microcosme/preview/v1/v1.html?v=1' node tests/v1-browser.cjs
```

Résultats constatés : **67/67 Node** (35 historiques + 24 I1 + 8 V1). Parcours historiques et I1 réussis dans Chromium **151.0.7922.34** et WebKit **26.5** Linux. Validation V1 locale/publique et intégrité des ressources : voir le relevé de livraison ci-dessous.

La suite V1 navigateur vérifie le vrai parcours autonome, le scénario d'apprentissage jusqu'au tick 33, l'inspection sans mutation, le téléchargement exact du JSON, import invalide/valide, rechargement, isolation des clés, formats 820×1180 / 1180×820 / 390×844, confinement de la grille, visibilité synthétique, reprise manuelle, hors ligne après chargement et stockage bloqué/corrompu. Aucun script/CSS/document requis ne doit répondre en erreur. Un nouveau workflow V1 lance les suites V1/I1 sans modifier le workflow historique ni les dépendances.

Environnement de test : Node 24.22.1, Playwright 1.62.1. Les navigateurs sont téléchargés dans `/workspace/work/browsers`. Bibliothèques Debian WebKit extraites sous `/workspace/work/webkit-libs` et liées dans le bundle de test ; aucun changement système ou code produit. `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` contourne uniquement le contrôle ldconfig qui ignore ces bibliothèques locales ; les assertions sont réellement exécutées. Les essais initiaux WebKit sans ces liens échouaient au lancement, puis ont été repris après correction de l'environnement.

## Tableau de couverture

« Satisfait » signifie démontré dans **ce scénario V1 borné**, sans certification globale des lois historiques.

| Exigence | État V1 | Preuve ou limite |
| --- | --- | --- |
| Six responsabilités, J3-D1/D2 | Satisfait dans V1 | Fonctions distinctes, monde I1 conservé ; pas de remplacement des lois C1–C4 |
| J3-D3 / J4-D2 temporalité non rigide | Satisfait dans V1 | Activations différenciées et temps commun, V1-07 ; ordonnanceur futur ouvert |
| J3-D4 autorité du monde | Satisfait | Transaction I1 après tentative ; refus et concurrence V1-04 |
| J3-D6 moteurs non éditables par le dieu | Satisfait pour la page | Inspection, temps et fixtures ; permissions divines détaillées non couvertes |
| J4-T1 contrats logiques | Satisfait dans V1 | Tableau des six fonctions, entrées/sorties/autorité avant généralisation |
| J4-T2 / J4-D1 mémoire et autorité | Satisfait dans V1 | M3 provisoire, M6 publie acquis ; croyance ≠ vérité |
| J4-T3 / J4-D3 événements causaux | Satisfait dans V1 | Références, facteurs effectivement utilisés, traces bornées indépendantes de la mémoire |
| J4-T4 déterminisme | Satisfait dans V1 | V1-01…07, I1 et RNG sauvegardé |
| J4-T5 interfaces évolutives | Partiel | Adaptateurs purement locaux ; aucune architecture générale C5/C6/C9 fixée |
| J3-LAC-1 possibilités inédites | Non couvert | Générateur fermé de primitives/options, aucune invention ouverte |
| J3-LAC-2 composition des actions | Partiel | Approche/prélèvement/ingestion sur plusieurs décisions, sans composition générale ni action collective |
| J3-LAC-3 inspection causale | Partiel globalement | Graphe V1 consultable ; rétention bornée et architecture C9 ouvertes |
| COUV-01 biologie complète / COUV-T1 | Non couvert | Adaptateur faim/énergie I1 uniquement ; pas de naissance/développement/pathologie |
| COUV-02 sélection perceptive / COUV-T2 | Partiel | Portée et activation perceptive ; pas de concurrence cognitive entre stimuli ni jauge A |
| COUV-03 évaluer/décider | Satisfait dans V1 | Fonctions et événements séparés, scores puis tirage/choix |
| COUV-04 actions sociales / COUV-T3 | Non couvert | Pas de demande, refus social, communication S ou coordination |
| COUV-05 transmission / COUV-T4 | Non couvert | Expérience individuelle seulement ; ni transmission ni culture/pratique C3 |
| COUV-06 cycle de vie / COUV-T5 | Partiel | Intention et primitive suspendues/reprises, transactions atomiques ; pas d'action longue/collective ni projet général |
| COUV-07 inspection et carburants | Partiel | Inspection causale et sources ; droits d'édition divine et carburants non définis |
| INT-01/02/03/06/07 | Partiel | Besoin, fausse croyance, compétition, sauvegarde, purge ; pas de projet riche ni oubli cognitif |
| INT-04/05/08 | Non couvert | Mensonge, transmission imparfaite, expérimentation/invention ouverte absents |
| Safari iPad physique | Non couvert par automatisation | Protocole manuel ci-dessous ; WebKit Linux ne remplace pas Safari iPadOS |

## Safari iPad physique : à exécuter séparément

**NON EXÉCUTÉ ; aucune mesure certifiée de performance, batterie, mémoire ou tenue longue sur appareil Apple.**

1. Ouvrir le lien direct dans Safari, sans installation ; vérifier le titre V1, la grille et les six cartes. Noter modèle iPad, versions iPadOS/Safari et heure d'essai.
2. Nouvelle expérience « chaîne initiale », trois ticks : MOVE, TRANSFER, INGEST et bilan 10 + 2 = 12. Toucher les cases et changer A/B ; comparer vérité et observation datée.
3. Choisir « deux sources », nouvelle expérience, démarrer jusqu'au tick 33 puis pauser ; lire la préférence +6 de A et les facteurs de M4. Remonter le lien de préférence vers M6 puis son résultat personnel tant que les événements restent conservés.
4. Choisir « dernière ration disputée » ; observer succès/refus au tick 2 et bilan sans duplication. Vérifier que le choix initial de l'acteur refusé n'est pas réécrit après l'échec.
5. Portrait/paysage, Split View, zoom texte Safari : lisibilité, sélecteurs, défilement, boutons de causes, accès au champ JSON. Les cases de grille peuvent être petites sur écrans étroits ; mesurer les cibles tactiles sur le matériel.
6. Démarrer puis changer d'onglet, verrouiller et revenir après plusieurs minutes : aucun tick de rattrapage, reprise manuelle. Vérifier aussi rechargement et retour arrière/avant avec cache de navigation iPadOS.
7. Exporter : téléchargement dans Fichiers et copie du texte. Importer le JSON en pause puis continuer. Import invalide sans remplacement ; fermeture/réouverture de Safari et persistance. Tester navigation privée, stockage limité et pression mémoire réelle.
8. Mode avion après chargement : simulation/inspection/export ; ne pas conclure à une ouverture à froid hors ligne garantie.
9. Ouvrir ensuite le village historique et les prototypes de l'île : parties, clés et previews précédentes préservées. Aucun test V1 ne doit demander une migration historique.
10. Faire tourner 20–30 minutes : réactivité, température, batterie, taille d'export, erreurs éventuelles. Ces mesures restent à relever, aucun seuil matériel n'est certifié par les tests Linux.

## Relevé de livraison

À compléter après la vérification de la prévisualisation déployée : résultats V1 Chromium/WebKit locaux/publics, identité des sept ressources, commit de publication et statut de PR non fusionnée.
