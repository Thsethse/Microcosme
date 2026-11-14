# Mesures V4-I1 — cache bitmap final

Deux essais de cinq minutes réelles, Chromium et WebKit en parallèle sur la même
VM Linux. Aucune horloge accélérée. Cadence observée par fenêtres RAF de 30 s ;
la fenêtre finale incomplète est exclue des plages ci-dessous. Le p95 est le
plus élevé parmi les dix fenêtres complètes, pas une promesse de cadence minimale.

| Moteur | Durée | Cycles de navigation | Moyennes par fenêtre de 30 s | Pire p95 | Tas JS après GC |
|---|---:|---:|---:|---:|---|
| chromium 151.0.7922.34 | 300.2 s | 461 | 58.1–59.9 | 16.8 ms | 1.54 → 1.95 Mio |
| webkit 26.5 | 300.8 s | 458 | 32.5–39.8 | 51.0 ms | non disponible |

Sur toute la durée : **117 objets visuels, 38 assets, 69 nœuds DOM, une habitante**.
Les deux caches de terrain conservent 5 925 888 octets bruts ; les bitmaps des
38 illustrations occupent 556 032 octets bruts fixes supplémentaires. Le Canvas
d'affichage 1024 × 768 et les allocations internes du navigateur s'y ajoutent.

Chromium : après la montée initiale du tas JS, les derniers points ne montrent
pas de croissance continue. Le test impose aussi moins de 5 Mio de croissance
retenue. WebKit : comptes de ressources stables, mais pas de mesure du tas JS.
**La mémoire native/GPU totale et la latence tactile ne sont pas mesurées.**

Les mesures initiales avant cache bitmap sont conservées séparément. Leur
WebKit était nettement plus lent et plus irrégulier ; d'autres tests tournaient
sur la VM pendant une partie de ces essais. Cette comparaison motive le cache
sans constituer un benchmark contrôlé entre deux matériels identiques isolés.

Le test final n'a pas montré de dégradation continue pendant cinq minutes sur
cette VM. Les moyennes par fenêtre n'excluent pas des images lentes. L'objectif
de 30 images/s n'est pas une garantie de performance sur Safari iPad physique ;
ce dernier reste à tester, avec échauffement, batterie et mémoire système.
