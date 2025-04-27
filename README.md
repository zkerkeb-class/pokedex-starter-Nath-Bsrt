# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Pokédex Nath-Bsrt

Bienvenue dans le projet **Pokédex Nath-Bsrt** ! 🌟

Cette application web full-stack permet de :

- S’enregistrer et se connecter de manière sécurisée (JWT)
- Parcourir et consulter la liste des Pokémons (données issues de MongoDB)
- **Voir le détail de chaque Pokémon** : nom, types, statistiques, évolutions possibles, et version shiny
- **Ajouter, modifier et supprimer un Pokémon** (authentification requise)
- Ajouter des Pokémons à vos **favoris** et les consulter à tout moment
- Jouer au mini-jeu **"Who’s That Pokémon ?"** :  
  Essayez de deviner un maximum de Pokémon en 1 minute, en accumulant des points.  
  À la fin, votre meilleur score est sauvegardé et visible dans le **leaderboard du jeu**.
- Accéder à un **comparateur de Pokémons** pour visualiser leurs statistiques côte à côte et comparer l'efficacité de leurs types.

---

## 📚 Structure du projet

Le projet est divisé en deux dossiers principaux :

- [`pokedex-api-Nath-Bsrt/`](https://github.com/zkerkeb-class/pokedex-api-Nath-Bsrt.git) : le backend (API REST avec Node.js + Express + MongoDB)
- [`pokedex-starter-Nath-Bsrt/`](https://github.com/zkerkeb-class/pokedex-starter-Nath-Bsrt.git) : le frontend (React.js + Vite)

---

## 🛠️ Instructions d'installation

1. **Cloner les deux dépôts**

    ```bash
    git clone https://github.com/zkerkeb-class/pokedex-api-Nath-Bsrt.git
    git clone https://github.com/zkerkeb-class/pokedex-starter-Nath-Bsrt.git
    ```

2. **Installer les dépendances**

    **Pour l’API :**
    ```bash
    cd pokedex-api-Nath-Bsrt
    npm install
    ```

    **Pour le frontend :**
    ```bash
    cd ../pokedex-starter-Nath-Bsrt
    npm install
    ```

3. **Lancer la base de données**

    Assurez-vous d'avoir MongoDB démarré en local :
    ```bash
    mongod
    ```

4. **Démarrer les serveurs**

    **Backend :**
    ```bash
    cd pokedex-api-Nath-Bsrt
    npm run dev
    ```

    **Frontend :**
    ```bash
    cd ../pokedex-starter-Nath-Bsrt
    npm run dev
    ```

    Accédez à l’application sur : [http://localhost:5173](http://localhost:5173)

---

## 📚 Documentation de l’API

### Authentification

| Méthode | URL                      | Description                                |
|---------|--------------------------|--------------------------------------------|
| POST    | `/api/users/register`    | Inscription d'un nouvel utilisateur        |
| POST    | `/api/users/login`       | Connexion d'un utilisateur                 |

### Pokémons

| Méthode | URL                     | Description                                      |
|---------|-------------------------|--------------------------------------------------|
| GET     | `/api/pokemons`         | Liste de tous les Pokémons                       |
| GET     | `/api/pokemons/:id`     | Détail d'un Pokémon par ID                       |
| POST    | `/api/pokemons`         | **Créer un nouveau Pokémon** (auth requise)      |
| PUT     | `/api/pokemons/:id`     | **Modifier un Pokémon** (auth requise)           |
| DELETE  | `/api/pokemons/:id`     | **Supprimer un Pokémon** (auth requise)          |

### Favoris

| Méthode | URL                             | Description                                   |
|---------|---------------------------------|-----------------------------------------------|
| POST    | `/api/users/favorites`          | Ajouter un Pokémon aux favoris (auth req.)    |
| GET     | `/api/users/favorites`          | Récupérer la liste de ses Pokémons favoris    |
| DELETE  | `/api/users/favorites/:pokemonId`| Retirer un Pokémon de ses favoris             |

### Jeu "Who’s That Pokémon ?"

| Méthode | URL                      | Description                           |
|---------|--------------------------|---------------------------------------|
| POST    | `/api/game/score`        | Enregistrer le score d’une partie     |
| GET     | `/api/game/leaderboard`  | Obtenir le leaderboard du mini-jeu    |

### Comparateur

| Méthode | URL                                 | Description                          |
|---------|-------------------------------------|--------------------------------------|
| POST    | `/api/pokemons/compare`             | Comparer deux Pokémons (statistiques)|

---

## 🎥 Vidéo de démonstration

▶️ [Lien YouTube vers la démo du projet](https://youtu.be/smd7G93yZ8w)

---

💚 Bon visionnage ! 🌟
