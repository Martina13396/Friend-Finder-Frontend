import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService) {
  }

  isLoggedIn(): boolean {
    return this.authService.isUserLogin();
  }
  title = 'friendfinder';

  ngOnInit(): void {
  }
}
