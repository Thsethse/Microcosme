# Dépendances, tests et trajectoire
Statut : propositions non validées ; tests candidats ci-dessous **non exécutés** puisque le nouveau noyau n’existe pas.

## Registre d’autorité et inconnues
| ID | Statut | Fait / manque / conséquence |
|---|---|---|
| V-01 | Validé, source mémoire | C1–C4 clos conceptuellement, DIR-1–6 validées ; aucune réouverture proposée |
| V-02 | Validé, source DECISION_REGISTER | Effort : L/M/S distincts, pas de R générale sans nécessité, A différé, récupération ≠ réparation, biologie ≠ décision, inspection divine |
| U-01 | INCONNU dans les fichiers reçus | Textes intégraux des cinq lois C1, tests A–G et réserves effort LIM-E/DEP-E ; pas de certification C1 exhaustive |
| U-02 | INCONNU dans les fichiers reçus | Détails C2, tests T1–T6 ; formules d’évaluation et interfaces non récupérées |
| U-03 | INCONNU dans les fichiers reçus | Contrat complet modèle T C3, granularité et tests T1–T3 ; bloque consolidation I4, pas l’exécuteur matériel |
| U-04 | INCONNU dans les fichiers reçus | Décisions P1–P6 C4 global, texte C4.6 et C4.7, limites exactes ; S et G1-R à préciser avant intégration sociale |
| U-05 | INCONNU dans les fichiers reçus | Sens détaillé G+, R-G1/R-G2 ; on préserve les noms/statuts, on n’invente pas leur contenu. Pas de grille C5 validée |
| U-06 | Ouvert, non validé | B1.14 M1/M2/M3 et bilan interne ; candidat M2 n’est pas une décision |
| U-07 | NON DÉMONTRÉ | Safari physique, plafonds CPU/mémoire, tenue longue et montée en population du nouveau noyau |
| U-08 | NON DÉMONTRÉ | Créativité autonome, invention de nouveaux usages hors règles, coopération durable, normes et organisations |
| U-09 | À développer | Migration d’une partie main vers matière finie ; rester isolé tant que conversion non spécifiée |

Source : les six fichiers de docs/ai au commit mémoire fixé. Les originaux absents devront être importés verbatim depuis une source fiable avant attestation d’intégration complète ; ce dossier ne les remplace pas.

## Dépendances préservées
- D1 critique : le contrat traite exécution matérielle et enchaînement ; la conception C6 globale reste ouverte.
- D2 : objectif vers autrui/communication S non implémenté dans I1–I3.
- L1 critique : résultats structurés, raisons de choix et inspection ; pas de narration inventée.
- L2 / G1-R : bornes et consolidation à spécifier, pas de journal mental exhaustif.
- N1 et N2 : aucune obligation morale autonome ni généralisation universelle ajoutée.
- CR-01/02/03 : invention, projets et coordination non confondus. CR-04/09 : granularité/navigation testées localement. CR-05–08 : terrain/eau/biotopes/écologie exclus. CR-10–12 : temps long, lisibilité et périmètre restent surveillés.

## Catalogue C5 complémentaire candidat
Ne remplace pas C5_REQUIREMENTS.md ; mutualiser avant validation.
| ID | Phénomène | Interactions nécessaires | Observable | Trace persistante | Priorité / statut |
|---|---|---|---|---|---|
| INT-01 (ENV-01/08) | Alimentation/épuisement | transfert + ingestion, quantités et accessibilité | source baisse, porteur reçoit, faim change | lots, ledger, cause | Indispensable au labo ; candidat |
| INT-02 | Concurrence | localisation exclusive, arbitrage, revalidation | un succès et un échec sur dernier quantum | résultat, révision, détenteur | Indispensable ; candidat |
| INT-03 | Obstacle | passabilité + déplacement d’objet | passage ouvert/fermé, détour | position et révision | I2 ; candidat |
| INT-04 | Construction interrompue | dépôt + travail incrémental | chantier inachevé puis reprise | matériaux et workDone | I3 ; candidat |
| INT-05 (ENV-02–06) | Échanges biologiques | acceptIntake / coûts / flux | apports et dépenses explicables | bilan externe, état corps futur | Interface indispensable, biologie réelle différée |
| INT-06 | Interventions divines | commande contrôlée et invalidation | différence vérité/croyance | flux ajout/retrait et cause | Inspection I1, édition étendue ultérieure |
Eau ENV-07 et conservation biologique interne demeurent ouvertes. Quantité/location/révision/transaction sont mutualisées ; pas de nouveau sous-système par phénomène.

