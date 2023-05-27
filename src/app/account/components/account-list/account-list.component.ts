import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, EMPTY, Subject, catchError, combineLatest, tap } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { AccountService } from 'src/app/core/services/account.service';
import {MatDialog} from '@angular/material/dialog';
import {AccountRegistrationComponent} from 'src/app/account/components/account-registration/account-registration.component'
import { AuthService } from 'src/app/core/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewProfileComponent } from 'src/app/shared/components/view-profile/view-profile.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { url } from 'src/app/core/url';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
export interface UserData {
  age: number;
  name: string;
}
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})


export class AccountListComponent2{
  
  constructor(private accountService: AccountService, 
              private dialog: MatDialog,
              private authService: AuthService,
              private toast: ToastService
              ) {}

  baseUrl = url
  user:User | any
  role:any = ''
  isLoading:boolean = true
  error: boolean = false
  users: User[] = []
  pendingUsers: User[] = []
  inactiveUsers: User[] = []
  selectedTabIndex = 0
  neededData$ = combineLatest([
    this.accountService.users$,
    this.authService.getCurrentUser(),
    this.authService.currentUser$,
    this.accountService.registerUser$,
    this.accountService.toggleStatus$
  ]).pipe(
    tap(([users, userObs, user, registeredUser, toggleStatus]) => {
      this.user = user
      this.role = user?.role
      this.isLoading = false

      this.pendingUsers = users.filter(user => !user.is_approved)
      this.users = users.filter(user => user.status == 'a' && user.is_approved)
      this.inactiveUsers = users.filter(user => user.status == 'i' && user.is_approved)
      

      if(registeredUser){
        if(!(users.map(user => user.id).includes(registeredUser.id))){
          this.users.unshift(registeredUser)
        }
      }

      if(toggleStatus){
        if(toggleStatus.status == 'a'){
          if(!this.users.find(user => user.id == toggleStatus.id))
            this.users.unshift(toggleStatus)
          this.inactiveUsers = this.inactiveUsers.filter(user => user.id != toggleStatus.id)
        }else{
          if(!this.inactiveUsers.find(user => user.id == toggleStatus.id))
            this.inactiveUsers.unshift(toggleStatus)
          this.users = this.users.filter(user => user.id != toggleStatus.id)
        }
      }

    }),
    catchError(err => {
      this.isLoading = false
      this.error = true
      return EMPTY
    })
  )

  canView(){
    return this.role === 'admin'
    // return true
  }

  inactiveUsersFilter = ""
  filteredInactiveUsers(){
    if(!this.inactiveUsersFilter){
      return this.inactiveUsers
    }

    const filter = this.inactiveUsersFilter.toLocaleLowerCase();
    return this.inactiveUsers.filter(user => {
      return user.profile?.name.toLocaleLowerCase().includes(filter)||
      user.department?.description.toLocaleLowerCase().includes(filter)||
      user.department?.department_code.toLocaleLowerCase().includes(filter)||
      user.email.toLocaleLowerCase().includes(filter)||
      user.role.toLocaleLowerCase().includes(filter)
    })
  }

  pendingUsersFilter = ""
  filteredPendingUsers(): User[]{
    if(!this.pendingUsersFilter){
      return this.pendingUsers
    }

    const filter = this.pendingUsersFilter.toLocaleLowerCase();
    return this.pendingUsers.filter(user => {
      return user.department?.description.toLocaleLowerCase().includes(filter)||
      user.department?.department_code.toLocaleLowerCase().includes(filter)||
      user.email.toLocaleLowerCase().includes(filter)||
      user.role.toLocaleLowerCase().includes(filter)
    })
  }

  approveAccountCreation(userParam: User){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approve account?',
        message: 'Are you sure you want to approve this account to be created?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.accountService.approveAccount(userParam.id).subscribe(
          {
            next: user => {
              this.pendingUsers = this.pendingUsers.filter(user => user.id != userParam.id)
              this.users.unshift(userParam);
      
              this.toast.showToastSuccess('Approve Successfuly', 'User has been changed successfully')
            },
            error: err => {
              this.toast.showToastError('Approve Error', 'Error occured while approving account')
            }
          }
        )


      } 
    });
  }

  viewProfile(user: User){
    const dialogRef = this.dialog.open(ViewProfileComponent, {
      data: {
        user: user,
        role: this.role
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const status = user.status == 'a' ? 'i' : 'a'
        const data = {status: status}
        this.accountService.toggleStatus(user.id, data).subscribe(
          data => {
            this.users = this.users.map(use => use.id != user.id ? use : {...use, status: data.status})

            this.toast.showToastSuccess('Update Successfuly', 'User status has been changed successfully')
          }
        )
      } else {

      }
    });
  }

  isLoading$ = new BehaviorSubject<boolean>(true)


  openDialog() {
    const dialogRef = this.dialog.open(AccountRegistrationComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  private _listFilter: string = '';
  get listFilter(): string{ 
    return this._listFilter;
  }
  set listFilter(value: string){
      this._listFilter=value;
      this.filteredList = this.performFilter(value);
  }

  filteredList: User[] = [];
 
//pangfilter 
performFilter(filterBy: string): User[]{
  filterBy = filterBy.toLocaleLowerCase();
  return this.users.filter((titles: User)=>
  titles.profile?.name.toLowerCase().includes(filterBy)||
  titles.department?.description.toLowerCase().includes(filterBy)||
  titles.department?.department_code.toLowerCase().includes(filterBy)||
  titles.email.toLowerCase().includes(filterBy)||
  titles.role.toLowerCase().includes(filterBy)
  );
}
//pangfilter

//paginator
totalItems = this.users.length; // Total number of items in your table
pageSize = 10; // Number of items to display per page
pageSizeOptions = [3, 5, 10]; // Options for the number of items per page

currentPageIndex = 0; // Current page index
displayedItems: any[] = []; // The items to display on the current page
//paginator


//pang filter
ngOnInit(): void {
  this.listFilter = '';
}
//pang filter

//pang check kung may laman yung search input (para di mawalan ng laman yung table)
ngDoCheck(): void{
  if(!this.listFilter){
    this.totalItems = this.users.length;
    this.loadPageWithoutFilter(this.currentPageIndex);
  }
  else{
    this.totalItems = this.filteredList.length;
    this.loadPageWithFilter(this.currentPageIndex);
  }
}



//paginator
onPageChange(event: PageEvent): void {
  this.currentPageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.loadPageWithoutFilter(this.currentPageIndex);
}

loadPageWithoutFilter(pageIndex: number): void {
  const startIndex = pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.displayedItems = this.users.slice(startIndex, endIndex);
}

loadPageWithFilter(pageIndex: number): void {
  const startIndex = pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.displayedItems = this.filteredList.slice(startIndex, endIndex);
}
//paginator

}

