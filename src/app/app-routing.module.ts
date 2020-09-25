import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWriterComponent } from './writer-components/edit-writer/edit-writer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WritersListScreenComponent } from './writer-components/writers-list-screen/writers-list-screen.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { WriterDetailsComponent } from './writer-components/writer-details/writer-details.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { EditDealerComponent } from './edit-dealer/edit-dealer.component';
import { DealerListScreenComponent } from './dealer-list-screen/dealer-list-screen.component';
import { DealerDetailsComponent } from './dealer-details/dealer-details.component';
import { EditBookComponent } from './book-components/edit-book/edit-book.component';
import { BookListScreenComponent } from './book-components/book-list-screen/book-list-screen.component';
import { BookDetailsComponent } from './book-components/book-details/book-details.component';


const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'edit-writer', component: EditWriterComponent },
  { path: 'edit-dealer', component: EditDealerComponent },
  { path: 'edit-book', component: EditBookComponent },
  { path: 'writers-advanced-search', component: AdvancedSearchComponent },
  { path: 'books-advanced-search', component: AdvancedSearchComponent },
  { path: 'writers-search-result', component: SearchResultComponent },
  { path: 'books-search-result', component: SearchResultComponent },
  { path: 'create-new-dealer', component: EditDealerComponent },
  { path: 'create-new-book', component: EditBookComponent },
  { path: 'writers-in-room-list', component: WritersListScreenComponent },
  { path: 'writers-list-screen', component: WritersListScreenComponent },
  { path: 'dealer-list-screen', component: DealerListScreenComponent },
  { path: 'book-list-screen', component: BookListScreenComponent},
  { path: 'dealer-book-list', component: BookListScreenComponent},
  { path: 'writer-details', component: WriterDetailsComponent },
  { path: 'dealer-details', component: DealerDetailsComponent },
  { path: 'book-details', component: BookDetailsComponent },
  { path: 'writer-reminders', component: RemindersListComponent },
  { path: 'book-reminders', component: RemindersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