## Tests d’acceptation candidats
| Test | Préparation / perturbation | Oracle précis | Tranche |
|---|---|---|---|
| T01 conservation | ration source=3, prélever 1 puis ingérer | sol2, portée0, consumed1 ; invariant I-03 | I1 |
| T02 épuisement | source=1 au sol, deux commandes visant le même lot et lieu, énergie suffisante | transfert total conserve l’ID chez le premier porteur ; second EMPTY car absent du lieu attendu ; jamais négatif ni copie du lot | I1 |
| T03 concurrence | deux intentions même tick sur dernier quantum | un seul gagnant ; cause de perdant explicite ; rotation reproduite à tick fixé | I1 |
| T04 connaissance | deux mondes cachés différents, mêmes vues et rngState | mêmes décisions ; différence seulement après observation/commit local | I1 |
| T05 enchaînement autonome | acteur éloigné, faim60, aucune commande joueur après départ ; source observée et accessible | MOVE puis TRANSFER puis INGEST sur ticks distincts, faim décroît après ingestion | I1 |
| T06 absence de solution | aucune ration, toutes sources connues vides | ni ration créée ni boucle interne infinie ; exploration/repos explicités | I1 |
| T07 échec atomique | porteur plein / source retirée avant commit, acteur local et énergie suffisante | CAPACITY / EMPTY selon cas ; aucun delta matériel, coût, ID ou révision ; pas de consultation distante cachée | I1 |
| T08 sauvegarde | interrompre après transfert, exporter/importer puis avancer 20 ticks | état final identique au parcours sans interruption à RNG identique | I1 |
| T09 format invalide | ID dupliqué, quantité négative ou zéro dans entities, lieu matériel orphelin, ledger faux, nextId≤ID actif ou mémorisé, version future | rejet avant mutation ; partie précédente intacte. Un ancien ID seulement mémorisé n’est pas un lieu matériel orphelin et doit rester admis | I1 |
| T10 bornes | 16 lots actifs positifs, toutes autres préconditions satisfaites ; source≥2, prélèvement partiel de 1 | CAPACITY : aucun quantum perdu, énergie/nextId/révisions inchangés ; aucune fusion ou suppression pour contourner la limite | I1 |
| T10-a transfert total à capacité | même compte de 16 lots, transfert total vers porteur ayant assez de place | succès si autres préconditions satisfaites, toujours 16 lots, même ID, coût1 et nextId inchangé | I1 |
| T11 coût causal | energy initiale connue, 1 mouvement puis repos | deltas -1 puis +6 plafonné, pas de perte double ; faim +2/tick tracée | I1 |
| T12 inspection | choix puis source prise par autrui | raison initiale inchangée ; résultat d’échec distinct, vérité/croyance consultables | I1 |
| T13 indépendance | ouvrir labo puis revenir application | anciennes clés de sauvegarde et fichiers main inchangés ; aucun chargement automatique du labo par index | I1 |
| T14 stockage bloqué | getItem/setItem lance exception | labo jouable en mémoire, message visible, export disponible | I1 |
| T15 obstacle | route connue puis objet bloquant ajouté | aucun pas illégal ; perception/réévaluation/détour sans omniscience | I2 |
| T16 ouverture | déplacer objet bloquant par deux transferts légaux | passage changé, quantités constantes, positions sauvegardées | I2 |
| T17 projet interrompu | 2 bois déposés, 2/4 travail ; faim interrompt | bois et workDone=2 persistent après reload ; pas d’abri actif | I3 |
| T18 reprise tierce | acteur B choisit reprendre même projet | 2 quanta supplémentaires → complete une fois ; aucun bois dupliqué | I3 |
| T19 projet concurrent | deux WORK à 3/4 | un succès, autre ALREADY_COMPLETE, pas de travail5/coût indu | I3 |
| T20 traces | contextes voisins et contradictoires | transfert imparfait et plafond respectés selon futur contrat C3, oracle à préciser | I4 bloqué |
| T21 divin | ajouter/retirer matière explicitement | ledger compense exactement, cause divine visible, mémoire distante non actualisée | extension |
| T22-a énergie nulle | TRANSFER valide par ailleurs, acteur local energy=0, source=2, q=1, porteur vide | NO_CAPACITY ; aucun mouvement, lot créé/retiré, coût, allocation ou révision ; énergie0, source2. Dans un tick, faim initiale10→12 indépendamment du refus | I1 |
| T22-b énergie exacte | même commande avec energy=1 | SUCCESS : energy0, source1, fragment porté1, bilan inchangé, un ID alloué ; aucun clamp nécessaire | I1 |
| T23-a recyclage sans saturation | un lot source de40, acteur local energy100 ; 20 cycles de TRANSFER partiel1 puis INGEST, commandes sur ticks distincts, autre acteur sans prélèvement | aucune erreur CAPACITY : 2 lots actifs au maximum, 1 après chaque ingestion ; source20, consumed20, porté0, énergie80 ; 20 IDs nouveaux distincts, retirés sans réutilisation ; nextId initial+20 | I1 |
| T23-b reprise des cycles | même parcours, sauvegarde après le transfert du cycle11 avant ingestion ; puis reprise et fin des20 cycles ; autre sauvegarde après ingestion11 | état final identique au parcours continu, y compris nextId, ledger, événements, connaissances et RNG ; aucun fragment réapparu ni place occupée par un vide | I1 |
| T23-c référence périmée | B observe lot L au lieu X puis s’éloigne hors portée ; A prend totalement L et l’ingère ; B garde observation/intention vers X/L ; sauvegarde/reprise | L absent de entities ; souvenir et intention de B non corrigés à distance, import autorisé sans recréer L. À réobservation de X vide : quantité0, IDs[], révision actuelle, étape vers L invalidée puis réévaluée | I1 |
| T23-d commande devenue périmée | commande locale déjà sélectionnée visant L, L retiré avant commit ; même essai avec acteur hors portée du lieu attendu | local : EMPTY sans coût ni mutation ; hors portée : NOT_REACHABLE sans renseignement sur L. L’échec ne prétend pas connaître toute la quantité du lieu | I1 |
| T23-e borne des traces | répéter observations au même lieu et purger le journal au-delà de256 événements par règles normales | une observation par (cellId,material), ≤16 IDs par observation, une intention, plan≤3, événements≤256 ; pas de table de lots supprimés ; ledger et nextId préservés après export/reprise | I1 |

