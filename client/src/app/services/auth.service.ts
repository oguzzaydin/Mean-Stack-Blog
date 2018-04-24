import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthService {

   domain = "http://localhost:8080";
   authToken;
   user;
   options;

  constructor(private http: Http) { }

  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }
  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }
  
  registerUser(user) {
    return this.http.post(`${this.domain}/authentication/register`, user).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(`${this.domain}/authentication/checkUsername/${username}`).map(res => res.json());
  }


  chechkEmail(email) {
    return this.http.get(`${this.domain}/authentication/checkEmail/${email}`).map(res => res.json());
  }

  login(user){
    return this.http.post(`${this.domain}/authentication/login`,user).map(res => res.json());
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(`${this.domain}/authentication/profile`,this.options).map(res => res.json());
  }

  loggedIn(){
    return tokenNotExpired();
   
  }

  getPublicProfile(username) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/publicProfile/'+ username,this.options).map(res => res.json());
  }

}
