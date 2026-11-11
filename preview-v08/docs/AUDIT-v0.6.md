# Audit et consolidation v0.6

Base auditée : `a30943a44663540a9d8fdc6a4b4c2f8f2da9f3aa` (v0.5).

## Défauts corrigés

- Moteur, interface, stockage et hasard étaient imbriqués dans un script compact. Extraction en trois fichiers lisibles ; générateur aléatoire injectable. La séparation est progressive : les interventions divines restent orchestrées dans l’interface.
- Le repos recalculait sa maison à chaque heure : conservation de la maison choisie tant qu’elle existe. Les seuils de faim, repos et production restent ceux de v0.5.
- Déplacement sans validation de destination : rejet des cases hors carte et des valeurs non entières. Les trajets agricoles et forestiers existants sont conservés, avec vérification du type de terrain et préemption par les besoins prioritaires. Les tests verrouillent ces comportements auparavant non testés.
- Le souvenir de récolte manquait lorsque le champ était atteint dès le premier déplacement : création cohérente dans les deux chemins.
- L’exploration effaçait toutes les visites après un tour complet : conservation de l’historique, puis choix parmi les autres cases sans ajouter de mécanique.
- L’inspecteur initialisait réserves et personnalité de façon aléatoire : préparation dans le moteur à la création, à la reprise et à l’ajout d’un habitant ; consultation sans mutation.
- Validation des sauvegardes limitée à deux propriétés : validation de la carte, identités et positions ; normalisation des anciens champs manquants, limites des lois et mémoires ; copie de récupération du JSON invalide avant réinitialisation. La clé v02 reste intacte.
- Échecs de stockage silencieux : message visible, partie poursuivie en mémoire ; accès à `localStorage` lui-même protégé.
- Noms et événements chargés injectés par `innerHTML` : échappement du texte.
- Les acteurs interceptaient les outils divins sur les cases occupées : routage du clic selon l’outil actif. Rafraîchissement de la sélection sur la carte.
- Transition fixe trop longue aux vitesses ×2 et ×4 : durée proportionnelle à la cadence ; éléments acteurs conservés entre les rendus.

## Résultats et portée

15 tests Node : population/identités sur 2 000 heures, trajets agricoles et forestiers, interruption par la faim, terrain transformé, repos, exploration, visites, perception, partage réciproque, limites de carte, migration et aller-retour des sauvegardes, données invalides et stockage inaccessible.

Parcours Chromium avec viewport tactile 820 × 1180 réussi : 108 cases, habitants, inspecteur sans mutation, conservation des éléments animés, outils arbre/culture/habitant, lois, vitesse, temps automatique/pause, rechargement, échappement du nom et réinitialisation. Ce parcours est automatisé aussi pour WebKit dans la CI. Dans l’environnement local, le téléchargement de WebKit a réussi mais son lancement est bloqué par les bibliothèques système manquantes (GTK4, Graphene, HarfBuzz ICU, Manette, Hyphen, GLESv2). Aucun résultat WebKit local n’est revendiqué.

## Limites conservées volontairement

- Aucun décès, naissance automatique, obstacle ou nouvelle ressource. La faim peut monter à 130 sans décès : règle existante, pas une régression de population.
- Le stock global de nourriture affiché ne correspond pas aux réserves personnelles consommées ; il est conservé pour compatibilité, sans inventer une économie.
- Récoltes non épuisables et priorité bois sous 12 : règles existantes. Une exploration peut être interrompue par ces priorités ; ce n’est pas un chemin aléatoire recalculé à chaque heure.
- Une carte, un identifiant ou une position irrécupérable entraîne le rejet de cette sauvegarde complète, plutôt qu’une suppression silencieuse d’habitants. La copie brute reste disponible dans le stockage du navigateur.
- La simulation reste à pas horaires ; Safari peut suspendre les minuteries en arrière-plan. Aucun rattrapage du temps réel ajouté.
- Pas de test sur appareil iPad réel ni de déploiement Pages depuis la branche de travail. Après fusion manuelle, vérifier sur Safari iPad : chargement sous `/Microcosme/`, animation aux trois vitesses, outils sur une case occupée, reprise d’une partie et retour d’arrière-plan. WebKit Linux automatisé ne remplace pas ce contrôle matériel.
