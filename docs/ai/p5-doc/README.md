# P5-DOC — Consolidation du catalogue capillaire étendu

Dossier documentaire du 19 novembre 2026. Référence technique : [BIO-VIS-P4-R1](https://thsethse.github.io/Microcosme/preview/bio-vis-p4-r1/). Base auditée : main `f5cb1967cef8fa7d0d58c622502cb6f784188e1d`. **Aucune programmation, modification du moteur, publication de preview ni fusion.**

## Livrables

1. [Audit des fichiers, références et prototype](AUDIT.md), avec [relevé des 40 branches, 30 PR et 82 chemins d’images documentaires](ANNEXE_RELEVE.md).
2. [Catalogue définitif numéroté 01–81](CATALOGUE.md), provenance, position, géométrie, implantation, texture, longueur, présentation, accessoires et statut pour chaque référence.
3. [Comparaison des deux P5-E, seconde P5-A et doublons potentiels](DOUBLONS.md).
4. [Contrat artistique](CONTRAT_ARTISTIQUE.md) : référence des cheveux uniquement, habitants P4-R1 conservés, disponibilité indépendante du sexe, de l’origine, du statut social et de la personnalité.
5. [Contrat technique destiné à Codex](CONTRAT_TECHNIQUE.md) : moteur existant, huit paramètres, trois échelles, préservation des 18 styles, Safari iPad, plan de tests et validation humaine ultérieure.

## Les sept images attendues : retrouvées

Tous les fichiers ci-dessous sont présents dans `docs/ai/visual-references/`, ouverts visuellement et vérifiés comme PNG valides 1536×1024. **Aucune des sept planches attendues ne manque.** Les fichiers ne sont ni renommés ni modifiés.

| Planche | Numérotation du catalogue | Fichier |
| --- | --- | --- |
| P5-A | 19–27 | [C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png](../visual-references/C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png) |
| P5-B | 28–36 | [0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png](../visual-references/0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png) |
| P5-C | 37–45 | [7C197DD6-3733-4B37-A0B0-B265FF034BD8.png](../visual-references/7C197DD6-3733-4B37-A0B0-B265FF034BD8.png) |
| P5-D | 46–54 | [FAC68E60-6567-4D1A-B299-46A07B836D27.png](../visual-references/FAC68E60-6567-4D1A-B299-46A07B836D27.png) |
| P5-E v1 | 55–63 | [B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png](../visual-references/B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png) |
| P5-E v2 | 73–81, numéros imprimés 55–63 conservés | [D9BC5231-48E8-4880-9A7B-46573494504D.png](../visual-references/D9BC5231-48E8-4880-9A7B-46573494504D.png) |
| P5-F | 64–72 | [132E23ED-C1DE-4311-8BAF-B56E09277B56.png](../visual-references/132E23ED-C1DE-4311-8BAF-B56E09277B56.png) |

L’utilisateur a confirmé pendant cette mission : B409… = E v1, D9BC… = E v2. Une huitième image, [DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png](../visual-references/DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png), présente la même grille P5-A 19–27 avec un autre rendu. Elle est conservée et rapprochée case par case, sans créer neuf numéros supplémentaires.

## Ce que signifie le total 81

**18 références existantes + 54 cases A–F avec E v1 + neuf références E v2 = 81 fiches documentaires.** Les IDs uniques `p5-001`–`p5-081` assurent la traçabilité ; les IDs de moteur des 18 existantes restent inchangés. Les illustrations G/D sont des arrangements internes, pas des catégories de personnages.

| Statut principal | Fiches |
| --- | ---: |
| Existante dans P4-R1 | 18 |
| Nouvelle intention capillaire | 20 |
| Variante | 27 |
| Doublon potentiel | 16 |
| **Total conservé** | **81** |

Ce ne sont pas 81 nouvelles coiffures ni 81 géométries indépendantes prouvées. Les rapprochements partiels sont argumentés, sans aucune suppression. La fiche 74 (voile/turban) montre des accessoires mais ne révèle aucune géométrie capillaire suffisante ; d’autres vignettes sont partiellement occultées. Ce manque d’information visuelle n’est pas une image absente : il est conservé comme limite pour l’intégration future.

Le catalogue est définitif pour la **numérotation et la provenance de cet inventaire** ; le nombre de bases à programmer après déduplication graphique et les décisions artistiques d’intégration ne sont pas fictivement déclarés définitifs.

## Contrôles documentaires

Vérification du nombre et de l’unicité des 81 IDs, de leurs huit rubriques de description, des positions 3×3/4×3, des sept correspondances de planches et de l’attribution E confirmée. Vérification du décodage et des SHA-256 des sources, des liens locaux, des 16 rapprochements signalés et du périmètre Git limité à ce dossier Markdown. Aucun nouveau test applicatif ou prototype n’est ajouté ; les tests des futures coiffures sont des exigences du contrat, pas un résultat prétendu.

Les huit images P5 et les références existantes restent dans leur état initial. Les documents de continuité sur leur branche dédiée sont consultés mais pas modifiés. Aucune PR de code existante n’est fusionnée ou mise à jour par cette consolidation.
