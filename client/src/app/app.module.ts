import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SafePipe } from './utils/pipes/safe.pipe';
import { SearchComponent } from './components/search/search.component';
import { SearchDetailComponent } from './components/search-detail/search-detail.component';
import { AuthService } from './security/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { NotificationService } from './services/notification.service';
import { AccountService } from './services/account.service';
import { PropertyService } from './services/property.service';
import { LoaderComponent } from './components/loader/loader.component';
import { PropertyImageUrlPipe } from './utils/pipes/property-image-url.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastsManager } from 'ng2-toastr';
import { ToastsSettingsManager } from './utils/toasts-settings-manager';
import { PropertyCategoryService } from './services/property-category.service';
import { Helper } from './utils/helper';
import { PropertyCategoryListComponent } from './components/property-category-list/property-category-list.component';
import { CategoryTreeView } from './components/property-category-list/tree-view.directive';
import { BoxedLayoutComponent } from './layouts/boxed/boxed.component';
import { BoxedWithSidebarLayoutComponent } from './layouts/boxed-with-sidebar/boxed-with-sidebar.component';
import { PropertyPricePipe } from './utils/pipes/property-price.pipe';
import { FullnamePipe } from './utils/pipes/fullname.pipe';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProfileComponent } from './components/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { AuthModule } from './security/auth.module';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatService } from './services/chat.service';
import { StarsDirective } from './components/stars/stars.directive';
import { UserAvatarUrlPipe } from './utils/pipes/user-avatar-url.pipe';
import { RelativeTimePipe } from './utils/pipes/relative-time.pipe';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    SafePipe,
    SearchComponent,
    SearchDetailComponent,
    PropertyCategoryListComponent,
    CategoryTreeView,
    PropertyListComponent,
    PropertyDetailComponent,
    RegistrationComponent,
    LoaderComponent,
    LoginComponent,
    BoxedLayoutComponent,
    BoxedWithSidebarLayoutComponent,
    PropertyImageUrlPipe,
    PropertyPricePipe,
    FullnamePipe,
    UserAvatarUrlPipe,
    RelativeTimePipe,
    ProfileComponent,
    ChatsComponent,
    StarsDirective,
  ],
  imports: [
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ToastModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey
    }),
    AuthModule,
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IonRangeSliderModule,
    ClickOutsideModule
  ],
  providers: [
    AuthService,
    NotificationService,
    ChatService,
    PropertyService,
    PropertyCategoryService,
    AccountService,
    {provide: ToastsManager, useClass: ToastsSettingsManager},
    Helper,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
