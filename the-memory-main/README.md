# Memori'ez

Memori'ez est un site simple de jeux de mémoire qui s'ouvrent dans un navigateur. L'accueil permet de choisir le jeu solo ou le duel Tueur Memory.

## Lancer et tester

1. Ouvrir le dossier du projet dans VS Code.
2. Ouvrir `index.html`.
3. Cliquer sur **Go Live** pour prévisualiser le site avec Live Server.
4. Choisir un jeu sur la page d'accueil.

Live Server prévisualise le site sur ton ordinateur et actualise la page après l'enregistrement. Il ne publie rien sur Internet. Pour arrêter l'aperçu, cliquer à nouveau sur **Go Live**.

## Technologies et outils

| Outil / technologie | Rôle |
| --- | --- |
| HTML | Structure des pages, boutons, textes et cartes. |
| CSS | Couleurs, disposition, adaptation au mobile et animation de retournement. |
| JavaScript | Mélange et comparaison des cartes, chronomètre, niveaux, scores et tours. |
| PNG | Images des cartes dans `assets/images/`. |
| VS Code | Modifier les fichiers et rechercher les usages avant d'ajouter du code. |
| Live Server | Prévisualiser localement les changements ; ce n'est pas un hébergement. |


Le projet n'utilise pas de framework ni de compilation. Les pages chargent directement leur CSS et leur JavaScript.

## Parcours et pages

| Page | Fonctionnalités et méthode | Fichiers utilisés |
| --- | --- | --- |
| `index.html` | Accueil avec deux choix de jeu et des liens vers connexion/inscription. Les cartes de jeu se réorganisent sur petit écran. | `css/home.css` |
| `pages/memoryGame.html` | Mode solo : cartes mélangées, chronomètre, coups, niveaux, redémarrage et résultat. Le JavaScript crée les cartes, compare leur identifiant et passe au niveau suivant. | `css/memoryGame.css`, `js/index.js` |
| `pages/TUEURMEMORY.html` | Duel sur le même appareil : deux équipes, score, chronomètre et manches. Une paire rapporte un point et conserve le tour ; une erreur passe la main. | `css/TUEURMEMORY.css`, `js/tueurMemory.js` |
| `pages/connexion.html` | Maquette avec e-mail, mot de passe, option « se souvenir » et lien vers l'inscription. Le navigateur contrôle les champs obligatoires et le format de l'e-mail ; aucun compte n'est vérifié. | `css/index.css`, icônes Ionicons chargées depuis un CDN |
| `pages/inscription.html` | Maquette avec e-mail et mot de passe, et lien vers la connexion. Aucun compte n'est enregistré. | `css/index.css`, icônes Ionicons chargées depuis un CDN |

### Comment les jeux fonctionnent

- JavaScript prépare deux exemplaires de chaque image et les mélange (mélange Fisher–Yates).
- Une carte porte son numéro dans `data-image`. Le script compare les deux numéros après les clics.
- Une classe CSS déclenche l'animation 3D de retournement. Les cartes différentes se recachent après un bref délai.
- `setInterval` met à jour le chronomètre ; `setTimeout` gère le délai de comparaison et l'écran final.
- En solo, chaque niveau définit un nombre de paires et un temps. En duel, l'état du jeu conserve l'équipe active et les scores.

## Organisation des fichiers

```text
Memori'ez/
├── index.html
├── README.md
├── assets/
│   └── images/
├── css/
├── js/
└── pages/
```

- `assets/images/` : `img-1.png` à `img-8.png` et `Question_mark.png`, le dos des cartes.
- `css/home.css` : accueil.
- `css/index.css` : style commun aux formulaires.
- `css/memoryGame.css` et `css/TUEURMEMORY.css` : style des deux jeux.
- `js/index.js` : logique du Memory solo.
- `js/tueurMemory.js` : logique du duel.
- `pages/` : les quatre pages secondaires du parcours.

## Garder le code lisible

- Modifier le fichier associé à la fonctionnalité dans le tableau ; les jeux ont chacun leur propre script.
- Les deux formulaires partagent `css/index.css` : ne pas dupliquer la feuille.
- Garder le contenu dans HTML, l'apparence dans CSS et les règles de jeu dans JavaScript.


## Connexion et publication

Les formulaires ne sont que des interfaces : ils ne créent pas de compte et ne connectent pas un utilisateur. Il faudrait un serveur et une base de données pour cela.

