import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AppError } from 'src/app/core/models/app-error';
import { Department } from 'src/app/core/models/department';
import { ContentService } from 'src/app/core/services/content.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { SubjectService } from 'src/app/core/services/subject.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-subject-add-dialog',
  templateUrl: './subject-add-dialog.component.html',
  styleUrls: ['./subject-add-dialog.component.css']
})
export class SubjectAddDialogComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<SubjectAddDialogComponent>, 
              private subjectService: SubjectService,
              private contentService: ContentService,
              private departmentService: DepartmentService,
              private toast: ToastService
    ) {}
    modalColor = ''
    isDark = new AppComponent(this.contentService)
  ngOnInit(){
    if(this.isDark.isDarkMode){
      this.modalColor='#3b3b3b'
    }
    else{
      this.modalColor='#e4e4e7'
    }
  }
    
  department:number = 1
  isElective:boolean = false

  departmentOnChange(){    
    if(this.department != 1){
      this.isElective = false
    } 
  }

  departments: Department[] | undefined
  departments$ = this.departmentService.departments$.subscribe({
    next: departments => {
      
      this.departments = departments
    }
  })

  closeAlert(){
    this.error$.next('')
  }

  closeSuccessAlert(){
    this.success$.next('')
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  selectedFile:any 
  onFileSelected(event:any) {
    this.selectedFile = event.target.files[0];
  }
  error$ = new Subject<string>();
  success$ = new Subject<string>()

  createSubject(form:any){
    let data = {...form.value}
    if(data.isElective){
      data = {...data,is_elective: data.description || 0, 
        description: !!data.description ? 'Elective ' + data.description : ''}
    }else{
      data.is_elective = 0
    }
    
    const fd = new FormData()
    
    fd.append('subjectCode', data.subjectCode)
    fd.append('description', data.description)
    fd.append('departmentId', data.departmentId)
    fd.append('is_elective', data.is_elective)
    fd.append('lab_units', data.lab_units)
    fd.append('lec_units', data.lec_units)
    fd.append('total_units',  (Number(data.lec_units) + Number(data.lab_units)).toString())
    fd.append('hrs_per_week', data.hrs_per_week)
    fd.append('syllabus', this.selectedFile)
    
    this.subjectService.addSubject(fd)
      .subscribe({
        next: data => {
          this.error$.next('')
          this.toast.showToastSuccess('Created Successfully', `${data.description} has been created succesfully`)
          this.dialogRef.close(true)
          // this.success$.next('Subject created Successfully')
        },
        error: (err:AppError) => {
          this.error$.next(err.message)
          this.success$.next('')
        }
      })
  }
}