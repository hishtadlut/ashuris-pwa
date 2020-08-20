import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { EditWriterComponent } from './edit-writer/edit-writer.component';
import { ExpandableListComponent } from './expandable-list/expandable-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ListItemComponent } from './expandable-list/list-item/list-item.component';
import { WritersListScreenComponent } from './writers-list-screen/writers-list-screen.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { WriterListItemComponent } from './writers-list-screen/writer-list-item/writer-list-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HebrewDateFormControlComponent } from './hebrew-date-form-control/hebrew-date-form-control.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { WriterDetailsComponent } from './writer-details/writer-details.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './reducers';
import { WritersEffects } from './effects/writers.effects';
import { SearchResultComponent } from './search-result/search-result.component';

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
    WriterDetailsComponent,
    SearchResultComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    RouterModule,
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
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([WritersEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
