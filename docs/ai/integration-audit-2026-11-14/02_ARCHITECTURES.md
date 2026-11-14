# Comparaison contradictoire — propositions non validées

Les trois paradigmes peuvent employer des stocks finis et des transactions. La persistance est une propriété du contrat, pas une vertu automatique de « l’émergence ».

## Évaluation transversale
| Critère | A — Catalogue prédéfini | B — Interactions élémentaires composables | C — Hybride recommandé |
|---|---|---|---|
| Monde requis | Propriétés propres à chaque tâche | Propriétés fonctionnelles partagées, lieux, contenus, contraintes | Même couche matérielle que B, petit vocabulaire initial |
| Préconditions/effets | Explicites mais souvent dupliqués par tâche | Un contrat par interaction, composition vérifiée | Contrats élémentaires + gardes des pratiques |
| Échec/conflit | Facile par tâche ; divergences entre tâches possibles | Transactions communes ; explosion de combinaisons invalides possible | Même arbitrage commun ; pratique interrompue sur résultat réel |
| Sélection/enchaînement | Priorités et séquences écrites ; prévisible | Recherche de séquences coûteuse ; nombreux moyens sans intérêt | Buts limités, pratiques candidates, recherche très bornée si nécessaire |
| Apprentissage | Pondérer choix/destination ; nouveaux verbes codés | Apprendre chaînes/contextes nécessite un mécanisme supplémentaire | Consolidation de traces contextuelles et réutilisation ; interface C3 à préciser |
| Persistance | Possible si objets/progrès explicites | Possible si transactions enregistrées ; pas automatique | État matériel et projet indépendants de l’intention individuelle |
| Social | Scripts de partage/conflit ; plafonnement rapide | Conséquences matérielles ouvertes mais aucune norme automatique | Résultats observables pour C4, sans confiance/morale automatique |
| Nouveaux usages | Seulement variations déjà prévues | Nouvelles combinaisons dans un espace déjà défini | Recombinaisons guidées par capacités, mémoire et objectifs accessibles |
| Risque principal | Multiplication des tâches et exceptions | Planification combinatoire, pseudo-physique, absence de motivation | Deux couches à maintenir et pratiques trop rigides |
| Quand le préférer | Démonstrateur minuscule aux buts fixes | Laboratoire spécialisé de recherche après preuve de coût | Progression jouable avec contrat matériel stable |

## Situation 1 — Alimentation
**A.** Monde : champ avec stock et ration en inventaire. Récolter exige proximité, stock≥1 et place ; retire 1 du champ, ajoute 1 au porteur. Manger exige ration portée compatible ; la retire et transmet l’apport au corps. Les priorités faim → champ → manger sont écrites. Source vide, trajet interrompu et dernier item disputé doivent être traités explicitement. Apprentissage : préférer un champ déjà utile ; l’état du stock persiste. Partage nécessite une tâche dédiée. Aucun usage alimentaire inédit sans règle d’éligibilité ajoutée.

**B.** Monde : lots, emplacement unique, capacité de transport et compatibilité d’ingestion. Approcher → transférer → ingérer. La quantité réelle est revalidée au commit ; une promesse n’est pas un repas. Un planificateur doit comprendre que déplacer un lot rapproche d’un apport ; la composition seule ne le fournit pas. La mémoire peut comparer contextes/effets si son apprentissage existe. Le lot partagé manque ensuite à autrui, sans ressentiment prescrit. Un matériau devient consommable uniquement si une compatibilité encodée l’autorise.

**C.** Même contrat B, pratique alimentaire initiale explicite ; le choix de source et son remplacement restent subjectifs. La pratique retient une destination tant qu’elle reste plausible, s’interrompt pour repos et reprend après observation. Le résultat alimente une trace, sans prétendre déjà réaliser C3. Découvrir un autre contenant connu pour le même aliment est une variation d’usage, pas l’invention d’une nouvelle propriété nutritive.

## Situation 2 — Épuisement d’une ressource
**A.** Chaque récolte décrémente un stock local, échec EMPTY à zéro ; règle écrite pour changer de source. Une régénération éventuelle doit débiter une source externe ou être assumée comme simplification. Concurrence résolue au prélèvement. Mémoire de quantité datée et sauvegarde du zéro nécessaires ; sinon retour infini ou repousse au rechargement. La pénurie peut réduire les dons, mais A ne produit pas une organisation nouvelle sans tâches supplémentaires.

**B.** Le transfert conserve les quantités de tous les lots. Deux agents veulent le dernier quantum : un seul obtient un commit, l’autre reçoit EMPTY/CONFLICT ; aucune dette négative. L’échec ne révèle pas les autres sources. Recherche bornée de moyens alternatifs, réobservation et mémoire d’échec contextuel évitent une répétition aveugle. La rareté est matériellement partagée, sa signification relationnelle reste subjective. Réutiliser une réserve abandonnée est possible si elle est connue, accessible et compatible ; aucun renouvellement spontané.