Autonomie exigée : les fixtures donnent des conditions initiales, pas une séquence de commandes aux habitants. Les tests unitaires de primitives ne remplacent pas T05. T22 et T23-a/b sont des séquences de commandes de test de l’exécuteur, pas des preuves d’autonomie : l’énergie exacte1 peut légitimement conduire le décideur à préférer REST. T05 continue de vérifier la politique sans pilotage. Pour T23, initialisation du ledger=40 et aucune autre action matérielle ; la faim suit les ticks sans condition de faim minimale pour INGEST. Les sauvegardes ont lieu à frontière de tick ; deux passages à la même frontière peuvent servir de points de comparaison. Ne pas exiger une diversité d’histoires non spécifiée comme oracle.

## Trajectoire et portes de sortie
1. **I0 — revue documentaire** : valider P-A à P-E ; importer les originaux pertinents. Une validation partielle peut autoriser un labo mécanique sans attestation d’intégration C1–C4.
2. **I1 — tranche alimentaire isolée** : deux habitants, matière finie, transactions, perception, chaîne autonome, sauvegarde/export, inspection minimale. Tests T01–T14 (dont T10-a), T22-a/b et T23-a à T23-e. Aucun obstacle ni projet.
3. **I2 — obstacle persistant** : passabilité, BFS personnel borné et transport d’objet. T15–T16 ; mesurer coût navigation.
4. **I3 — chantier persistant** : un abri, dépôt et travail, interruption/reprise. T17–T19 ; bénéfice uniquement une fois complet.
5. **I4 — raccord C1–C4** : textes complets, adaptateurs biologiques, vraie consolidation T, événements/communication S et décisions dirigées. Sous-incréments séparés après revue.
6. **I5 — intégration application** : migration explicite, inspection divine exhaustive et stratégie stockage ; éventuel remplacement du moteur après preuve et décision distincte.

