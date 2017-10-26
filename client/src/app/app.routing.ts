// https://angular.io/docs/ts/latest/guide/router.html
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchDetailComponent } from './components/search-detail/search-detail.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { BoxedLayoutComponent } from './layouts/boxed/boxed.component';
import { BoxedWithSidebarLayoutComponent } from './layouts/boxed-with-sidebar/boxed-with-sidebar.component';

const appRoutes: Routes = [
  // Routes with "boxed + sidebar" layout
  {path: '', component: BoxedWithSidebarLayoutComponent, children: [
    {path: '', component: PropertyListComponent, pathMatch: 'full'}, // Homepage
    {path: 'properties/:slug', component: PropertyDetailComponent},
    {path: 'properties', component: PropertyListComponent},
  ]},

  // Routes with "boxed" layout
  {path: '', component: BoxedLayoutComponent, children: [
    {path: 'search', component: SearchDetailComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
  ]},

  // Routes with no layout
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
        appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
