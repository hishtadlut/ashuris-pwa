import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWriterComponent } from './edit-writer/edit-writer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WritersListScreenComponent } from './writers-list-screen/writers-list-screen.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { WriterDetailsComponent } from './writer-details/writer-details.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { RemindersListComponent } from './reminders-list/reminders-list.component';


const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'edit-writer', component: EditWriterComponent },
  { path: 'writer-details', component: WriterDetailsComponent },
  { path: 'writers-list-screen', component: WritersListScreenComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent },
  { path: 'search-result', component: SearchResultComponent },
  { path: 'writer-reminders', component: RemindersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
