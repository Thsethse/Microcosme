# Cheveux et accessoires : séparation réelle

Les objets sont exclus de tous les comptes de cheveux. Ils peuvent devenir des objets fabriqués dans une conception future de Microcosme ; le générateur actuel n’implémente pas cette fabrication ni un équipement. Aucun objet n’a été supprimé du code pendant l’audit.

## Résultat technique

**56 choix** émettent des tracés d’accessoires dans des calques séparés quand ils sont activés. Tous ces calques sont vides quand l’option est désactivée. En plus, **trois choix historiques P4** contiennent **quatre traits de liens incorporés aux chemins de cheveux** : 10 (deux), 12 (un), 17 (un). Les deux ensembles sont disjoints ; 59 choix portent donc au moins un objet identifié dans le rendu normal.

Les P5 utilisent `accessories`, `backAccessories` et, pour les capuches F, `cover` (rendu `accessories-cover`). Masques de cheveux et pièces d’accessoire ne sont pas confondus. Les calques de contraste coloré ne sont pas des objets.

| Objets actuellement représentés | Principales références | Séparation actuelle |
| --- | --- | --- |
| Liens de queue/natte/chignon | 10, 12, 17 ; 23-D, 24-G/D ; 29-D, 32, 35 ; 37-D, 39-D, 40-D, 41, 42, 45 ; 52/53/55 ; 60 ; 63-D ; 64, 67, 69-D, 70-G | Séparés dans P5 ; exceptions P4 détaillées ci-dessous |
| Perles, manchons, bagues de brins | 30-D, 31-D, 33-D, 35, 40-D, 45, 52, 53, 55, 57, 64-D, 69-D, 71-D | Calques d’objets ; la tresse/cylindre reste un cheveu |
| Fleurs, rubans et feuilles | 33-G/D, 34-D, 36-G, 54, 58-G, 61-D | Séparés, sans nouvelle racine de cheveux |
| Diadème et parures frontales | 35-D, 36-D, 57-G/D, 59-D, 70-D, 71-D | Séparés ; distincts d’une couronne **tressée**, qui est du cheveu |
| Épingles/baguettes | 56-D, 61-G/D, 68-D | Accessoires arrière, parfois masqués au milieu par le volume du chignon |
| Bandeaux/bandes de cheveux attachés | 29-D, 54, 55-D, 57, 58-D, 59-D, 63-D, 64, 65-G, 69-D, 70 | Pièces séparées ; quelques liens sont visuellement proches de la chevelure mais ne sont pas comptés |
| Lunettes de tête et plume | 54-G, plume en 54-D | Séparées ; pas de lunettes importées dans les F, conformément à I6 |
| Foulard/tissu noué | 63-G, 67-D | Séparés ; leurs contours ne révèlent pas la coupe cachée |
| Capuche | 66-G/D | Fond et bordure séparés des fragments de cheveux et des nattes avant |

Cette table décrit les types ; le [relevé par choix](data/capabilities.json) donne les comptes de tracés réellement observés. Un objet complexe peut avoir plusieurs chemins : ce n’est pas un inventaire d’objets équipables ni une quantité d’objets biologiques.

## Liens historiques incorporés

Dans `base/p4-render.mjs`, `braid()` ajoute un trait terminal de largeur **3,3** directement à `lengths`. Cela concerne les deux nattes de 10 et la natte de 17. La queue de 12 ajoute à `back` un trait de largeur **4** au point d’attache. Le sélecteur d’accessoires ne les détache pas ; monochrome ne les retire pas.

Pour la comparaison de cheveux, les outils retirent **uniquement ces quatre traits identifiés des copies SVG d’audit**, jamais des fichiers du prototype. Le corps, la peau, les nattes et les queues restent inchangés. La recette 24-D déplace déjà son lien de queue dans `backAccessories` ; après exclusion des objets, ses cheveux sont exactement ceux de 12. Sans cette extraction documentée, l’objet incorporé aurait fabriqué une fausse différence technique.

## Objets, inconnues et diversité

- 63-G est un foulard, pas une coupe à ajouter au nombre de cheveux : aucun contour capillaire connu.
- 66-G/D et 67-D ont des parties visibles conservées. Retirer le tissu ne révèle pas une chevelure complète ; les clips d’ouverture restent dans l’analyse des fragments.
- Les couronnes tressées de 28, 59, 64, 71 et 72 restent des cheveux. Les diadèmes/feuilles sont retirés. Une natte reste une natte sans son manchon.
- Les peintures, barbes, bijoux d’oreille, lunettes de visage et vêtements des posters ne deviennent pas des différences de coiffure. Leur absence n’est pas comptée comme une perte de diversité capillaire.

Toute séparation future des quatre liens P4 ou conception d’objets fabriqués demande une décision et une mission distinctes. Cet audit n’ajoute aucun système d’équipement.
