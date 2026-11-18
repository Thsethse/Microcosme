# MICROCOSME — BIO-VEC-STD-01
## Standard de coordonnées vectorielles — tête masculine adulte, face et profil
**Version 0.1 — standard d'essai pour Codex ; proportions artistiques non validées.**

### Objet et repères
Un générateur SVG procédural de personnages, sans portraits préfabriqués. Les données du fichier `BIO_VEC_STD_01.json` sont la source de vérité ; ne pas recopier les valeurs dans le code.
Coordonnées X/Y en % depuis le coin haut-gauche. Les sous-rectangles sont `[x,y,largeur,hauteur]` dans leur parent, et leurs points internes `[x,y]` dans leur propre rectangle.
Référence adulte : 5,5 têtes ; tête = 18,1818 % de la hauteur corporelle ; ratio provisoire du canevas 0,70739 ; rectangle tête de face dans le corps [40.36,0,19.28,18.1818]. Profil orienté vers la droite ; X représente la profondeur.

### Rectangles canoniques — face
| Élément | X | Y | L | H |
|---|---:|---:|---:|---:|
| `skull` | 24 | 0 | 52 | 100 |
| `face` | 27 | 18 | 46 | 82 |
| `brow_left` | 32 | 42 | 16 | 6 |
| `brow_right` | 52 | 42 | 16 | 6 |
| `eye_left` | 31 | 48 | 17 | 9 |
| `eye_right` | 52 | 48 | 17 | 9 |
| `nose` | 43 | 55 | 14 | 22 |
| `mouth` | 36 | 79 | 28 | 10 |
| `ear_left` | 19 | 48 | 10 | 23 |
| `ear_right` | 71 | 48 | 10 | 23 |
| `jaw` | 30 | 69 | 40 | 28 |
| `chin` | 42 | 90 | 16 | 10 |
| `hairline` | 27 | 15 | 46 | 17 |

### Rectangles canoniques — profil
| Élément | X | Y | L | H |
|---|---:|---:|---:|---:|
| `skull` | 20 | 0 | 57 | 100 |
| `face` | 43 | 18 | 42 | 82 |
| `brow` | 69 | 43 | 11 | 6 |
| `eye` | 69 | 49 | 11 | 8 |
| `nose` | 74 | 54 | 20 | 23 |
| `mouth` | 72 | 79 | 15 | 10 |
| `ear` | 36 | 49 | 17 | 23 |
| `jaw` | 46 | 69 | 34 | 28 |
| `chin` | 69 | 90 | 16 | 10 |
| `hairline` | 42 | 15 | 33 | 17 |

Les points internes de chaque élément sont définis exhaustivement dans le JSON (sommet, coins, pupilles, racine et pointe du nez, commissures, etc.).

### Règles minimales
- Les yeux sont symétriques par défaut, mais l'asymétrie future reste possible.
- Le nez se place sous les yeux, la bouche sous le nez, le menton sous la bouche.
- La bouche est centrée par défaut. Sa largeur de référence est approximativement 0,74 × l'écart entre les centres des yeux, avec une tolérance de ±25 %. Convention graphique et non loi anatomique.
- Les paramètres d'identité sont partagés entre les deux vues ; chaque vue utilise sa projection.
- Les rectangles doivent rester dans le parent sauf exception explicitement documentée.
- Les liens de construction peuvent être affichés, mais pas de triangle rigide obligatoire.

### Paramètres et presets
| Paramètre | Minimum | Défaut | Maximum |
|---|---:|---:|---:|
| `eye_spacing` | 0.82 | 1 | 1.18 |
| `eye_width` | 0.82 | 1 | 1.18 |
| `nose_width` | 0.75 | 1 | 1.3 |
| `nose_length` | 0.85 | 1 | 1.15 |
| `nose_projection` | 0.75 | 1 | 1.3 |
| `mouth_width` | 0.75 | 1 | 1.3 |
| `jaw_width` | 0.8 | 1 | 1.2 |
| `chin_length` | 0.85 | 1 | 1.15 |

Quatre presets : neutre, A (yeux rapprochés, nez/mâchoire fins), B (yeux écartés, nez/mâchoire larges), C (yeux larges, bouche étroite, menton long). Valeurs dans le JSON.
Vieillissement : préserver les paramètres identitaires ; ajouter des transformations graphiques de paupières, sillons, joues, cheveux. L'hérédité effective et le corps entier restent hors périmètre.

### Contrat de réalisation Codex — BIO-VEC-P0
1. Lire le JSON du dépôt, sans valeurs géométriques codées en dur.
2. Générer un visage SVG **esthétiquement travaillé** de face et de profil depuis rectangles et points internes ; pas de portrait préfabriqué ni d'image IA.
3. Offrir un mode « Construction » montrant rectangles, centres, ancres et liens, masqué par défaut.
4. Ajouter huit curseurs, quatre presets et une bascule « ancien ». Tous doivent modifier réellement les courbes.
5. Les deux vues reflètent le même état identitaire ; sortie SVG déterministe.
6. Page autonome utilisable sur Safari iPad ; publier une preview GitHub Pages depuis une branche/PR indépendante, **dans le dépôt Microcosme**, selon le workflow de preview habituel. Donner le lien exact fonctionnel.
7. Tests : validité des données, bornes, ordre vertical, symétrie initiale, déterminisme, valeurs extrêmes, absence de NaN, cohérence face/profil, tests Chromium/WebKit si disponibles.
8. Ne pas toucher au moteur de jeu, ne pas fusionner, ne pas déclarer de validation artistique sans retour utilisateur.
9. La beauté et la lisibilité du résultat sont des critères décisifs, non remplacés par la réussite des tests.

### Provenance et limites
Les proportions de corps 5,5 têtes et ratio canevas viennent de la bible V0. Les dimensions locales du visage et points sont **des conventions proposées**, non des données anthropométriques validées. Le rendu final des courbes reste à évaluer dans la preview.
