import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWriterComponent } from './edit-writer/edit-writer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WritersListScreenComponent } from './writers-list-screen/writers-list-screen.component';


const routes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'edit-writer', component: EditWriterComponent },
  { path: 'home-page', component: HomePageComponent },
  { path: 'writers-list-screen', component: WritersListScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
