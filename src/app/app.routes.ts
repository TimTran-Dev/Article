import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/HomePage/homepage.component';

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
    loadComponent: () =>
      import('./Components/MyLibrary/library.component').then((m) => m.LibraryComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
