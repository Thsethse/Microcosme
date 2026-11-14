# Prévisualisation V4-I1 — publiée et vérifiée

**<https://thsethse.github.io/Microcosme/preview/v4-i1/forest.html?v=v4-i1-1>**

Page : `/Microcosme/preview/v4-i1/forest.html`. Entrée du code source : `forest.html`.

- Snapshot exécuté : `9253386f123561b0db3a73c8262a7d0fd8ec1ad8`, branche
  `codex/v4-i1-foret-des-sources`. Les compléments ultérieurs de rapport/CI
  ne changent pas les ressources exécutées.
- Publication Pages : `7564d33bb47bebfb57cbdcdccbc83436c85dc7ef`, parent unique
  `31b7e147a0ec937463f3de859b0e5f6ffb93005c`, **sans fusion**.
- GitHub Pages a confirmé `built` pour ce commit, sans erreur de déploiement.
  Configuration conservée : `main`, `/`, publication historique « legacy ».
- Seul le nouveau dossier `preview/v4-i1/` est ajouté à main : 51 fichiers.
  Tous les chemins préexistants, dont les autres prévisualisations, restent inchangés.
- **50 fichiers HTTPS contrôlés : 50 HTTP 200 et 50 SHA-256 identiques** : les
  47 ressources d'exécution, l'index de redirection, le manifeste et la licence.
  Détail dans [ressources-publiques.json](ressources-publiques.json).
- Le parcours complet [WebKit 26.5 public](navigateurs-publics-webkit.json) est
  réussi avec vérification TLS activée : images Canvas, sélection tactile,
  caméra/zoom, suivi, grotte, pause, rechargement, stockage isolé et hors ligne
  après chargement.
- Chromium 151 est vérifié sur le serveur local. Le parcours public Chromium
  de cette VM a rencontré `ERR_CERT_AUTHORITY_INVALID` : le magasin NSS du
  navigateur ne connaît pas l'autorité du proxy Cloud. Aucun certificat ignoré
  ni vérification TLS désactivée. Le workflow V4 rejoue donc aussi le parcours
  public depuis GitHub Actions ; son résultat effectif figure dans les checks
  de la PR. Ce problème local n'est pas présenté comme un défaut du certificat
  du site : les contrôles HTTPS système et WebKit ont réussi.

Le rapport et le protocole physique sont dans [RAPPORT.md](RAPPORT.md).
**Safari iPad physique non testé. Validation artistique humaine toujours ouverte.**
Cette publication autorise l'essai, pas une généralisation de V4.
