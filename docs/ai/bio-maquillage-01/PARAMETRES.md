# Paramètres de BIO-MAQUILLAGE-01

Les cinq familles utilisent les mêmes 32 pigments. Les pourcentages sont saisis de 0 à 100, par pas de 1 dans l’atelier. Les mesures géométriques effectives sont exprimées dans le repère SVG du visage. Elles suivent la morphologie et les réglages anatomiques du personnage. Les détails du visage conservent leurs réglages lorsque le maquillage est masqué, retiré ou réinitialisé.

| Famille | Contrôles et valeurs effectives |
| --- | --- |
| Lèvres | L’intensité règle l’opacité. La couverture règle l’aire pigmentée, jusqu’à toute la surface disponible. La couleur et l’épaisseur du contour s’appliquent à l’intérieur du bord des lèvres. Pour chaque lèvre, le trait visible atteint au plus 60 % de son volume de référence. La couture de la bouche est réservée. La bouche historique suit son tracé et ses commissures d’origine. |
| Fard à paupières | L’étendue sélectionne une fraction de l’arc supérieur. La concentration externe décale la plage et réduit le pigment vers l’intérieur. La hauteur utilise jusqu’à 14,5 % du rayon vertical de la tête, dans l’espace disponible sous le sourcil. La couleur secondaire facultative apparaît vers l’extérieur. Une étendue ou une hauteur nulle suspend le fard. |
| Eyeliner | L’épaisseur maximale hors de l’ouverture vaut 5,9 % du rayon vertical de la tête pour le trait supérieur et 67 % de cette valeur pour l’inférieur. Les traits suivent le bord extérieur du contour naturel. La pointe utilise la place réellement disponible dans son inclinaison de −45 à +45°. Son extension horizontale est au plus 29 % du rayon horizontal de la tête. Une longueur nulle suspend l’inclinaison. |
| Fard à joues | La position horizontale déplace les centres à 16,8–31,6 points du milieu de la surface cutanée. La position verticale les déplace entre les rangées cutanées 57,2 et 72,2. L’étendue règle les rayons du dégradé entre 17 et 43 % du rayon horizontal et entre 5,8 et 17,2 % du rayon vertical de la tête. La diffusion règle la pente de la transition vers le bord transparent. |
| Peintures faciales | L’atelier accepte jusqu’à 36 éléments. L’ordre va de l’arrière vers l’avant. Le miroir replie la position horizontale et la transformation autour du milieu de la surface. Il est indisponible si la copie centrée coïncide avec l’original. |

## Peintures faciales

- Les coordonnées éditées de 0 à 100 correspondent à la plage 7–93 sur l’axe horizontal et 11–94 sur l’axe vertical du repère cutané hérité. Ce repère suit le contour et les repères verticaux de la tête. Le toucher et les curseurs utilisent les mêmes coordonnées.
- Le point a un rayon effectif d’environ 0,32 à 1,42 unité SVG. Pour les autres formes, le rayon de transformation va de 12 à 50 % du minimum entre 78 % du rayon horizontal de la tête, 68 % de son rayon vertical et 64 % de la largeur locale de la peau. Le contour du visage conserve son liseré. Les surfaces réservées peuvent entraîner un découpage de la forme à leur contact.
- L’allongement va de ×1 à ×2,35 sur l’axe local horizontal, puis la rotation de −180° à 179° oriente la forme dans le plan. Ces paramètres sont inapplicables au point. Un cercle ou un anneau non allongé reste identique quand il tourne. Certaines figures ont une périodicité de 180°.
- L’épaisseur est utilisée par l’anneau, la ligne, la bande, le croissant, l’arc, la vague et le zigzag. Elle vaut de 0,064 à 0,49 unité du repère de la primitive avant transformation. La bande convertit cette mesure en hauteur pleine. Le croissant ajuste la courbe intérieure.
- L’intensité nulle suspend la peinture. Les paramètres temporairement inapplicables restent en mémoire et retrouvent leur effet lorsque la forme, l’intensité ou le contexte redevient pertinent.

## Sauvegarde et relecture

Le document d’apparence v10 conserve les demandes, les valeurs géométriques effectives et les réglages hérités. Le retrait global conserve les valeurs latentes. La réinitialisation d’une famille efface uniquement ses réglages. La comparaison de l’atelier propose le visage courant avec la couche de maquillage retirée ou les détails historiques.

La composition autonome `microcosme.makeup` v1 conserve uniquement les cinq familles et les éléments ordonnés. La bibliothèque locale l’enregistre par nom. Son export JSON permet de la déplacer entre navigateurs ou de la réappliquer à un habitant d’une autre morphologie. Le tirage utilise le générateur déterministe existant, avec une graine dédiée. L’archive conserve les valeurs issues du tirage pour les reproduire à froid.

[Télécharger le contrat](CONTRAT.md)
