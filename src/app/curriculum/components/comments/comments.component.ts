import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Comment } from '../../../core/models/comment'
import { NgForm } from '@angular/forms';
import { CommentService } from 'src/app/core/services/comment.service';
import { ContentService } from 'src/app/core/services/content.service';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { catchError } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnChanges, OnInit{
  constructor(private commentService: CommentService,
              private  contentService: ContentService,
              private dialog: MatDialog,
              private toast: ToastService
              ){}
  isDark = new AppComponent(this.contentService)
  commentsEditForm: any[] = []

  insideColor=''
  commentColor=''
  ngOnInit(){

    this.comments.forEach(comment => {
      this.commentsEditForm.push({id: comment.id, showEditForm: false})
    })

    this.commentService.commentSuccess.subscribe(
      data => {
        this.comment.subject = ''
        this.comment.body = ''
      }
    )
    this.contentService.contentAction$.subscribe(
      content => {
        if(!!Number(content.is_dark_mode_active)){
          this.insideColor='rgb(85, 85, 85)'
          this.commentColor='rgb(64, 64, 64)'
        }else{
          this.insideColor='#F8F8F8'
          this.commentColor='white'
        }
      }
    )
  }
  // @Input() comments:any
  @Input() type: string = ''
  @Input() action: string = ''
  @Input() role: string = ''
  @Input() userId: number|any
  
  @Input() comments: Comment[] = []
  @Output() addComment = new EventEmitter()

  height:number = 700

  comment = {
    subject: '',
    body: ''
  }

  ngOnChanges(){
    if(this.type == 'view' && this.role == 'reviewer') {
      this.height = 320}
  }

  submit(commentForm: NgForm){
    this.addComment.emit(commentForm.value)
  }

  deleteComment(id:number){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.deleteComment(id).subscribe(
          {
            next: comment => {
              this.comments = this.comments.filter(comment => comment.id != id)


              this.toast.showToastSuccess('Delete Success', 'your comment has been deleted')
            },
            error: err => {
              this.toast.showToastError('Delete failed', 'error occured while deleting the comment')
            }
          }
        )
      } 
    });
  }

  editComment(id: number, form: NgForm){
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Edit Comment',
        message: 'Are you sure you want to edit this comment?'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.editComment(id, form.value).subscribe(
          {
            next: comment => {
              this.comments = this.comments.map(comment => comment.id == id ? {...comment, body: form.value.body} : comment)

              this.clickCancelComment(id)

              this.toast.showToastSuccess('Edit Success', 'your comment has been updated')
            },
            error: err => {
              this.toast.showToastError('Edit failed', 'error occured while editing the comment')
            }
          }
        )
      } 
    });
  }

  clickEditComment(id: number){
    this.commentsEditForm = this.commentsEditForm.map(comment => comment.id == id ? {...comment, showEditForm: true} : comment)
  }

  clickCancelComment(id: number){
    this.commentsEditForm = this.commentsEditForm.map(comment => comment.id == id ? {...comment, showEditForm: false} : comment)
  }

  isShowForm(id: number){
    const show = this.commentsEditForm.find(comment => comment.id == id)
    return show ? show.showEditForm : false;
  }
}
