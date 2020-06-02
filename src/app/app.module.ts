import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


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

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    EditWriterComponent,
    ExpandableListComponent,
    NavBarComponent,
    ListItemComponent,
    WritersListScreenComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
