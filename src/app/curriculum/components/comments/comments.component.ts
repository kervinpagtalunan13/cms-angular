import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Comment } from '../../../core/models/comment'
import { NgForm } from '@angular/forms';
import { CommentService } from 'src/app/core/services/comment.service';
import { ContentService } from 'src/app/core/services/content.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnChanges, OnInit{
  constructor(private commentService: CommentService,
    private  contentService: ContentService){}
  isDark = new AppComponent(this.contentService)
  
  insideColor=''
  commentColor=''
  ngOnInit(){
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
}
