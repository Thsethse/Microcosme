# Rapport v0.8

## Livraison

Cinq scènes sans framework, état moteur partagé, pause/reprise déterministe hors Village. Fenêtres modales natives réutilisables, fiche instantanée, confirmation de remplacement, paramètres et information sur le stockage empilables. Rendu CSS original de type pixel art, personnages animés et sélection visible. Caméra tactile avec zoom 1–3, glissement, recentrage et suppression des clics après geste.

Le moteur, la cognition, le stockage et leurs tests Node sont conservés sans changement. La création manuelle d’habitants garde sa confirmation native v0.7. Aucune mécanique supplémentaire, dépendance de production, IA ou requête réseau du jeu. Nouvelle partie garde la protection des sauvegardes bloquées de v0.7 : elle ne contourne pas une impossibilité de sauvegarder la copie de récupération.

## Vérifications du 11 novembre 2026

- 31 tests Node réussis : cognition, règles, stabilité des identités, stockage et migrations.
- Parcours navigateur v0.7 conservé, adapté seulement au menu et à la confirmation personnalisée de redémarrage ; contrôles v0.8 ajoutés dans le même parcours.
- Chromium et WebKit Linux : navigation sans mutation, sélection conservée, pause et reprise, contenu de fiche figé, fermeture Échap et retour du focus, empilement de deux dialogues, annulation de nouvelle partie, zoom, glissement avec outil actif, séquence Pointer Events de pincement, portraits/paysages 820×1180 et 1180×820, mouvement réduit, restauration et fonctionnement hors réseau après chargement.
- CI GitHub Actions existante : `npm ci`, tests Node, installation Chromium et WebKit avec dépendances, puis parcours complet. Aucun filtre de navigateur en CI.

Pour exécuter localement : `npm ci`, `npx playwright install --with-deps chromium webkit`, `npm test`, `npm run test:browser`. `BROWSERS=chromium` ou `BROWSERS=webkit` sélectionne un moteur. Dans l’environnement cloud de cette mission, les bibliothèques WebKit manquantes ont été extraites localement depuis Debian, sans modifier le système ; la validation préalable des bibliothèques globales a été désactivée pour ce lancement, puis le véritable navigateur et ses assertions ont tourné.

## Limites et performances

La carte est bornée à 108 cases et 30 habitants, sans boucle de rendu permanente. Les scènes/fenêtres utilisent des transitions courtes ; la fermeture des fenêtres est immédiate pour privilégier le focus. La carte n’a ni inertie ni zoom centré sous les doigts ; ces simplifications réduisent la complexité tactile. La caméra ne se sauvegarde pas. Les cases à zoom 1 peuvent être plus petites que 44 px sur un petit écran ; boutons principaux de 44 px minimum et zoom disponibles.

Mesure indicative Chromium headless, cinq habitants, 108 cases, cinq séries de 100 appels synchrones à `render()` : 12, 10, 9, 11 et 8 ms dans cet environnement Linux. Cette mesure exclut la peinture et la composition et ne constitue pas une mesure de fluidité Safari : la fréquence réelle, la consommation et les gestes iPad restent à vérifier sur matériel physique. Aucun iPad physique testé. Les tests de pincement par événements synthétiques vérifient les gestionnaires ; ils ne certifient pas les gestes du système. Pas de démarrage hors ligne garanti : seule l’utilisation après chargement est couverte.

La PR doit être revue et validée avant toute fusion ; aucun changement direct à main.
