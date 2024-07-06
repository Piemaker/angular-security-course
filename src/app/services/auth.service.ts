import { filter } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { User } from "../model/user";
import * as auth0 from "auth0-js";
import { Router } from "@angular/router";
import moment from "moment";

export const ANONYMOUS_USER: User = {
  id: undefined,
  email: "",
};

const AUTH_CONFIG = {
  clientID: "4yfnL97fPtexipECcVJOjTgJIm9Wxtup",
  domain: "dev-zuiogzmta56szxu4.us.auth0.com",
};

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: "token id_token",
    redirectUri: "https://localhost:4200/lessons",
  });

  private userSubject = new BehaviorSubject<User>(undefined);

  user$: Observable<User> = this.userSubject
    .asObservable()
    .pipe(filter((user) => !!user));

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.auth0.authorize();
  }

  signUp() {
    this.auth0.signup();
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigate(["/lessons"]);
  }

  retrieveAuthInfoFromUrl() {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        return;
      } else if (authResult && authResult.idToken) {
        this.setSession(authResult);
      }
    });
  }
  getExpiresAt() {
    if (localStorage.getItem("expires_at")) {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }
    return moment();
  }
  private setSession(authResult: any) {
    const expiresIn = moment().add(authResult.expiresIn, "seconds");
    localStorage.setItem("id_token", JSON.stringify(authResult));
    localStorage.setItem("expires_at", JSON.stringify(expiresIn.valueOf()));
  }
  public isLoggedIn() {
    return moment().isBefore(this.getExpiresAt());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
