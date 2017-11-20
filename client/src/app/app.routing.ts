// https://angular.io/docs/ts/latest/guide/router.html
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchDetailComponent } from './components/search-detail/search-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PropertyComponent } from './components/property/property.component';
import { PropertyEditComponent } from './components/property-edit/property-edit.component';
import { ProfilePropertiesComponent } from './components/profile-properties/profile-properties.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { BoxedLayoutComponent } from './layouts/boxed/boxed.component';
import { BoxedWithSidebarLayoutComponent } from './layouts/boxed-with-sidebar/boxed-with-sidebar.component';
import { ChatsComponent } from './components/chats/chats.component';

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
    {path: 'profile', component: ProfileComponent},
    {path: 'search', component: SearchDetailComponent },

    {path: 'chats/:chatId', component: ChatsComponent},
    {path: 'chats', component: ChatsComponent},

    {path: 'profile', component: ProfileComponent },
    {path: 'property', component: PropertyComponent },
    {path: 'property-edit/:slug', component: PropertyEditComponent },
    {path: 'profile-properties', component: ProfilePropertiesComponent }
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
