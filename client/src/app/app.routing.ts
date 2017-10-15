// https://angular.io/docs/ts/latest/guide/router.html
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchDetailComponent } from './components/search-detail/search-detail.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { BoxedLayoutComponent } from './layouts/boxed/boxed.component';
import { BoxedWithSidebarLayoutComponent } from './layouts/boxed-with-sidebar/boxed-with-sidebar.component';

const appRoutes: Routes = [
  // Routes with "boxed" layout
  {path: '', component: BoxedLayoutComponent, children: [
    {path: 'search', component: SearchDetailComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: '', component: HomeComponent, pathMatch: 'full'},
  ]},

  // Routes with "boxed + sidebar" layout
  {path: '', component: BoxedWithSidebarLayoutComponent, children: [
    {path: 'properties/:slug', component: PropertyDetailComponent},
    {path: 'properties', component: PropertyListComponent},

    // Infinitely nested routes don't allow us to "[routeLink]" in .html templates because it throws exception.
    // So, it's better to use explicit nested routes rather than implicit.
    // https://stackoverflow.com/questions/44789867/uncaught-in-promise-typeerror-cannot-read-property-component-of-null
    // {path: 'category', component: PropertyListComponent, children: [
    //    {path: '**', component: PropertyListComponent}
    //  ]},
    {path: 'category/:slug1', component: PropertyListComponent},
    {path: 'category/:slug1/:slug2', component: PropertyListComponent},
    {path: 'category/:slug1/:slug2/:slug3', component: PropertyListComponent},
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
