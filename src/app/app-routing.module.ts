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
  { path: 'edit-writer', component: EditWriterComponent, data: { 'nav-bar-title': 'עריכת סופר' } },
  { path: 'create-writer', component: EditWriterComponent, data: { 'nav-bar-title': 'הוספת סופר חדש' } },
  { path: 'edit-dealer', component: EditDealerComponent, data: { 'nav-bar-title': 'עריכת סוחר' } },
  { path: 'edit-book', component: EditBookComponent, data: { 'nav-bar-title': 'עריכת ספר' } },
  { path: 'writers-advanced-search', component: AdvancedSearchComponent, data: { 'nav-bar-title': 'סופרים: חיפוש מתקדם' } },
  { path: 'books-advanced-search', component: AdvancedSearchComponent, data: { 'nav-bar-title': 'ספרים: חיפוש מתקדם' } },
  { path: 'writers-search-result', component: SearchResultComponent, data: { 'nav-bar-title': 'סופרים: תוצאות חיפוש' } },
  { path: 'books-search-result', component: SearchResultComponent, data: { 'nav-bar-title': 'ספרים: תוצאות חיפוש' } },
  { path: 'create-new-dealer', component: EditDealerComponent, data: { 'nav-bar-title': 'הוספת סוחר חדש' } },
  { path: 'create-dealer-for-book', component: EditDealerComponent, data: { 'nav-bar-title': 'הוספת סוחר חדש' } },
  { path: 'create-book', component: EditBookComponent, data: { 'nav-bar-title': 'הוספת ספר חדש' } },
  { path: 'writers-in-room-list', component: WritersListScreenComponent, data: { 'nav-bar-title': 'סופרים בחדר' } },
  { path: 'writers-list-screen', component: WritersListScreenComponent, data: { 'nav-bar-title': 'רשימת סופרים' } },
  { path: 'dealer-list-screen', component: DealerListScreenComponent, data: { 'nav-bar-title': 'רשימת סוחרים' } },
  { path: 'book-list-screen', component: BookListScreenComponent, data: { 'nav-bar-title': 'רשימת ספרים' } },
  { path: 'dealer-book-list', component: BookListScreenComponent, data: { 'nav-bar-title': 'סוחר: רשימת סופרים' } },
  { path: 'writer-details', component: WriterDetailsComponent, data: { 'nav-bar-title': 'פרטי סופר' } },
  { path: 'dealer-details', component: DealerDetailsComponent, data: { 'nav-bar-title': 'פרטי סוחר' } },
  { path: 'book-details', component: BookDetailsComponent, data: { 'nav-bar-title': 'פרטי ספר' } },
  { path: 'writer-reminders', component: RemindersListComponent, data: { 'nav-bar-title': 'תזכורות סופרים' } },
  { path: 'book-reminders', component: RemindersListComponent, data: { 'nav-bar-title': 'תזכורות ספרים' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
