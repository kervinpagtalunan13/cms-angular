import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, tap } from 'rxjs';
import { Curriculum2 } from 'src/app/core/models/curriculum';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { subjects } from '../curriculum-view/curriculum-view.component';
import { CommentService } from 'src/app/core/services/comment.service';
import { Comment } from 'src/app/core/models/comment';

@Component({
  selector: 'app-curriculum-create-revision-container',
  templateUrl: './curriculum-create-revision-container.component.html',
  styleUrls: ['./curriculum-create-revision-container.component.css']
})
export class CurriculumCreateRevisionContainerComponent implements OnInit{

  constructor(private curriculumService: CurriculumService,
              private route: ActivatedRoute,
              private commentService: CommentService
    ){}
  
  errorMessage$ = new Subject<string>()

  comments: Comment[] = []
  isLoading:boolean = true
  curriculum!: Curriculum2
  descriptiveTitle:string = 'revising'
  subjects:subjects[] = [
    {
      firstSem: [],
      secondSem: [],
    }
  ]
  type:string = ''
  action:string = ''
  title:string = ''
  author:any = ''
  created_at:string = ''
  status:string = ''
  buttonTxt = 'submit revision'

  submit(subjects: any){
    const data = { curriculumId: this.curriculum.id, metadata: subjects.subjects, version: subjects.version }
    console.log(data);
    
    this.curriculumService.createRevision(data).subscribe({
      next: datas => console.log(datas),
      error: err => console.log(err)
    })
  }

  ngOnInit(): void {
    this.route.data.subscribe((data:any) => {
      console.log(data);
      
      this.type = data.type
      this.action = data.action
    })

    this.route.params.subscribe(({id}) => {
      this.curriculumService.getCurriculum(id).subscribe({
        next: curriculum => {
          this.curriculum = curriculum
          console.log(JSON.parse(curriculum.metadata));
          
          // console.log(JSON.parse(data.metadata))
          this.subjects = JSON.parse(curriculum.metadata)
          this.title = `CICT ${curriculum.department.department_code} Curriculum version ${curriculum.version}`
          this.author = curriculum.user?.profile?.name

          this.commentService.getCurriculumComments(this.curriculum.id).pipe(
            tap(comments => this.comments = comments)
          ).subscribe()
          
        },
        error: err => {
          this.errorMessage$.next(err.message)
        },
      })
    })
  }
   
}
