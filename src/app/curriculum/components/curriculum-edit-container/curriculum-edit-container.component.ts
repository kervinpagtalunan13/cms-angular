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
  selector: 'app-curriculum-edit-container',
  templateUrl: './curriculum-edit-container.component.html',
  styleUrls: ['./curriculum-edit-container.component.css']
})
export class CurriculumEditContainerComponent{
  constructor(private curriculumService: CurriculumService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private commentService: CommentService,
              private dialog: MatDialog,
              private toast: ToastService
  ){}
  errorMessage:string = ''
  isLoading:boolean = true
  user!: User
  neededData = combineLatest([
    this.route.data,
    this.authService.getCurrentUser(),
    this.curriculumService.curriculums$,
    this.commentService.comments$,
    this.route.params.pipe(
      map(({id}) => id)
    )
  ]).pipe(
    tap(([data, user, curriculums, comments, id]) => {
      
      this.type = data['type']
      this.action = data['action']

      this.curriculum = curriculums.find(curriculum => curriculum.id == id)
      this.currUserId = this.curriculum.user_id
      this.departmentId = this.curriculum.department_id

      this.currentUser = user
      this.userId = this.currentUser.id
      this.role = this.currentUser.role
      this.comments = comments.filter(comment => comment.curriculum_id == id)
      this.user = this.curriculum.user
      this.subjects = JSON.parse(this.curriculum.metadata).subjects
      this.electiveSubjects = JSON.parse(this.curriculum.metadata).electiveSubjects
      this.title = `CICT ${this.curriculum.department.department_code.toUpperCase()} Curriculum version ${this.curriculum.version}`
      this.status = this.curriculum.status   
      this.author = this.curriculum?.user?.profile?.name || 'name not set yet'
      this.isLoading = false

    }),
    catchError(err => {
      this.errorMessage = 'something happened, please reload the page'
      this.isLoading = false
      return EMPTY
    })
  )
  departmentId:any = ''
  currentUser!:User
  userId:any = 0
  currUserId:any = 0
  electiveSubjects:any[] = []
  currentUser$ = this.authService.getCurrentUser().pipe(
    tap(user => {      
      this.role = user.role
      this.currentUser = user
      this.userId = user.id
    })
  )

  canEdit():boolean{
    return this.currUserId == this.userId && this.status != 'a'
  }

  submitted: boolean = false
  submit(data: any){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Update Curriculum',
        message: 'Are you sure you want to update this curriculum?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        // const body = {subjects: data.subjects, version: data.version, departmentId: result.departmentId}
        const body = {...data, subjects: { subjects: data.subjects, electiveSubjects: data.electiveSubjects }}

        
        this.curriculumService.updateCurriculum(this.curriculum.id, body).subscribe({
          next: (response:any) => {
            this.submitted = true
            this.router.navigate(['/curriculums', response.id])
            this.toast.showToastSuccess('Edited Successfully', `curriclum has been edited`)
          },
          error: err => {
            this.toast.showToastError('Creation Failed', `${err.message}`)
          }
        })

      } else {
      }
    });
  }

  role:any = ''
  comments:Comment[] = []
  curriculum:Curriculum2 | any
  type:string = ''
  action:string = ''
  descriptiveTitle:string = 'editing pending curriculum'
  author:any = ''
  subjects:any[] = []
  title = ''
  status = ''
  // curriculum$ = new Observable()
  buttonTxt = 'edit curriculum'

  canDeactivate(){
    return (this.submitted || !this.canEdit()) || confirm('Are you sure you want to discard your changes?')
  }
}
export function canDeactivateEditCur(component: CurriculumEditContainerComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  return component.canDeactivate();
}