import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard,NotAuthGuard } from './guards'


const routes: Routes = [
  {
    path: '',
    component:HomeComponent //Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent, // Dashboard Routep
    canActivate:[AuthGuard]
  },
     
  {
    path: 'register',
    component: RegisterComponent,// Register Route
    canActivate:[NotAuthGuard]
  },
  {
    path:'login',
    component:LoginComponent, // Login Route
    canActivate:[NotAuthGuard]
  },
  {
    path:'profile',
    component:ProfileComponent, //PRofile Route
    canActivate:[AuthGuard]
  },
  {
    path:'**', component: HomeComponent // Catch-all route
  }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [],
  exports:[RouterModule]
})

export class AppRoutingModule { }
