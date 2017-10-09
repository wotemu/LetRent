import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SafePipe } from './pipes/safe.pipe';
import { SearchComponent } from './components/search/search.component';
import { SearchDetailComponent } from './components/search-detail/search-detail.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { AuthService } from './security/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { NotificationService } from './services/notification.service';
import { PropertyService } from './services/property.service';
import { VideoService } from './services/video.service';
import { LoaderComponent } from './components/loader/loader.component';
import { PropertyImageUrlPipe } from './pipes/property-image-url.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    SafePipe,
    SearchComponent,
    SearchDetailComponent,
    VideoDetailComponent,
    VideoListComponent,
    PropertyListComponent,
    PropertyDetailComponent,
    RegistrationComponent,
    LoaderComponent,
    LoginComponent,
    PropertyImageUrlPipe,
  ],
  imports: [
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ToastModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthService, NotificationService, PropertyService, VideoService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
