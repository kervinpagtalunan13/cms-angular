import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { ContentService } from 'src/app/core/services/content.service';
import { url } from 'src/app/core/url';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit{
  constructor(private contentService: ContentService,
    public dialogRef: MatDialogRef<ViewProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  modalColor=''
  baseUrl = url
  isDark = new AppComponent(this.contentService);
  ngOnInit(){
    if(this.isDark.isDarkMode){
      this.modalColor='#3b3b3b'
    }
    else{
      this.modalColor='#e4e4e7'
    }
  }
  get user() {
    return this.data.user;
  }
  get role(){
    return this.data.role
  }
  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