**C.** Pratique révisable par résultat, sans changer le moteur matériel. Source épuisée mémorisée dans sa révision, nouvelle observation permet réessai. Une boucle de secours finit en repos/exploration/attente explicite si aucune solution ne convient. Les déplétions persistent ; une politique sociale ne doit pas fabriquer de nourriture. Risque : exclusion définitive d’un lieu si l’échec est mémorisé sans contexte.

## Situation 3 — Obstacle matériel
**A.** Navigation avec passabilité et tâche « déplacer obstacle » particulière ; préconditions de force, destination libre et proximité. Effets : changement de position, coût et passage ouvert. Sinon contourner ou renoncer selon règles. Récolter ne doit pas contourner la collision. Apprendre le détour fonctionne, mais chaque autre type d’obstacle demande souvent une exception.

**B.** Une entité porte masse et encombrement ; transfert spatial possible si capacité suffisante. Un même déplacement peut libérer ou fermer un passage. Échec BLOCKED/TOO_HEAVY si destination occupée ou masse excessive. Le trajet projeté se base sur connaissances, le pas réel sur monde. Travail effectué persiste et peut gêner autrui ; aucun conflit moral automatique. Usage d’un objet comme obstacle découle de sa propriété bloquante, pas de son nom.

**C.** Pratique contourner d’abord ; déplacer si un déplacement réalisable est connu et évalué utile. Interactions communes aux objets transportables, positions et routes invalidées par révision. Mémoire pratique contextualisée, non bonus universel de « déplacement ». Proposition bornée : objets rigides occupant une case, aucun empilement, creusement ou mécanique continue. La compatibilité avec G+ demeure à vérifier sur son texte intégral.

## Situation 4 — Concurrence sur un objet
**A.** Prendre/donner/réserver codés ; un seul détenteur et contrôle au transfert. Une réservation sociale ne peut être confondue avec possession physique. Enchaînement : attendre ou autre cible selon règles. Mémoire doit distinguer objet absent et action ratée, sauvegarder détenteur et conflit. La réaction sociale est explicitement programmée, pas impliquée par un verrou.

**B.** Localisation exclusive + commit autoritaire ; deux prises ne produisent jamais deux objets. L’ordre des commits est causal et inspectable. Les choix utilisent la même photographie de début de tick, les commits revalident le monde courant. Apprentissage des disponibilités possible, sans connaissance de la psychologie adverse. Échanger nécessite deux consentements et transaction adaptée ; exclu initialement. Une transaction informatique n’est pas un droit de propriété.

**C.** Même arbitrage B ; pratique attendre/réévaluer, sans confiscation automatique. Rotation du premier acteur pour éviter priorité permanente des petits identifiants, sans garantir équité sociale. Les témoins reçoivent seulement les résultats perceptibles ; C4 peut interpréter selon ses propres relations et attentes. Rechargement conserve ordre/temps et détenteur ; il ne remet pas l’objet au sol.

## Situation 5 — Construction interrompue
**A.** Tâche construire avec recette, matériaux et progression persistante ; retraite/reprise explicites. Si la progression n’existe que dans p.intention, la disparition du bâtisseur détruit le chantier : défaut à proscrire. Échec si matériaux manquent ou place bloquée. Une autre personne peut reprendre seulement si la tâche le permet. Apprentissage limité à cette construction ; nouvelle forme requiert nouvelle recette.

**B.** Déposer → assembler par quantum → structure ; chaque étape immobilise de la matière et transforme un état persistant. Projet distinct du travailleur, progression calculée à partir du travail réellement commis. Un second agent peut contribuer sans plan collectif, s’il sait quoi faire et le veut. Pas de matière dupliquée à reprise ; aucun travail gratuit après interruption. Le problème difficile reste la sélection d’une structure utile, que les verbes n’inventent pas.

**C.** Un seul prototype de structure connu, pratique conditionnelle, projets consultables. Urgence suspend l’intention mais laisse matériaux et travail. Autre acteur peut reprendre par décision individuelle ; ni recrutement automatique ni objectif collectif partagé. Les traces pratiques portent sur réalisation/contextes, non sur propriété du projet. Nouvelle configuration possible dans des règles d’assemblage données ; nouvelle recette autonome et stabilité physique restent non démontrées.

## Choix proposé et contre-épreuve
Recommander C pour rendre D1 testable sans développer un système universel de planification. A est suffisant pour le premier incrément alimentaire à condition que ses actions passent déjà par les contrats communs. B reste une alternative si un prototype démontre qu’une recherche bornée apporte des usages utiles sans dépasser le budget.

Réfuter C si chaque nouveau cas exige un nouveau verbe arbitraire, si les pratiques bypassent les préconditions, si la matière change pour satisfaire un scénario, ou si l’habitant ne peut modifier son enchaînement après un échec. Le noyau est un laboratoire de mécanismes, pas une preuve que tous les comportements C1–C4 émergent.

Trois niveaux à ne pas confondre : choix de paramètres d’une pratique connue ; nouvelle séquence d’interactions connues ; découverte d’une nouvelle loi ou fonction. Le noyau vise les deux premiers progressivement. Le troisième n’est ni promis, ni démontré.
