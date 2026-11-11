# Rapport v0.7

Base : `9308cea531399283f36fd6a4445fb4bbc2767f8c` (v0.6 fusionnée). Branche : `codex/microcosme-v0.7`. Aucun changement direct de `main`, aucune fusion ni publication demandée par le code.

## Livraison

- Décision pure dans `cognition.js`, indépendante de la carte réelle ; moteur et interface conservent leurs responsabilités.
- Perception locale de tous les terrains, mémoire datée et révisable, intentions persistantes, anticipation limitée de fatigue et apprentissage par résultats.
- Migration v02/v03/v0.6 sans création de connaissances cachées ; conservation des identités et relations. Validation du nouveau schéma et mêmes protections de récupération.
- Inspecteur lisible par lignes et journal individuel limité, alimentés par les décisions réelles. Outil Prairie pour reproduire la disparition manuelle d’un champ.
- Règles détaillées : [DECISIONS-v0.7.md](DECISIONS-v0.7.md). Contrôle sur appareil : [VERIFICATION-IPAD-v0.7.md](VERIFICATION-IPAD-v0.7.md).

## Vérifications

- **31 tests Node réussis** : les 15 cas v0.6 sont conservés et 16 cas v0.7 ajoutés. Les anciennes préparations de trajet fournissent désormais une observation explicite, au lieu d’indices dépourvus de nature. Le test d’une destination transformée attend sa visibilité avant d’exiger son abandon : l’attente d’un abandon omniscient serait contraire à la mission.
- Champ disparu : connaissance initiale d’un champ, éloignement, transformation en prairie hors de vue, retour vers le souvenir, aucun changement de connaissance avant portée locale, puis révision, échec et exploration.
- Autres preuves : décideur testé avec carte réelle dont toute lecture lève une exception ; plusieurs solutions plausibles et hasard reproductible ; stabilité devant une meilleure alternative ; découverte pertinente, urgences, anticipation ; réussite et échec ; aller-retour complet des mémoires et intentions ; migrations ; population sur 2 000 heures et quatre autres mondes déterministes.
- **Parcours Chromium tactile local réussi** sous `/Microcosme/` : fonctions v0.6, expérience du champ disparu avec l’outil Prairie, inspecteur sans mutation, explications du moteur, reprise des nouvelles mémoires, jeu hors ligne après chargement.
- WebKit local tenté : lancement bloqué par bibliothèques système absentes (GTK4, Graphene, HarfBuzz ICU, Manette, Hyphen, GLESv2). La CI existante installe ses dépendances et exécute Node, Chromium et WebKit ; son résultat sur la branche est suivi dans la Pull Request.
- Aucun test physique Safari iPad revendiqué.

## Limites

Mémoire sans oubli naturel : les dates indiquent l’ancienneté, sans révéler si une case distante a changé. La carte ne contient pas d’obstacles ; tous les trajets sont accessibles en distance de Manhattan. L’adaptation reste une comptabilité explicite de résultats par action/lieu, sans modèle psychologique ou apprentissage statistique. La personnalité et les règles sociales existantes sont conservées sans nouveau mécanisme.

Le compteur de bois communal reste public comme auparavant. Les autres connaissances de terrain sont individuelles. Les compteurs d’expériences sont bornés structurellement à quatre actions × 108 lieux, les terrains à 108 entrées et le journal à douze événements. Les relations ne disparaissent pas.

Pas de synchronisation entre onglets, de rattrapage du temps d’arrière-plan ni de garantie de premier chargement hors ligne. Les transformations divines peuvent remplacer un terrain, y compris une maison, comme les outils précédents ; les habitants concernés le découvrent localement. Les sauvegardes plus anciennes que v0.7 n’ont pas assez d’information pour reconstruire la nature passée de tous les lieux : la redécouverte est volontaire et documentée.
