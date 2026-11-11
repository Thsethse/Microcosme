# Validation Safari sur iPad physique — v0.8

Statut : à réaliser par un testeur disposant d’un iPad. WebKit Linux ne valide ni les gestes ni les performances d’un appareil physique.

Relever modèle, version iPadOS/Safari, URL et SHA testés, orientation, réglage Réduire les animations et résultat de chaque étape. Tester sur une prévisualisation statique de la branche ; aucune fusion nécessaire pour valider.

1. Avec une sauvegarde v0.7 existante, ouvrir la page : menu, Continuer, mêmes identités, ressources, lois, intentions et souvenirs. Sans sauvegarde, Continuer est désactivé ; Nouvelle partie puis confirmation ouvre le Village.
2. Lancer le temps ; sélectionner un habitant. Ouvrir Habitants, lire besoins, intention, mémoire et relations ; attendre 10 secondes. Le temps ne doit pas avancer. Passer par Chroniques et Lois ; revenir Village : même sélection, reprise du temps. Refaire avec le temps arrêté : aucune reprise.
3. Ouvrir une fiche dans Village pendant le temps automatique : le monde peut avancer, mais le texte de la fiche reste l’instantané d’ouverture. Fermer par bouton, toucher extérieur et Échap avec clavier matériel. Vérifier focus visible et absence de touche traversant le fond.
4. Menu → Paramètres → À propos des sauvegardes : deux fenêtres. Fermer la supérieure, retrouver la première, puis le déclencheur. Avec VoiceOver, vérifier annonce du titre, navigation limitée au dialogue et retour au bouton.
5. Nouvelle partie : annuler avec Fermer, Échap, puis toucher extérieur (ce dernier ne doit pas fermer). Vérifier aucune perte. Confirmer ensuite : cinq habitants, nouveau monde, sauvegarde remplacée.
6. Choisir Arbre, zoomer avec +/− puis pincer. Glisser à un et deux doigts, y compris au départ d’un personnage ; aucun terrain ni habitant ne doit être ajouté par le geste. Un toucher bref doit toujours appliquer l’outil. Tester annulation par geste système et sortie du doigt hors carte.
7. Observer, toucher un personnage puis une case ; vérifier sélection et destination. Essayer tous les outils existants et la confirmation d’ajout d’habitant. Après déplacement animé, toucher à nouveau le personnage.
8. Alterner portrait/paysage à zoom maximal ; recentrer. Vérifier absence de débordement horizontal, carte accessible, boutons et curseurs utilisables au doigt. La carte est volontairement plus petite qu’un écran complet ; les cases agrandissent avec le zoom.
9. Changer les trois lois, quitter Village, recharger : moteur sauvegardé, menu et temps arrêté. Tester aussi stockage privé/quota : message visible, page utilisable, sauvegarde protégée selon les règles v0.7.
10. Après chargement complet, activer le mode avion sans recharger : parcourir les cinq scènes, ouvrir les fenêtres, faire avancer et sauvegarder. Un démarrage/rechargement hors ligne n’est pas garanti (pas de service worker).
11. Réduire les animations dans iPadOS : vérifier absence de transition de scènes/fenêtres/personnages. Sinon, suivre les mouvements aux vitesses ×1, ×2, ×4 pendant cinq minutes ; relever saccades, chaleur et latence des gestes avec 5 puis 30 habitants.

Consigner les anomalies avec étapes et capture ; ne pas déclarer la validation physique réussie sans ces essais.
