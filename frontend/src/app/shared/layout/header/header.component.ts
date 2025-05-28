import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  isLogged: boolean = false;
  userName: string | null = null;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
  ) {
    this.isLogged = authService.isLoggedIn();
  }

  ngOnInit() {
    this.authService.isLogged$
      .subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
      });
    this.authService.userName$
      .subscribe((userName: string | null)  => {
        this.userName = userName;
      });

    if (this.isLogged) {
      this.authService.getUserInfo()
        .subscribe((data: UserInfoType | DefaultResponseType) => {
          if (data as UserInfoType) {
            this.authService.setUserName((data as UserInfoType).name);
          }
        })
    }
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.setUserName(null);
    this._snackBar.open('Вы вышли из системы')
    this.router.navigate(['/']);
  }
}
