import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';
import {inject} from "@angular/core";

export const authForwardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService;
  const location = inject(Location) as Location;

  if (authService.isLoggedIn()) {
    location.back();
    return false;
  }
  return true;
};