Chaque tranche doit être revue avant la suivante. Arrêter/resserrer si bilan faux, perte de sauvegarde, connaissance omnisciente, mécanisme ajouté sans effet observable, ou performance mesurée dépassant le budget décidé. Aucun budget mesuré aujourd’hui ; aucune extension automatique de population.

## Mesures à préparer (non réalisées)
Sur iPad cible, consigner modèle/iPadOS/Safari, build SHA, seed, population, nombres d’entités/projets, mode énergie et durée. Séparer temps simulation, perception/planification, rendu, save/load et taille JSON ; rapporter médiane/p95/max sur protocole fixe. Tester 2 puis 5 habitants, 1000 ticks logiques, interaction tactile pendant 5 minutes, 50 ouvertures/fermetures, verrouillage/reprise et erreur stockage. Fixer ensuite un budget acceptable avec l’utilisateur. WebKit Linux ne remplace pas cette mesure.

## Risques acceptables à faire valider
Stocks sans renouvellement impliquent épuisement final, pas un écosystème durable. Faim n’entraîne pas mort dans le labo. Repos restaure énergie sans bilan biologique interne ; c’est un adaptateur explicite. Une grille et deux matériaux ne réalisent pas G+. Pas de propriété sociale, aucune morale issue de l’arbitrage. Pas de promesse d’invention. Les historiques détaillés sont bornés, l’état courant ne l’est pas par dissimulation. Conserver le code actuel en parallèle crée une duplication temporaire à supprimer seulement après migration approuvée.

## Réaudit documentaire v0.2 — 14 novembre 2026
Révision de départ contrôlée : 7bc1edbaa50abe2ef7d8ecfaac189f4681e41fad ; PR6 toujours ouverte, même tête à la reprise, base docs/llm-project-memory. Arborescence complète inspectée, aucun AGENTS.md. Corrections documentaires seulement.

| Point | Vérification documentaire / raisonnement sur exemple | Résultat |
|---|---|---|
| Énergie TRANSFER | Précondition energy≥1, ordre de contrôle, refus NO_CAPACITY et invariant I-04 alignés avec T22 et prompt | Bloquant documentaire levé ; comportement réel non testé |
| Cas limite | Avec énergie0 : rien ne part ; avec énergie1 : coût1 laisse0. Faim+2 relève d’une phase distincte | Raisonnement manuel, pas simulation |
| Lots vides | Retrait à dernier INGEST, compte des actifs, total conserve ID, split crée un seul ID | Pas de place retenue par un vide dans le contrat |
| 20 cycles | Pour k de0 à20 : après ingestion, source=40-k, consumed=k, porté=0 ; avant ingestion suivante, un seul fragment supplémentaire | Maximum2 lots actifs, conservation40 ; exemple calculé, pas exécution de T23 |
| Saturation réelle | À16 lots actifs, split→17 refusé ; transfert total→16 autorisable | T10 renforcé, T10-a ajouté, aucun recyclage de matière |
| Subjectivité/reprise | Ancien ID autorisé en mémoire ; pas de mise à jour globale, nextId persistant et non recalculé | T23-b/c/d précisent l’oracle |
| Bornes | Sources par cellule/matériau, listes d’IDs, intention/plan et journal bornés ; aucun registre des retirés | T23-e ; la borne du compteur entier est contrôlée sans réemploi |
| Transmission | Liste I1 et tests actualisés ; I2, programmation sans autorisation et fusion exclus | Prompt dormant cohérent |

Verdict : **prêt pour soumission à Codex**, au sens dossier I1 cohérent pour examen et activation ultérieure explicite. Aucun blocage documentaire restant identifié pour ce laboratoire isolé. Ce verdict ne valide pas les propositions conceptuelles et n’autorise pas à programmer.
Les textes C1–C4 manquants, l’intégration complète, les performances et Safari physique restent des réserves inchangées, hors certification I1. Aucun classement F1–F4.
**Exécution réelle lors de cette correction : aucun test du laboratoire, aucune simulation et aucun test Node/navigateur relancé.** Les 35/35 historiques concernent seulement le moteur main audité précédemment. Les vérifications automatisées éventuelles du diff, des liens et des identifiants sont documentaires.
