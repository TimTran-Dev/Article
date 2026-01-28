import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/HomePage/homepage.component';
import { SegmentComponent } from './Components/Segments/segment.component';
import { EpisodeComponent } from './Components/Episodes/episode.component';
import { NewsListComponent } from './Components/Articles/NewsList/news-list.component';
import { LibraryComponent } from './Components/MyLibrary/library.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', redirectTo: '' },
  { path: 'articles', component: NewsListComponent },
  { path: 'segments', component: SegmentComponent },
  { path: 'episodes', component: EpisodeComponent },
  { path: 'library', component: LibraryComponent },
  { path: '**', redirectTo: 'home' },
];
