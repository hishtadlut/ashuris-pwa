import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
import { areYouSureYouWantToLeaveThePage } from './utils/utils';
import { LocationPath } from './enums';
import { LoginPageComponent } from './login-page/login-page.component';

import { LoginGuard } from './guards/login-guard/login-guard.guard';

const routes: Routes = [
  { path: 'login-page', component: LoginPageComponent },
  {
    path: '', component: HomePageComponent, pathMatch: 'full', canActivate: [LoginGuard],
  },
  { path: 'home-page-remove-item', component: HomePageComponent, pathMatch: 'full' },
  {
    path: 'edit-writer',
    component: EditWriterComponent,
    data: { 'nav-bar-title': 'עריכת סופר' },
    canDeactivate: ['LeavePageGourd'],
    canActivate: [LoginGuard]
  },
  {
    path: 'create-writer',
    component: EditWriterComponent,
    data: { 'nav-bar-title': 'הוספת סופר חדש' },
    canDeactivate: ['LeavePageGourd'],
    canActivate: [LoginGuard]
  },
  {
    path: 'edit-dealer',
    component: EditDealerComponent,
    data: { 'nav-bar-title': 'עריכת סוחר' },
    canActivate: [LoginGuard],
    canDeactivate: ['LeavePageGourd']
  },
  {
    path: 'edit-book',
    component: EditBookComponent,
    data: { 'nav-bar-title': 'עריכת ספר' },
    canDeactivate: ['LeavePageGourd'],
    canActivate: [LoginGuard],
  },
  {
    path: 'writers-advanced-search',
    component: AdvancedSearchComponent,
    data: { 'nav-bar-title': 'סופרים: חיפוש מתקדם' },
    canActivate: [LoginGuard]
  },
  {
    path: 'books-advanced-search',
    component: AdvancedSearchComponent,
    data: { 'nav-bar-title': 'ספרים: חיפוש מתקדם' },
    canActivate: [LoginGuard]
  },
  {
    path: 'writers-search-result',
    component: SearchResultComponent,
    data: { 'nav-bar-title': 'סופרים: תוצאות חיפוש' },
    canActivate: [LoginGuard]
  },
  {
    path: 'books-search-result',
    component: SearchResultComponent,
    data: { 'nav-bar-title': 'ספרים: תוצאות חיפוש' },
    canActivate: [LoginGuard],
  },
  {
    path: 'create-dealer',
    component: EditDealerComponent,
    data: { 'nav-bar-title': 'הוספת סוחר חדש' },
    canDeactivate: ['LeavePageGourd'],
    canActivate: [LoginGuard],
  },
  {
    path: 'create-dealer-for-book',
    component: EditDealerComponent,
    data: { 'nav-bar-title': 'הוספת סוחר חדש' },
    canDeactivate: ['LeavePageGourd'],
    canActivate: [LoginGuard],
  },
  {
    path: 'save-dealer-for-book',
    redirectTo: LocationPath.CREATE_BOOK,
    pathMatch: 'full',
    canActivate: [LoginGuard],
  },
  {
    path: 'create-book',
    component: EditBookComponent,
    data: { 'nav-bar-title': 'הוספת ספר חדש' },
    canDeactivate: ['LeavePageGourd'],
    canActivate: [LoginGuard],
  },
  {
    path: 'writers-in-room-list',
    component: WritersListScreenComponent,
    data: { 'nav-bar-title': 'סופרים בחדר' },
    canActivate: [LoginGuard],
  },
  {
    path: 'writers-list-screen',
    component: WritersListScreenComponent,
    data: { 'nav-bar-title': 'רשימת סופרים' },
    canActivate: [LoginGuard]
  },
  {
    path: 'dealer-list-screen',
    component: DealerListScreenComponent,
    data: { 'nav-bar-title': 'רשימת סוחרים' },
    canActivate: [LoginGuard],
  },
  {
    path: 'book-list-screen',
    component: BookListScreenComponent,
    data: { 'nav-bar-title': 'רשימת ספרים' },
    canActivate: [LoginGuard],
  },
  {
    path: 'dealer-book-list',
    component: BookListScreenComponent,
    data: { 'nav-bar-title': 'סוחר: רשימת ספרים' },
    canActivate: [LoginGuard],
  },
  {
    path: 'writer-details',
    component: WriterDetailsComponent,
    data: { 'nav-bar-title': 'פרטי סופר' },
    canActivate: [LoginGuard],
  },
  {
    path: 'dealer-details',
    component: DealerDetailsComponent,
    data: { 'nav-bar-title': 'פרטי סוחר' },
    canActivate: [LoginGuard],
  },
  {
    path: 'book-details',
    component: BookDetailsComponent,
    data: { 'nav-bar-title': 'פרטי ספר' },
    canActivate: [LoginGuard],
  },
  {
    path: 'writer-reminders',
    component: RemindersListComponent,
    data: { 'nav-bar-title': 'תזכורות סופרים' },
    canActivate: [LoginGuard],
  },
  {
    path: 'book-reminders',
    component: RemindersListComponent,
    data: { 'nav-bar-title': 'תזכורות ספרים' },
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [
    {
      provide: 'LeavePageGourd',
      useValue: (
        component: EditBookComponent | EditWriterComponent | EditDealerComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
      ) => {
        const allowedPaths = [
          LocationPath.WRITERS_LIST_SCREEN,
          LocationPath.BOOK_LIST_SCREEN,
          '/dealer-list-screen',
          LocationPath.CREATE_BOOK,
          LocationPath.REMOVE_ITEM,
          LocationPath.CREATE_DEALER_FOR_BOOK,
        ];
        if (allowedPaths.includes(nextState.url)) {
          return true;
        }
        return areYouSureYouWantToLeaveThePage();
      }
    }
  ]
})
export class AppRoutingModule { }
