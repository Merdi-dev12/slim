Le projet situé dans `slim/slim` est une application frontend moderne basée sur **Angular 21** (avec l'utilisation de composants Standalone et de Signals). L'intégration graphique s'appuie sur **Tailwind CSS v4** et **DaisyUI v5**.

Voici l'analyse détaillée de la structure du code, le rôle de chaque dossier/fichier, et comment y apporter vos modifications.

---

### 📂 Structure et Rôle des Dossiers

L'architecture du projet est découpée de manière modulaire et propre (par responsabilités) :

#### 1. `src/app/core/` (Cœur de l'application)
Ce dossier regroupe le code global partagé de manière transverse sous forme de singletons (services uniques, guards, interceptors).
*   **`config/app-config.ts`** : Centralise la configuration globale de l'application (comme l'URL de l'API) en faisant le pont avec les variables d'environnement.
*   **`guards/auth-guard.ts`** : Protège les routes de l'application (vérifie si l'utilisateur est connecté pour lui donner accès ou le rediriger vers l'accueil).
*   **`interceptors/auth.interceptor.ts`** : Intercepte les requêtes HTTP (par exemple pour ajouter automatiquement un token d'authentification `Bearer` aux requêtes vers le backend).
*   **`models/user.ts`** : Définit les types et interfaces TypeScript des entités de données (ici, l'interface `User`).
*   **`services/session.service.ts`** : Service central gérant l'état de la session utilisateur à l'aide des **Angular Signals** (`signal`).

#### 2. `src/app/features/` (Fonctionnalités / Pages)
C'est ici que vit la logique métier de l'application découpée par fonctionnalités. Pour le moment, il n'y a qu'une seule fonctionnalité : `home`.
*   **`features/home/home.routes.ts`** : Fichier contenant les routes spécifiques de la page d'accueil.
*   **`features/home/pages/home-page/`** : Composant de la page d'accueil (`home-page.ts` et `home-page.html`). Il affiche actuellement les badges indiquant que Tailwind CSS et DaisyUI fonctionnent.

#### 3. `src/app/layouts/` (Gabarits / Structure de page)
*   **`layouts/app-shell/`** : Le squelette global de l'application (l'enveloppe contenant le `<router-outlet />` où sont injectés les composants de pages).

#### 4. `src/app/shared/` (Éléments réutilisables)
Composants "idiots" (présentationnels) ou utilitaires réutilisés à plusieurs endroits du site :
*   **`shared/ui/empty-state/`** : Un composant réutilisable pour afficher un état vide (ex : "Aucun élément trouvé").
*   **`shared/pipes/initials.pipe.ts`** : Un filtre Angular (`Pipe`) servant à extraire les initiales à partir d'un nom complet (ex: "John Doe" -> "JD").

---

### ⚙️ Fichiers de Configuration Importants

*   **`src/styles.css`** : Le point d'entrée CSS global. C'est ici que sont importés **Tailwind CSS**, **DaisyUI** et **Flowbite-Angular**.
*   **`src/app/app.routes.ts`** : Le routeur principal. Il utilise le **Lazy Loading** pour charger dynamiquement les modules de features (comme `@features/home/home.routes`).
*   **`src/app/app.config.ts`** : Configure les providers globaux de l'application (routage, client HTTP avec l'intercepteur d'authentification).
*   **`tsconfig.json`** : Contient des alias de chemins très utiles pour simplifier les imports dans le code :
    *   `@app/*` $\rightarrow$ `src/app/*`
    *   `@core/*` $\rightarrow$ `src/app/core/*`
    *   `@features/*` $\rightarrow$ `src/app/features/*`
    *   `@shared/*` $\rightarrow$ `src/app/shared/*`

---

### 🛠️ Où toucher pour faire les modifications ?

#### 1. Pour ajouter une nouvelle page ou fonctionnalité :
1. Créez un nouveau dossier dans `src/app/features/` (par exemple : `dashboard` ou `auth`).
2. À l'intérieur, créez un fichier de routage (ex: `dashboard.routes.ts`) et les composants associés dans un sous-dossier `pages/`.
3. Déclarez cette nouvelle fonctionnalité dans le fichier de routes global `src/app/app.routes.ts` :
   ```typescript
   {
     path: 'dashboard',
     loadChildren: () => import('@features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
   }
   ```

#### 2. Pour créer des composants réutilisables (Boutons, Modales personnalisés, Cartes...) :
*   Ajoutez-les dans le dossier `src/app/shared/ui/`.

#### 3. Pour modifier le design global de l'application :
*   Le design s'appuie sur **DaisyUI**. Vous pouvez changer le thème ou ajouter des règles globales directement dans `src/styles.css`.
*   Pour modifier le contenu visuel d'une page existante (par exemple l'accueil), éditez directement `src/app/features/home/pages/home-page/home-page.html`.

#### 4. Pour communiquer avec votre backend (`slim-backend`) :
1. Créez un service API dans `src/app/core/services/` (ex : `project.service.ts`).
2. Injectez le client `HttpClient` d'Angular pour effectuer vos appels HTTP.
3. Configurez l'URL de base dans `src/environments/` afin qu'elle soit récupérée par `app-config.ts`.