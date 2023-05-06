import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EMPTY, Observable, catchError, combineLatest, map, tap } from 'rxjs';
import { Comment } from 'src/app/core/models/comment';
import { Curriculum2 } from 'src/app/core/models/curriculum';
import { Profile, User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-curriculum-view-container',
  templateUrl: './curriculum-view-container.component.html',
  styleUrls: ['./curriculum-view-container.component.css']
})
export class CurriculumViewContainerComponent{
  constructor(private curriculumService: CurriculumService,
              private authService: AuthService,
              private commentService: CommentService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private toast: ToastService,
    ){}

  currUserId:any = 0
  userId:any = 0
  comments:Comment[] = []
  created_at: string = ''
  author: any = ''
  type:string = ''
  action:string = ''
  role:any = ''
  curriculum: Curriculum2 | any
  subjects:any[] = []
  title = ''
  status = ''
  isLoading:boolean = true
  error:boolean = false
  currentUser!:User
  electiveSubjects: any[] = []
  departmentId:any = ''
  revisions: any[] = []
  authorPic: string = ''
  reviewerName: string = ''
  reviewerPic: string = ''
  version: any
  reviewer: any
  versions: any[] = []
  user!: User
  openRevisionList(){
    this.dialog.open(RevisionListDialogComponent, {
      data: {
        revisions: this.revisions
      }
    })
  }

  needeedData$ = combineLatest([
    this.route.data,
    this.authService.getCurrentUser(),
    this.curriculumService.curriculums$,
    this.commentService.comments$,
    this.route.params.pipe(
      map(({id}) => id)
    ),
    this.curriculumService.revisions$,
    this.curriculumService.curriculumsOld$
  ]).pipe(
    tap(([data, user, curriculums, comments, id, revisions, curriculumOld]) => {
      this.type = data['type']
      this.action = data['action']

      this.curriculum = curriculums.find(curriculum => curriculum.id == id)
      this.currUserId = this.curriculum.user_id

      this.versions = curriculumOld.filter(old => old.curriculum_id == this.curriculum.id)
      
      this.reviewer = this.curriculum.approved_by
      
      this.user = this.curriculum.user
      this.currentUser = user
      this.userId = this.currentUser.id
      this.role = this.currentUser.role
      this.comments = comments.filter(comment => comment.curriculum_id == id)
      this.departmentId = this.curriculum.department_id
      this.title = `CICT ${this.curriculum.department.department_code.toUpperCase()} Curriculum version `

      this.version = this.curriculum.version

      this.revisions = revisions.filter(revision => revision.curriculum_id == this.curriculum.id && revision.status == 'a')
      
      this.subjects = JSON.parse(this.curriculum.metadata).subjects
      
      this.electiveSubjects = JSON.parse(this.curriculum.metadata).electiveSubjects

      this.status = this.curriculum.status   
      this.author = this.curriculum?.user?.profile?.name || 'not set his/her name yet'
      this.isLoading = false

    }),
    catchError(err => {
      
      this.error = true
      this.isLoading = false
      return EMPTY
    })
  )

  canEdit():boolean{
    return this.curriculum.user_id == this.currentUser.id
  }

  approve(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approve Curriculum',
        message: 'Are you sure you want to approve this curriculum?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.curriculumService.approveCurriculum(this.curriculum.id).subscribe({
          next: response => {
            this.status = 'a'
            this.curriculum.status = 'a'
            this.reviewer = response.approved_by
            this.toast.showToastSuccess('Approved Successfully', `curriculum has been approved`)
          },
          error: err => {
            this.toast.showToastError('Approved Failed', `Something occured while approving the curriculum`)

          }
        })
      } else {
      }
    });
  }
  edit(){
    this.router.navigate(['/curriculums', 'edit', this.curriculum.id])
  }
  revise(){
    console.log('revise');
    this.router.navigate(['/curriculums', 'revise', 'create', this.curriculum.id])
  }

  addComment(data:any){
    const comment = {...data, curriculumId: this.curriculum.id}
    this.commentService.addComment(comment).subscribe({
      next: data => {
        this.comments.unshift(data)
      },
      error: err => {
        console.log(err);
      }
    })
  }
  
  submit(data: any){
    this.curriculumService.updateCurriculum(this.curriculum.id, data).subscribe(
      data => {
        console.log(data)
        this.router.navigate(['/curriculums', this.curriculum.id])
      }   
    )
  }

  // curriculum = this.curriculumService.getCurriculum()
  curriculum$ = new Observable<Curriculum2>

}

@Component({
  selector: 'app-revision-list-dialog',
  templateUrl: './revision-list-dialog.component.html',
  // styleUrls: ['./revision-list-dialog.component.css']
})
export class RevisionListDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RevisionListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}
  get revisions() {
    return this.data.revisions;
  }
  clickView(id: number){
    this.dialogRef.close()
    this.router.navigate(['/', 'curriculums', 'revisions', id])
  }
}