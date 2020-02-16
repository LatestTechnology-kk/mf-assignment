import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs';
import { userInfo } from '../model/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {
  public userList: userInfo[] = [];
  constructor(private http: HttpClient) { }

  getUserInfo (): Observable<any []> {
    let personalInfo = this.http.get('https://jsonplaceholder.typicode.com/users');
    let userPost = this.http.get('https://jsonplaceholder.typicode.com/posts');
    return forkJoin([personalInfo, userPost]);
  }

  getUserObj(): userInfo[] {
    return this.userList;
  }
}
