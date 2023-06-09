import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError, combineLatest, map, tap } from 'rxjs';
import { Comment } from 'src/app/core/models/comment';
import { Curriculum2 } from 'src/app/core/models/curriculum';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-curriculum-edit-revision-container',
  templateUrl: './curriculum-edit-revision-container.component.html',
  styleUrls: ['./curriculum-edit-revision-container.component.css']
})
export class CurriculumEditRevisionContainerComponent{
  constructor(private curriculumService: CurriculumService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private commentService: CommentService,
              private dialog: MatDialog,
              private toast: ToastService
          ){}

  userId:any = 0
  currUserId:any = 0
  currentUser!: User
  role:any = ''
  isLoading:boolean = true
  error: boolean = false
  comments:Comment[] = []
  subjects:any[] = []
  curriculum: any
  type:string = ''
  action:string = ''
  author:string = ''
  descriptiveTitle:string = 'editing revision'
  title = ''
  status = ''
  buttonTxt = 'edit curriculum'
  electiveSubjects:any[] = []
  curriculumDepartment:any = ''
  incrementRevision = false
  user!: User

  neededData$ = combineLatest([
    this.route.data,
    this.authService.getCurrentUser(),
    this.curriculumService.revisions$,
    this.commentService.comments$,
    this.route.params.pipe(
      map(({id}) => id)
    )
  ]).pipe(
    tap(([data, user, revisions, comments, id]) => {
      this.type = data['type']
      this.action = data['action']

      this.curriculum = revisions.find((curriculum:any) => curriculum.id == id)
      this.currUserId = this.curriculum.user_id

      this.incrementRevision = this.curriculum.increment_version

      this.currentUser = user
      this.userId = this.currentUser.id
      this.role = this.currentUser.role
      this.comments = comments.filter(comment => comment.curriculum_revision_id == id)
      this.user = this.curriculum.user
      this.title = `CICT ${this.curriculum.curriculum.department.department_code} Curriculum version ${this.curriculum.version}`

      this.subjects = JSON.parse(this.curriculum.metadata).subjects
      this.electiveSubjects = JSON.parse(this.curriculum.metadata).electiveSubjects
      this.curriculumDepartment = this.curriculum.curriculum.department_id

      this.status = this.curriculum.status   
      this.author = this.curriculum?.user?.profile?.name || 'name not set yet'
      this.isLoading = false
    }),
    catchError(err => {
      this.error = true
      this.isLoading = false
      return EMPTY
    })
  )

  canEdit(){
    return this.currUserId == this.userId && this.status != 'a'
  }

  submitted: boolean = false
  submit(subjects: any){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Update Revision',
        message: 'Are you sure you want to update this revision?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = {...subjects, subjects: {
          subjects: subjects.subjects,
          electiveSubjects: subjects.electiveSubjects,
          }, 
        id: this.curriculum.id
        }
        
        // const body = {...data, id: this.curriculum.id}
        this.curriculumService.updateRevision(data).subscribe({
          next: (response:any) => {
            this.submitted = true
            this.router.navigate(['/curriculums', 'revisions', response.id])
            this.toast.showToastSuccess('Edited Successfully', `revision has been edited`)
            
          },
          error: err => {
            this.toast.showToastError('Creation Failed', `${err.message}`)
          }
        })

      } else {
      }
    });
  }
  canDeactivate(){
    return (this.submitted || !this.canEdit()) || confirm('Are you sure you want to discard your changes?')
  }
}

export function canDeactivateEditRev(component: CurriculumEditRevisionContainerComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  return component.canDeactivate();
}
