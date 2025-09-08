🎬 Movie Discovery App

A modern Angular-based web application that allows users to discover movies, explore actors, and manage a personalized watchlist. Built as a hands-on exercise to practice Angular, RxJS, component architecture, and API integration with The Movie Database (TMDb).

🛠 **Technologies Used**

Frontend Framework: Angular 11+

State Management: RxJS BehaviorSubject for global state (search results) and Localstorage

UI & Styling:

Bootstrap 5 for responsive design

SCSS for component-level styling

ngx-owl-carousel-o for carousels (movies, actors)

HTTP & APIs: TMDb API for movie and actor data

Routing: Angular Router for navigation between landing, movie detail, and watchlist pages

Forms: Reactive Forms (FormControl) for search input

📂 **Project Structure**

src/app/core/services/tmdb.service.ts → Handles all TMDb API calls

src/app/core/services/search.service.ts → Global search state management via BehaviorSubject

src/app/core/services/api-headers.interceptor.ts → Http inteceptor

src\app\core\services\watchlist.service.ts - shared service using local storage

src/app/shared → Reusable components:

movie-card → Shows movie info

actor-card → Shows actor info with known movies

movie-carousel → Carousel component for movies/actors

src/app/features → Feature modules:

landing-page → Homepage with movie carousels, moods, search integration

movie-detail → Detailed view of a single movie, trailer, cast, and similar movies

watchlist → User’s saved movies list

src/environments → Environment configuration (API keys, base URLs)

🔍 **Features**
1. Search

Global search bar integrated in header

Search by Movies or Actors (dropdown to toggle type)

Shows real-time suggestions in a dropdown

Selecting an item updates search results globally

Search results dynamically replace main content (movies carousel or actors list)

2. Landing Page

Displays popular movies by moods (Feel Good, Action, Mind Benders)

Multiple carousels for movie categories

Actor results section if searching actors

3. Movie Detail

Movie title, overview, trailer, cast, and similar movies

Clickable cast and similar movies navigate to detail page

Uses the same carousel for similar movies

4. Watchlist

Add or remove movies to/from watchlist

Carousel layout for saved movies

Persists across sessions via service (optional: localStorage integration)

5. Responsive Design

Fully responsive using Bootstrap 5

Carousels adjust items per screen size

⚡ **Installation & Running Locally**

Clone repository:

git clone https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>


Install dependencies:

npm install


Add TMDb API key:

Create src/environments/environment.local.ts:

import { Environment } from './environment.model';
import { environment as base } from './environment';

export const environment: Environment = {
  ...base,
  tmdbApiKey: '<YOUR_TMDB_API_KEY>',
  production: false
};


Run the app:

ng serve


Navigate to http://localhost:4200

🚀 **Deployment (GitHub Pages)**

Install Angular CLI gh-pages:

npm install -g angular-cli-ghpages


Build the app for production:

ng build --prod --base-href "https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/"


Deploy to GitHub Pages:

npx angular-cli-ghpages --dir=dist/movie-discovery-app


Your app will be live at:
https://<YOUR_GITHUB_USERNAME>.github.io/<REPO_NAME>/

📌 **Notes**

Uses environment file replacement for secure API key management

Search suggestions, movie carousels, and actor carousels are reusable components

Designed for practice and learning Angular component architecture, RxJS, and responsive design
