import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWriterComponent } from './edit-writer/edit-writer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WritersListScreenComponent } from './writers-list-screen/writers-list-screen.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { WriterDetailsComponent } from './writer-details/writer-details.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { EditDealerComponent } from './edit-dealer/edit-dealer.component';
import { DealerListScreenComponent } from './dealer-list-screen/dealer-list-screen.component';
import { DealerDetailsComponent } from './dealer-details/dealer-details.component';


const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'edit-writer', component: EditWriterComponent },
  { path: 'writer-details', component: WriterDetailsComponent },
  { path: 'writers-list-screen', component: WritersListScreenComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent },
  { path: 'search-result', component: SearchResultComponent },
  { path: 'writer-reminders', component: RemindersListComponent },
  { path: 'create-new-dealer', component: EditDealerComponent },
  { path: 'edit-dealer', component: EditDealerComponent },
  { path: 'dealer-list-screen', component: DealerListScreenComponent },
  { path: 'dealer-details', component: DealerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
