import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { EditWriterComponent } from './writer-components/edit-writer/edit-writer.component';
import { ExpandableListComponent } from './expandable-list/expandable-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ListItemComponent } from './expandable-list/list-item/list-item.component';
import { WritersListScreenComponent } from './writer-components/writers-list-screen/writers-list-screen.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HebrewDateFormControlComponent } from './hebrew-date-form-control/hebrew-date-form-control.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { WriterDetailsComponent } from './writer-components/writer-details/writer-details.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './reducers';
import { WritersEffects } from './effects/writers.effects';
import { SearchResultComponent } from './search-result/search-result.component';
import { NoteDialogOutputComponent } from './note-dialog-output/note-dialog-output.component';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { WriterListItemComponent } from './writer-components/writer-list-item/writer-list-item.component';
import { EditDealerComponent } from './edit-dealer/edit-dealer.component';
import { DealerListScreenComponent } from './dealer-list-screen/dealer-list-screen.component';
import { DealerListItemComponent } from './dealer-list-item/dealer-list-item.component';
import { DealerDetailsComponent } from './dealer-details/dealer-details.component';
import { BookDetailsComponent } from './book-components/book-details/book-details.component';
import { BookListScreenComponent } from './book-components/book-list-screen/book-list-screen.component';
import { BookListItemComponent } from './book-components/book-list-item/book-list-item.component';
import { EditBookComponent } from './book-components/edit-book/edit-book.component';
import { PhonePipe } from './pipes/Phone/phone.pipe';
import { AudioHTML5Component } from './audio-html5/audio-html5.component';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { CurserSideByLanguagaDirective } from './directives/curser-side-by-languaga/curser-side-by-languaga.directive';
import { DoubleTapOpenImgDirective } from './directives/double-tap-open-img/double-tap-open-img.directive';
import { CookieModule } from 'ngx-cookie';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './login-page/login-page.component';
import { CurserToEndDirective } from './directives/curserToEnd/curser-to-end.directive';
import { SwipeDirective } from './directives/swipe/swipe.directive';
import { ReportPageComponent } from './report-page/report-page.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  decimal: '.',
  precision: 0,
  prefix: '$ ',
  suffix: '',
  thousands: ','
};

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    EditWriterComponent,
    ExpandableListComponent,
    NavBarComponent,
    ListItemComponent,
    WritersListScreenComponent,
    AdvancedSearchComponent,
    WriterListItemComponent,
    HebrewDateFormControlComponent,
    NoteDialogComponent,
    NoteDialogOutputComponent,
    WriterDetailsComponent,
    SearchResultComponent,
    RemindersListComponent,
    EditDealerComponent,
    DealerListScreenComponent,
    DealerListItemComponent,
    DealerDetailsComponent,
    BookDetailsComponent,
    BookListScreenComponent,
    BookListItemComponent,
    EditBookComponent,
    PhonePipe,
    AudioHTML5Component,
    CurserSideByLanguagaDirective,
    DoubleTapOpenImgDirective,
    LoginPageComponent,
    CurserToEndDirective,
    SwipeDirective,
    ReportPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    RouterModule,
    HttpClientModule,
    GoogleMapsModule,
    NgbModule,
    FormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    CookieModule.forRoot(),
    CurrencyMaskModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([WritersEffects]),
    NgxDatatableModule,
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
