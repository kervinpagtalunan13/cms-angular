import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Comment } from '../../../core/models/comment'
import { NgForm } from '@angular/forms';
import { CommentService } from 'src/app/core/services/comment.service';
import { AppComponent } from 'src/app/app.component';
import { ContentService } from 'src/app/core/services/content.service';
import context from 'react-bootstrap/esm/AccordionContext';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnChanges, OnInit{
  constructor(private commentService: CommentService,
    private contentService: ContentService){}

    
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
  insideColor=''
  commentColor=''
isDark = new AppComponent(this.contentService)
  ngOnInit(): void {
    this.commentService.commentSuccess.subscribe(
      data => {
        this.comment.subject = ''
        this.comment.body = ''
      }
    )
    if(this.isDark.isDarkMode){
      this.insideColor='rgb(85, 85, 85)'
      this.commentColor='rgb(64, 64, 64)'
    }
    else{
      this.insideColor='#F8F8F8'
      this.commentColor='white'
    }
  }

  ngOnChanges(){
    if(this.type == 'view' && this.role == 'reviewer') 
      this.height = 450
  }

  submit(commentForm: NgForm){
    this.addComment.emit(commentForm.value)
  }
}
