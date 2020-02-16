import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { userInfo } from 'src/app/model/userInfo.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppInfoService } from 'src/app/services/app-info.service';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.scss']
})
export class AddEditPostComponent implements OnInit {
  postTitle: string = 'New Post';
  user: userInfo = history.state.data;
  loggedInUserName: string;
  addEditForm: FormGroup;
  enableButtons: boolean = false;

  constructor(private router: Router,
    private appInfoService: AppInfoService) { }

  ngOnInit() {
    this.loggedInUserName = this.user.name;
    let titleMsg = '';
    let bodyMsg = '';
  if(history.state.postType != undefined && history.state.postType == 'edit') {
      this.postTitle = 'Edit Post';
      titleMsg = history.state.data.title;
      bodyMsg = history.state.data.body;
    }
    this.addEditForm = new FormGroup({
      titleMsg: new FormControl(titleMsg, Validators.maxLength(200)),
      bodyMsg: new FormControl(bodyMsg, Validators.maxLength(2000))
    });
  }

  checkFormValidaiton() {
    let title = this.addEditForm.get('titleMsg');
    let body = this.addEditForm.get('bodyMsg');
    if((this.user.title !== title.value || this.user.body !== body.value) &&
    title.value.length > 0 && !title.hasError('maxlength') && body.value.length > 0 &&
    !body.hasError('maxlength')) {
        this.enableButtons = true;
      } else {
        this.enableButtons = false;
      }
  }
  backToHome(): void {
    if((this.addEditForm.get('titleMsg').value.length > 0 ||
    this.addEditForm.get('bodyMsg').value.length > 0) &&
    !(this.user.title === this.addEditForm.get('titleMsg').value &&
    this.user.body === this.addEditForm.get('bodyMsg').value)) {
      this.warningMsg();
    } else {
      this.router.navigate(['/home'], {state: {data: this.user}});
    }
  }

  onSubmit(event) {console.log('1111');
    let userRec: userInfo = {
      id: (this.postTitle === 'New Post') ? this.appInfoService.userList.length+1 : this.user.id,
      userId: this.user.userId,
      userName: this.user.userName,
      name: this.user.name,
      companyName: this.user.companyName,
      title: this.addEditForm.get('titleMsg').value,
      body: this.addEditForm.get('bodyMsg').value,
      website: this.user.website
    }
    if(this.postTitle === 'New Post') {
      this.appInfoService.userList.unshift(userRec);
    } else {
      this.appInfoService.userList.forEach((user, index) => {
        if(user.id == this.user.id) {
          this.appInfoService.userList[index] = userRec;
          return false;
        }
      });
    }
    let msg = (this.postTitle == 'New Post') ? 'new' : 'edit';
    this.router.navigate(['/home'], {state: {data: this.user, message: msg}});
  }

  warningMsg() {
    var confirmation = confirm("Data not saved, do you want to save them ?");
    if (confirmation != true) {
      this.router.navigate(['/home'], {state: {data: this.user}});
    }
  }

  delete() {
    var confirmation = confirm("Are you sure you want to delete this post?");
    if (confirmation == true) {
      this.appInfoService.userList.forEach((user, index) => {
        if(user.id == this.user.id) {
          this.appInfoService.userList.splice(index, 1);
          return false;
        }
      });
      this.router.navigate(['/home'], {state: {data: this.user, message: 'delete'}});
    }
  }
}