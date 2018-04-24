import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  currentURL;
  username;
  email;
  foundProfile = false;
  constructor(private authService:AuthService, private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.currentURL = this.activatedRoute.snapshot.params;
    this.authService.getPublicProfile(this.currentURL.username).subscribe(data => {
      this.username = data.user.username;
      this.email = data.user.email;
    });
  }

}
