import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services'
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService:AuthService,private router: Router,private flashMesaagesService:FlashMessagesService ) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.authService.logout();
    this.flashMesaagesService.show('You are logged out', { cssClass: 'alert-info'});
    this.router.navigate(['/']);
  }
}
