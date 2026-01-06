import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/HomePage/homepage.component';
import { ArticleComponent } from './Components/Articles/article.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'articles', component: ArticleComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
