import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/HomePage/homepage.component';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'articles',
    loadComponent: () =>
      import('./Components/Articles/NewsList/news-list.component').then((m) => m.NewsListComponent),
  },
  {
    path: 'my-articles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Components/MyArticles/my-articles/my-articles.component').then(
        (m) => m.MyArticlesComponent,
      ),
  },
  {
    path: 'segments',
    loadComponent: () =>
      import('./Components/Segments/segment.component').then((m) => m.SegmentComponent),
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./Components/Episodes/episode.component').then((m) => m.EpisodeComponent),
  },
  {
    path: 'library',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Components/MyLibrary/library.component').then((m) => m.LibraryComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
