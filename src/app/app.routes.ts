import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/HomePage/homepage.component';
import { ArticleComponent } from './Components/Articles/article.component';
import { SegmentComponent } from './Components/Segments/segment.component';
import { EpisodeComponent } from './Components/Episodes/episode.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'articles', component: ArticleComponent },
  { path: 'segments', component: SegmentComponent },
  { path: 'episodes', component: EpisodeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
