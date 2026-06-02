# Slim Frontend

Application Angular 21 standalone.

Ce repository contient une structure simple pour travailler proprement en equipe: peu de dossiers, des responsabilites claires, et des exemples minimaux pour les guards, interceptors, pipes, environnements, composants partages, Tailwind, DaisyUI, Flowbite Angular et icones.

## Stack

- Angular 21 avec composants standalone
- Tailwind CSS 4
- DaisyUI 5
- Flowbite Angular
- Lucide Angular pour les icones
- Vitest pour les tests unitaires Angular

## Demarrer le projet

```bash
git clone <url-du-repository>
cd slim-frontend
npm install
npm start
```

L'application demarre ensuite sur l'URL affichee par Angular CLI, generalement `http://localhost:4200`.

## Commandes utiles

```bash
npm start
npm run build
npm test
```

## Architecture

```text
src/
├── app/
│   ├── core/
│   │   ├── config/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   └── home/
│   │       ├── pages/
│   │       └── home.routes.ts
│   ├── layouts/
│   │   └── app-shell/
│   ├── shared/
│   │   ├── pipes/
│   │   ├── ui/
│   │   └── utils/
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
├── main.ts
└── styles.css
```

## Roles des dossiers

`core/` contient l'infrastructure globale de l'application: configuration, services singletons, guards, interceptors HTTP, modeles globaux. On evite d'y mettre des composants visuels.

`features/` contient les fonctionnalites metier. Chaque feature garde ses pages, routes, composants internes, services locaux et modeles proches de son domaine.

`shared/` contient uniquement ce qui est reutilisable et sans dependance a une feature precise: composants UI generiques, pipes, directives, fonctions utilitaires.

`layouts/` contient les coques de pages: sidebar, header, layout authentifie, layout public.

`environments/` contient les valeurs remplacees selon la configuration Angular: API URL, flags simples, mode production.

## Comment creer une feature

1. Creer un dossier dans `src/app/features/<nom-feature>`.
2. Ajouter un fichier `<nom-feature>.routes.ts`.
3. Creer les pages dans `pages/`.
4. Garder les composants utilises seulement par cette feature dans son dossier.
5. Ajouter une route lazy dans `src/app/app.routes.ts`.

Exemple:

```text
src/app/features/orders/
├── orders.routes.ts
├── pages/
│   └── orders-list/
│       ├── orders-list.ts
│       └── orders-list.html
└── services/
    └── orders.service.ts
```

## Conventions

- Organiser par feature avant d'organiser par type.
- Garder les fichiers proches du code qu'ils servent.
- Utiliser les imports alias: `@core/*`, `@shared/*`, `@features/*`, `@env/*`.
- Preferer `inject()` dans les services, guards et interceptors.
- Garder les composants orientes affichage; sortir les traitements dans des services ou fonctions pures.
- Ajouter les tests a cote du fichier teste quand la logique devient importante.

## UI

Tailwind est importe dans `src/styles.css`.

DaisyUI est active via:

```css
@plugin 'daisyui';
```

Flowbite Angular est scanne par Tailwind via:

```css
@source '../node_modules/flowbite-angular';
```

Pour les icones, utiliser `@lucide/angular` et importer uniquement les composants d'icones necessaires dans les composants Angular.

## Environnements

Angular remplace `src/environments/environment.ts` par `src/environments/environment.development.ts` en configuration development.

La valeur `apiUrl` est centralisee dans:

```text
src/app/core/config/app-config.ts
```

## Sources de reference

- Angular style guide: https://angular.dev/style-guide
- Angular file structure: https://angular.dev/reference/configs/file-structure
- Angular + Tailwind: https://angular.dev/guide/tailwind
- DaisyUI install: https://daisyui.com/docs/install/
- Flowbite Angular quickstart: https://flowbite-angular.com/docs/getting-started/quickstart
