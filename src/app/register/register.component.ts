import { Component } from '@angular/core';
import { AccountService } from '../core/services/account.service';
import { AppError } from '../core/models/app-error';
import { ToastService } from '../shared/services/toast.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DepartmentService } from '../core/services/department.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private accountService: AccountService,
    private toast: ToastService,
    private departmentServiec: DepartmentService
  ){}

  departments$ = this.departmentServiec.departments2$
  showDep=true;
  role='chair';
  error$ = new Subject<string>();
  success$ = new Subject<string>()
  isShowDep(){
    if(this.role == 'reviewer'){
      this.showDep=false;
    }else{
      this.showDep=true;
    }
  }
  closeAlert(){
    this.error$.next('')
  }

  closeSuccessAlert(){
    this.success$.next('')
  }

  submitForm(form: NgForm){
    if(form.value.role != 'reviewer' && !form.value.departmentId){
      this.error$.next('Please select a Department.')
      this.success$.next('')
      return 
    }

    this.accountService.register(form.value).subscribe({
      next: data => {
        this.error$.next('')
        this.success$.next('Wait for admin to approve/review your account.')
        // this.toast.showToastSuccess('Register Successfuly', 'Wait for admin to approve your account.')
      },
      error: (err: AppError) => {
        this.error$.next(err.message)
        this.success$.next('')

        // this.toast.showToastError('Creation Failed', err.message)
      }
    })
  }
}
