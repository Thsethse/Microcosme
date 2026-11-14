# Audit factuel du moteur

## Méthode et portée
VÉRIFIÉ = constat par lecture au SHA indiqué, ou comportement exécuté explicitement signalé. INFÉRÉ = conséquence technique raisonnée, non mesurée. INCONNU = preuve absente. « À développer » qualifie une capacité candidate absente du périmètre inspecté ; « non démontrée » ne signifie pas impossible. Aucun classement F1–F4 attribué.

Arborescence récursive complète lue, non tronquée ; pas de AGENTS.md présent. Modules actifs lus : engine, cognition, storage, ui, interface, graphics, atmosphere, renderer, index ; package, workflow et tests consultés. preview-v08 et preview-v09 identifiés comme copies, non cibles d’intégration. Les originaux conceptuels absents ne sont pas reconstruits.

Liens de preuve ci-dessous figés sur main :

| Domaine | Constat VÉRIFIÉ par lecture | Limite / capacité absente |
|---|---|---|
| Monde | [engine.js](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L25) : 108 cases 12×9, grass/tree/field/home ; cinq habitants initiaux | Pas d’entités matérielles distinctes des types de terrain, ni quantités locales |
| Navigation | [move](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L60) : un pas, axe X puis Y | Aucun test d’obstacle ni recherche de chemin ; arbres traversables |
| Perception | [perceive](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L111) : rayon Manhattan 2, observations datées/révisées, personnes proches | Pas d’occlusion ; stock communal de bois diffusé à tous explicitement |
| Décision | [cognition](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/cognition.js#L35) : seuils faim/repos/stock/exploration, candidats issus de mémoire ; au plus trois choix comparables ; intention retenue et interruptions | Pas d’évaluation psychologique C2 complète ni planificateur général ; curiosity n’intervient pas dans choose |
| Exécution | [act](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L272) : eat/rest/farm/wood/explore ; récolte après arrivée et vérification terrain | Actions codées en branches ; pas de contrat générique, inventaire matériel, outil ou projet |
| Ressources | farm augmente p.food ; wood augmente s.wood ; manger diminue p.food et faim | Aucun prélèvement dans un stock fini ; s.food est un compteur communal distinct non débité pour manger |
| Concurrence | [step](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L327) parcourt les habitants en ordre de tableau | Exécution séquentielle, pas d’arbitrage explicite d’objets rares ni réservation |
| Biologie | faim bornée à 130 ; énergie à 0–100 ; perte horaire et coût travail, repos | Pas de L/M/S, bilan de matière, structures, blessure, maladie ou mort de faim ; ne réalise pas C1 |
| Expérience | [result](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L207) : compteurs par tâche/case, dernier résultat, révision et cause ; réussite influence classement | Ce n’est pas le modèle T de traces pratiques consolidées ; aucune acquisition de nouvelle interaction |
| Social | [encounter](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/engine.js#L162) : don conditionnel automatique selon faim, stock et kindness ; rencontres/confiance | Pas de communication S, objectifs envers autrui, norme, autorité ou organisation C4 |
| Temps | step = une heure, jour après 24h ; [ui](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/ui.js) : timer 600/rate ms, vitesses 1/2/4 | Pas de temps hors ligne calculé ni état sérialisé du générateur aléatoire |
| Persistance | [storage](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/storage.js#L89) : JSON normalisé version 7, clés microcosme-v03/v02, récupération corrompue, erreur stockage gérée | Type terrain et intentions en listes fermées ; plafond food=1000 ; ajouter des champs ne constitue pas une migration sûre |
| Inspection | [details](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/ui.js#L114) affiche besoin, intention, raison, connaissances et souvenirs limités | Pas d’inspection exhaustive de tous les constituants ni registre causal structuré |
| Intervention | [tap](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/ui.js#L55) change les cases, ajoute habitant avec limite 30 ; lois réglables | Écritures directes ; futurs objets/projets exigent invalidation et transactions divines explicites |
| Rendu | [renderer](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/renderer.js), graphics/atmosphere : Canvas 384×288, acteurs DOM, atlas limité à 30, visuel séparé du RNG moteur | N’implique ni matière physique ni simulation écologique |
| iPad | [interface](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/interface.js) : Pointer Events, zoom 1–3, dialogues ; pause en quittant scène Village ; rendu suspend ses mises à jour cachées | Le timer moteur n’est pas explicitement arrêté par visibilitychange ; Safari physique non exécuté dans cette mission |
| Hors ligne | Assets locaux et test après chargement ; aucune entrée service worker/manifest dans l’arbre inspecté | Rechargement à froid hors réseau non garanti |

## Exécutions réellement réalisées
Le 14/11/2026, Linux, Node **v24.22.1**. Copie locale des neuf fichiers nécessaires aux tests Node, obtenus au SHA fixé ; identité des blobs Git SHA-1 vérifiée pour chaque fichier. Aucun test existant modifié dans le dépôt.
- Commande : `npm test` (`node --test tests/*.test.js`).
- Résultat final : **35 tests, 35 réussis, 0 échec**, exit 0.
- Première préparation locale incomplète : 34/35, atmosphere.js manquant. Fichier source ajouté à la copie, puis 35/35 ; une vérification d’identité a retiré le seul saut de ligne supplémentaire de transport, puis 35/35 à nouveau. Aucun correctif moteur.
- Les tests couvrent notamment perception non omnisciente, destination transformée, intentions, migration et stockage indisponible, stabilité de population sur 2000 heures et rendu déterministe.
- Ce résultat n’est pas une mesure de performances. Les durées du runner ne sont pas des budgets iPad.
- Suite navigateur Chromium/WebKit **non exécutée** pendant cette mission ; elle est présente et configurée dans [tests/browser.cjs](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/tests/browser.cjs) et le workflow CI. Aucun résultat CI nouveau revendiqué.
- Safari iPad physique **non exécuté** ; protocole existant [VERIFICATION-IPAD](https://github.com/Thsethse/Microcosme/blob/3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479/docs/VERIFICATION-IPAD-v0.9.md). Une validation historique rapportée ne certifie pas le noyau candidat.

Trois sondes en mémoire, sans écriture de fichiers de production :
1. Deux habitants au même champ, food=0, faim=60, énergie=100 ; lois faim/social=0, bois=12. Après step : nourritures [2,2], case toujours field, stock communal food=20. Confirme création sans déplétion.
2. Arbre en case 1, départ 0 et travel vers 2 : position obtenue 1, sur tree. Confirme absence de collision matérielle.
3. food=1001 avant normalize : 1000 après. Un plafond historique serait une destruction silencieuse dans un futur bilan matériel strict.

## Safari : contraintes documentées, pas de plafond inventé
Les politiques WebKit décrivent quotas, échec et éviction du stockage ; elles ne garantissent pas la pérennité d’une partie. Source primaire : [WebKit, Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) (consultée le 14/11/2026). Ne pas convertir un quota d’origine en capacité garantie de localStorage. Proposition : erreur visible, export/import du laboratoire avant usage durable, puis évaluation IndexedDB si volume mesuré le justifie.
[WebKit, Power Usage](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/) motive réduction des timers et travail de fond. L’audit ne garantit pas une simulation continue en arrière-plan iPad : suspendre explicitement le laboratoire caché, reprendre sans rattrapage implicite est une proposition à tester.
INFÉRÉ : balayage perception O(N×108), rencontres O(N²) au pire, normalisation/sérialisation à chaque step risquent de coûter avec extensions. INCONNU : temps CPU, mémoire, énergie, population maximale et coût des projets sur l’appareil cible. La limite 30 est une règle du code, pas une limite Safari.

## Diagnostic d’intégration
Acquis réutilisables : frontière cognitive personnelle, intentions stables, validation à l’arrivée, injection de hasard, rendu séparé, garde-fous de sauvegarde. La frontière majeure manquante est un **exécuteur matériel unique** : une action doit transformer des quantités/objets localisés, et produire un résultat causal consommable par mémoire et inspection. Remplacer seulement les textes des tâches ne résout pas D1.
