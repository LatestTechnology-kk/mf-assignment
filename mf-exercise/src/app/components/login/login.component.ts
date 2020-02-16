import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppInfoService } from 'src/app/services/app-info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  enablelogin: boolean = false;
  invalidUser: boolean = false;
  public userName: string = '';
  constructor(private router: Router,
    private appInfoService: AppInfoService) { }

  ngOnInit() {
    
  }
  checkUsername(value: string) {
    this.enablelogin = (value.length > 0) ? true : false;
  }

  login(value): void {
    let success: boolean = false;
    this.appInfoService.userList.forEach((user) => {
      if(user.userName === this.userName) {
        success = true;
        this.router.navigate(['/home'], {state: {data: user}});
      }
    });
    if (!success) {
      this.invalidUser = true;
    }
  }
}
