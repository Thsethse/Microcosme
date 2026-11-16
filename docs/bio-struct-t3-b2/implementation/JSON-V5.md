# JSON v5

Le schéma `microcosme.bio-struct-t3-a` devient version 5. Il conserve graine, catégorie, fonction, paramètres demandés/appliqués, corrections, morphologies, finition R3 et réglages B1. Il ajoute `requestedGroomingSettings`, `groomingSettings` et `groomingCorrections`. Les racines, polygones, stries et projections sont recalculés depuis ces données ; ils ne dépendent ni de l'heure ni d'un tirage aléatoire global.

`hairLength` : bald/short/medium/long/veryLong ; `hairTexture` : smooth/straight/frizzy/curly ; `hairFamily` : masculine/feminine/mixed ; `hairCut` : swept/crop/parted/layered/balanced/asymmetric ; `hairColor` : #rrggbb.

Pour chaque préfixe moustache/beard/sideburns : Present booléen, Size nombre fini [0,1], Color #rrggbb. Chaque couleur est indépendante, y compris de la couleur des poils corporels R3, des sourcils, des iris et des lèvres. Les présences sont indépendantes de la longueur des cheveux.

Les valeurs hors bornes restent dans la demande ; leur application limitée est tracée N2. Champs inconnus, enums invalides, tailles non finies et couleurs incorrectes sont refusés sans remplacer le personnage précédent. Les contradictions demande/application ou les modifications des données corporelles/faciales v5 sont refusées.

L'import F assainit toute demande de pilosité faciale, y compris une présence interdite seulement dans les réglages appliqués d'un v5 manipulé : les demandes interdites sont tracées et les rapports F sont recalculés. Les autres paramètres restent inchangés. Aucun sélecteur facial n'est visible ou actif pour F.

Les versions 1 à 4 migrent explicitement vers v5 : règles R3/B1 antérieures conservées (anciens bassins/têtes retirés), nouveaux réglages chauves et sans pilosité faciale par défaut. Les champs capillaires annexes reconnus dans un ancien JSON sont normalisés, avec désactivation explicite pour F. Une trace de migration est exportée. Les profils T2 ne sont pas convertis automatiquement.
