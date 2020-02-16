import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppInfoService } from '../../services/app-info.service';
import { userInfo } from 'src/app/model/userInfo.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {//AfterViewInit
  personalInfo: any[];
  userPost: any[];
  displayUserPostInfo: userInfo[] = [];
  loggedInUserName: string;
  validUser: boolean = false;
  loggedInUser: boolean = false;
  currentUser: any = {};
  validationMsg: string = null;
  currentSetData: number = 10;
  disableNext: boolean = false;
  disablePrev: boolean = true;

  constructor(private router: Router,
    private appInfoService: AppInfoService
    ) { }

  logout() {
    localStorage.clear();
    this.loggedInUser = false;
    this.loggedInUserName = '';
  }

  ngOnInit() {
    if(history.state.data != undefined) {
      this.currentUser = history.state.data;
      this.loggedInUserName = this.currentUser.userName;
      this.loggedInUser = true;
      this.displayUserPostInfo = this.appInfoService.userList.slice(0, 10);
      let rec = {
        'currentUser': this.currentUser,
        'records': this.appInfoService.userList
      }
      localStorage.setItem('record', JSON.stringify(rec));
      
    } else if(localStorage.getItem('record') != null) {
      let userData = JSON.parse(localStorage.getItem('record'));
      this.currentUser = userData.currentUser;
      this.loggedInUserName = this.currentUser.userName;
      this.loggedInUser = true;
      this.appInfoService.userList = userData.records;
      this.displayUserPostInfo = userData.records.slice(0, 10);
    } else {
      this.appInfoService.getUserInfo().subscribe((responseList : any) => {
        this.personalInfo = responseList[0];
        this.userPost = responseList[1];
        let count: number = 0;
        this.personalInfo.forEach((personal) => {
          this.userPost.forEach((post) => {
            if(personal.id == post.userId) {
              this.appInfoService.userList.push({
                id: count++,
                userId: personal.id,
                userName: personal.username,
                name: personal.name,
                companyName: personal.company.name,
                title: post.title,
                body: post.body,
                website: personal.website
              });
            }
          })
        });
        this.displayUserPostInfo = this.appInfoService.userList.slice(0, 10);
        //this.displayUserPostInfo = this.appInfoService.userList.slice(0, 10);
      });
    }
    if(history.state.message != undefined) {
      if (history.state.message === 'new') {
        this.validationMsg = 'A new post was saved successfully';
      } else if (history.state.message === 'edit') {
        this.validationMsg = 'Post was updated successfully';
      } else if (history.state.message === 'delete') {
        this.validationMsg = 'Post was deleted successfully';
      } else {
        this.validationMsg = null;
      }
    }
  }

  /*ngAfterViewInit() {
    this.appInfoService.userList = this.displayUserPostInfo;
  }*/

  login() {
    this.router.navigate(['login']);
  }

  goToLink(url: string){
    window.open('http://'+url, "_blank");
  }

  newPost(): void {
    this.router.navigate(['/addEditPost'], {state: {data: this.currentUser, postType: 'new'}});
  }
  editPost(user: userInfo) {
    this.router.navigate(['/addEditPost'], {state: {data: user, postType: 'edit'}});
  }

  previousPage() {
    this.currentSetData -=10;
    this.displayUserPostInfo = this.appInfoService.userList.slice(this.currentSetData-10, this.currentSetData);
    if(this.currentSetData == 10) {
      this.disablePrev = true;
    }
    this.disableNext = false;
  }

  nextPage() {
    this.displayUserPostInfo = this.appInfoService.userList.slice(this.currentSetData, this.currentSetData+10);
    this.currentSetData +=10;
    if(this.currentSetData >= this.appInfoService.userList.length) {
      this.disableNext = true;
    }
    this.disablePrev = false;
  }
}
