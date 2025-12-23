import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componants/header/header.component';
import { FooterComponent } from './componants/footer/footer.component';
import { SignUpComponent } from './componants/sign-up/sign-up.component';
import { ContactComponent } from './componants/contact/contact.component';
import { UserhomeComponent } from './componants/userhome/userhome.component';
import { LeftBarComponent } from './componants/userhome/left-bar/left-bar.component';
import { RightBarComponent } from './componants/userhome/right-bar/right-bar.component';
import { PublishComponent } from './componants/userhome/publish/publish.component';
import { FriendsComponent } from './componants/userhome/friends/friends.component';
import { CoolImagesComponent } from './componants/userhome/cool-images/cool-images.component';
import { MainPageComponent } from './componants/userhome/main-page/main-page.component';
import { TimeLinesComponent } from './componants/time-lines/time-lines.component';
import { TimeLineComponent } from './componants/time-lines/time-line/time-line.component';
import { TimeAboutComponent } from './componants/time-lines/time-about/time-about.component';
import { TimeAlbumComponent } from './componants/time-lines/time-album/time-album.component';
import { TimeFriendsComponent } from './componants/time-lines/time-friends/time-friends.component';
import { TimeLineProfileComponent } from './componants/time-lines/time-line-profile/time-line-profile.component';
import {

  TimeLineDetailsComponent
} from './componants/time-lines/time-line-details/time-line-details.component';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './componants/login/login.component';
import {LoginSignupGuard} from '../guard/login-signup.guard';
import {AuthGuard} from '../guard/auth.guard';
import {APP_BASE_HREF} from '@angular/common';
import {AuthInterceptor} from '../interceptors/auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { FriendRequestsComponent } from './componants/friend-requests/friend-requests.component';

// http://localhost:4200

const routes: Routes = [
  {path: 'sign-up', component: SignUpComponent , canActivate:[LoginSignupGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoginSignupGuard]},
  {path: 'mainpage', component: MainPageComponent , canActivate:[AuthGuard]},
  {path: 'contact', component: ContactComponent, canActivate:[AuthGuard]},
  {path: 'friend-requests', component:FriendRequestsComponent, canActivate:[AuthGuard]},
  {path: 'timeline/:email', component: TimeLineComponent, canActivate: [AuthGuard]},
  {path: 'timeline-about/:email', component: TimeAboutComponent , canActivate: [AuthGuard]},
  {path: 'timeline-friends/:email', component: TimeFriendsComponent , canActivate: [AuthGuard]},
  {path: 'timeline-album/:email', component: TimeAlbumComponent , canActivate: [AuthGuard]},
  {path: 'timeline-details/:email', component: TimeLineDetailsComponent , canActivate: [AuthGuard]},
  {path: 'timeline', component: TimeLineComponent, canActivate: [AuthGuard]},
  {path: 'timeline-about', component: TimeAboutComponent , canActivate: [AuthGuard]},
  {path: 'timeline-friends', component: TimeFriendsComponent , canActivate: [AuthGuard]},
  { path: 'all-friends', component: FriendsComponent , canActivate: [AuthGuard]},
  {path: 'timeline-album', component: TimeAlbumComponent , canActivate: [AuthGuard]},
  {path: 'album/:type', component: CoolImagesComponent , canActivate: [AuthGuard]},
  {path: 'timeline-details', component: TimeLineDetailsComponent , canActivate: [AuthGuard]},
  {path: '', component: MainPageComponent , canActivate: [AuthGuard]},
  {path: '**', component: MainPageComponent , canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    ContactComponent,
    UserhomeComponent,
    LeftBarComponent,
    RightBarComponent,
    PublishComponent,
    FriendsComponent,
    CoolImagesComponent,
    MainPageComponent,
    TimeLinesComponent,
    TimeLineComponent,
    TimeAboutComponent,
    TimeAlbumComponent,
    TimeFriendsComponent,
    TimeLineProfileComponent,
    TimeLineDetailsComponent,
    LoginComponent,
    FriendRequestsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
