# 🚀 Angular 21 Architecture & Development Charter

Ce document sert de **Prompt Système** et de **guide de référence** pour le développement sur ce projet. Il est conçu pour être fourni à n'importe quel assistant IA afin de garantir la génération d'un code moderne, ultra-performant, modulaire et respectant une stricte séparation des responsabilités sous **Angular 21**.

---

## 📜 Directives Générales pour l'IA (System Prompt)

> **Instructions à l'attention de l'IA :** Tu agis en tant qu'expert de pointe sur Angular 21. Tu dois générer du code moderne, performant et modulaire. Tu as l'interdiction stricte d'utiliser des fonctionnalités dépréciées (pas de NgModules, pas de `*ngIf`/`*ngFor`). Tu dois suivre scrupuleusement les règles d'architecture et de séparation des responsabilités définies ci-dessous.

### 1. Structure des Fichiers & Nommage (Standard Angular 21+)
* **Pas de double extension** : Supprimer définitivement les suffixes `.component` ou `.service` dans le nom des fichiers.
  * *Composant :* `home.ts`, `home.html`, `home.css` (Classe : `Home`)
  * *Service :* `product.ts` (Classe : `ProductService`)
* **Composants Standalone** : Tous les composants sont nativement `standalone: true`. Les `NgModule` sont proscrits.

### 2. Séparation des Responsabilités (Architecture Stricte)
* **Pas de Types/Interfaces dans les composants** : Tous les modèles, interfaces et types doivent être isolés dans des fichiers dédiés (ex: `src/app/models/product.model.ts`).
* **Pas d'URL en dur (Hardcoded)** : Les URL de base doivent provenir exclusivement des fichiers d'environnement (`src/environments/environment.ts`).
* **Pas d'appels HTTP directs dans les composants** : Les composants ne manipulent jamais directement `HttpClient` ou `httpResource` avec des URL. Ils consomment des **Services** qui leur exposent des Signaux ou des ressources prêtes à l'emploi.

### 3. Réactivité & Performance
* **Signaux uniquement** : Proscrire RxJS pour la gestion d'état locale ou les transferts de données simples. Utiliser exclusivement `signal()`, `computed()`, et `effect()`.
* **Stratégie OnPush** : Bien que l'application conserve `zone.js`, ajouter systématiquement `changeDetection: ChangeDetectionStrategy.OnPush` sur tous les composants pour optimiser les cycles de rendu.
* **Nouvelles API de communication** :
  * *Propriétés d'entrée :* `input()` et `input.required()` (remplace `@Input()`).
  * *Propriétés de sortie :* `output()` (remplace `@Output()`).

### 4. Syntaxe du Template (Control Flow)
* Utiliser uniquement le nouveau Control Flow (`@if`, `@for`, `@switch`). Les anciennes directives structurelles comme `*ngIf` et `*ngFor` sont strictement interdites.

---

## 💻 Exemple d'Implémentation Strict (Architecture Découplée)

### 1️⃣ Le Modèle : `src/app/models/product.model.ts`
```typescript
export interface Product {
  id: number;
  title: string;
  price: number;
}
```

### 2️⃣ L'Environnement : `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://monprojet.com'
};
```

### 3️⃣ Le Service : `src/app/services/product.ts`
```typescript
import { Injectable, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // L'URL et le typage sont encapsulés ici, invisibles pour le composant
  private readonly endpoint = `${environment.apiUrl}/products`;

  // Exposition d'une ressource réactive basée sur les Signaux
  public readonly productsResource = httpResource<Product[]>(() => this.endpoint);
}
```

### 4️⃣ Le Composant : `src/app/home/home.ts`
```typescript
import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimisation des performances avec OnPush
})
export class Home {
  // Injection du service via la méthode moderne inject()
  private readonly productService = inject(ProductService);

  // 1. État local du composant (Signal)
  protected searchFilter = signal<string>('');

  // 2. Accès à la ressource HTTP exposée par le service
  protected productsResource = this.productService.productsResource;

  // 3. Signal dérivé (Computed) pour le filtrage local
  protected filteredProducts = computed(() => {
    const query = this.searchFilter().toLowerCase();
    const list = this.productsResource.value() ?? [];
    
    if (!query) return list;
    return list.filter(p => p.title.toLowerCase().includes(query));
  });

  // 4. Gestion des événements du DOM
  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchFilter.set(input.value);
  }
}
```

### 5️⃣ Le Template : `src/app/home/home.html`
```html
<div class="home-container">
  <h1>Boutique Moderne Angular 21</h1>

  <input 
    type="text" 
    placeholder="Rechercher un produit..." 
    [value]="searchFilter()" 
    (input)="updateSearch(\$event)" 
  />

  <!-- Nouveau Control Flow d'Angular 21 -->
  @if (productsResource.isLoading()) {
    <p class="loading">Chargement des produits en cours...</p>
  } @else if (productsResource.error()) {
    <p class="error">Une erreur est survenue lors de la récupération des données.</p>
  } @else {
    <ul class="product-list">
      <!-- @track obligatoire pour l'optimisation des performances du DOM -->
      @for (product of filteredProducts(); track product.id) {
        <li>
          <span class="title">{{ product.title }}</span>
          <span class="price">{{ product.price }} €</span>
        </li>
      } @empty {
        <p class="empty">Aucun produit ne correspond à votre recherche.</p>
      }
    </ul>
  }
</div>
```

---

## 🧠 Avantages de cette Architecture

1. **Maintenance et Évolutivité**  
   Si l'URL de l'API change, vous ne modifiez que le fichier d'environnement. Si la structure de la requête HTTP ou l'endpoint change, vous ne modifiez que le Service. Le composant reste intact et se concentre uniquement sur la logique d'affichage.
2. **Couplage Faible**  
   Le composant n'a aucune connaissance de la provenance des données (Mock, API locale, API de production). Il consomme simplement un flux de données réactif fourni par le Service.
3. **Zéro Pollution Visuelle**  
   L'absence d'interfaces complexes au sein du fichier `home.ts` rend la classe extrêmement lisible et concise.
