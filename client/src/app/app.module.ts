import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'

import { AppRoutingModule } from './app-rouinting.module'
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component'
import { FlashMessagesModule,FlashMessagesService} from 'angular2-flash-messages';
import { AuthGuard,NotAuthGuard } from './guards';
import { BlogComponent } from './components/blog/blog.component';
import { BlogService } from './services/blog.service';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { FormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent


  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [AuthService,FlashMessagesService,AuthGuard,NotAuthGuard,BlogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
