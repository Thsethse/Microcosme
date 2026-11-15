# Paramètres T3-A

P1 s’applique aux valeurs finales ; P2 fournit les références. Tous les contrôles sont indépendants des fonctions reproductives.

|Clé|Libellé|Min|Référence P1|Max|
|---|---|---|---|---|
|globalSize|Taille globale|0.75|1|1.3|
|headHeight|Hauteur tête|0.8|1|1.2|
|headWidth|Largeur tête|0.75|1|1.3|
|trunkLength|Longueur tronc|0.8|1|1.25|
|armLength|Longueur bras|0.8|1|1.2|
|legLength|Longueur jambes|0.8|1|1.25|
|shoulderWidth|Largeur épaules|0.75|1|1.35|
|pelvisWidth|Largeur bassin|0.75|1|1.35|
|thoraxDepth|Profondeur thorax|0.75|1|1.35|
|muscleVolume|Volume musculaire|0|0.5|1|
|breastVolume|Volume mammaire|0|0.5|1|

Profils P2 exacts :

```json
{
  "M": {
    "shoulderWidth": 1.15,
    "pelvisWidth": 0.9,
    "thoraxDepth": 1.1,
    "muscleVolume": 0.65,
    "breastVolume": 0.05,
    "trunkWidth": 1.1
  },
  "F": {
    "shoulderWidth": 0.9,
    "pelvisWidth": 1.15,
    "thoraxDepth": 1,
    "muscleVolume": 0.4,
    "breastVolume": 0.65,
    "trunkWidth": 0.95
  },
  "T": {
    "shoulderWidth": 1.05,
    "pelvisWidth": 1.05,
    "thoraxDepth": 1.05,
    "muscleVolume": 0.5,
    "breastVolume": 0.5,
    "trunkWidth": 1
  }
}
```

La largeur de tronc P2 reste un caractère initial fixe par catégorie dans ce lot ; aucune borne supplémentaire inventée. Les autres valeurs P2 sont les valeurs initiales effectives des paramètres P1 correspondants. Voir DECISIONS-IMPLEMENTATION.md pour le référentiel, les ratios techniques et la composition retenue.
