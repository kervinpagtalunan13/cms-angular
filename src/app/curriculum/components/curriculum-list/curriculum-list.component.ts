import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Curriculum, Curriculum2 } from 'src/app/core/models/curriculum';
import {MatDialog} from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { EMPTY, catchError, combineLatest, map, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.css']
})




export class CurriculumListComponent {
  items = [
    { id: 1, name: 'Red', color: 'red', theme: 'cict-curriculum-system-dark-theme' },
    { id: 2, name: 'Blue', color: 'blue', theme: 'cict-curriculum-system-dark-theme' },
    { id: 3, name: 'Green', color: 'green', theme: 'cict-curriculum-system-dark-theme' },
    { id: 4, name: 'Yellow', color: 'yellow', theme: 'cict-curriculum-system-dark-theme' },
  ];

  constructor(private dialog: MatDialog,
              private curriculumService: CurriculumService,
              private authService: AuthService
              ) {}
  
  role:any = ''  
  isLoading:boolean = true
  curriculums:Curriculum2[] = []
  revisions:any[] = []
  curriculumPendings:Curriculum2[] = []
  error:boolean = false
  currentUser!: User

  newCurCount:number = 0
  newRevisionsCount:number = 0
  newCurPendingsCount:number = 0

  neededData$ = combineLatest([
    this.authService.getCurrentUser(),
    this.curriculumService.curriculums$,
    this.curriculumService.revisions$
  ]).pipe(
    tap(([user, curriculums, revisions]) => {
      this.currentUser = user
      this.curriculums = curriculums.filter(curr => curr.status != 'p')
      this.curriculumPendings = curriculums.filter(curr => curr.status == 'p')

      this.revisions = revisions
      this.newRevisionsCount = revisions.filter(rev => rev.is_new).length
      this.newCurPendingsCount = this.curriculumPendings.filter(cur => cur.is_new && cur.status == 'p').length
      this.newCurCount = this.curriculums.filter(cur => cur.is_new && cur.status == 'a').length
      this.role = user.role
      this.isLoading = false
    }),
    catchError(err => {
      this.isLoading = false
      this.error = true
      return EMPTY
    })
  )

            
    
  
  openDialog() {
    const dialogRef = this.dialog.open(curriculumDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  searchPlaceholder = 'Search in Existing...'
  tab = 0
  //changeTabEvent
  changeTab(change:MatTabChangeEvent){
   this.tab = change.index;
   if(this.tab==0){
    this.listFilter=''
    this.searchPlaceholder='Search in Existing...'
   }
   else if(this.tab==1){
    this.listFilter=''
    this.searchPlaceholder='Search in Revision...'
   }
   else if(this.tab==2){
    this.listFilter=''
    this.searchPlaceholder='Search in Pending...'
   }
  }

    //pang filter
    private _listFilter: string = '';
    get listFilter(): string{ 
        return this._listFilter;
    }
    set listFilter(value: string){
        this._listFilter=value;
        if(this.tab==0){
        this.existingFilteredList = this.performFilter(value);
        }
        else if(this.tab==1){
          this.revisionFilteredList = this.performRevisionFilter(value);
        }
        else if(this.tab==2){
          this.pendingFilteredList = this.performFilter(value);
        }
    }
    //pang filter
    revisionFilteredList = this.revisions;
    existingFilteredList=this.curriculums; //array ng filtered list
    pendingFilteredList=this.curriculums; //array ng filtered list
    rev:any[]=[];
    data: any[]=[];
    //data= this.curriculums;
    
    //pangfilter 
    performFilter(filterBy: string): Curriculum2[]{
      filterBy = filterBy.toLocaleLowerCase();
      return this.data.filter((titles: Curriculum2)=>
      titles.department.department_code.toLowerCase().includes(filterBy)||
      titles.version.toLowerCase().includes(filterBy)||
      titles.status.toLowerCase().includes(filterBy)||
      titles.user?.profile?.name.toLowerCase().includes(filterBy)||
      titles.created_at.toLowerCase().includes(filterBy)
      );
  }

  performRevisionFilter(filterBy: string): Curriculum2[]{
    filterBy = filterBy.toLocaleLowerCase();
    return this.rev.filter((titles: Curriculum2)=>
    titles.department?.department_code?.toLowerCase().includes(filterBy)||
    titles.version.toLowerCase().includes(filterBy)||
    titles.status.toLowerCase().includes(filterBy)||
    titles.user?.profile?.name.toLowerCase().includes(filterBy)||
    titles.created_at.toLowerCase().includes(filterBy)
    );
}
  //pangfilter
    displayRevision:any[]=[];
    displayedItems: any[] = []; // The items to display on the current page
  //paginator
    existingtotalItems = this.data.length; // Total number of items in your table
    existingPageSize = 3; // Number of items to display per page
    existingPageSizeOptions = [3, 5, 10]; // Options for the number of items per page
    existingCurrentPageIndex = 0; // Current page index

    revisionTotalItems = this.rev.length; // Total number of items in your table
    revisionPageSize = 3; // Number of items to display per page
    revisionPageSizeOptions = [3, 5, 10]; // Options for the number of items per page
    revisionCurrentPageIndex = 0; // Current page index

    pendingTotalItems = this.data.length; // Total number of items in your table
    pendingPageSize = 3; // Number of items to display per page
    pendingPageSizeOptions = [3, 5, 10]; // Options for the number of items per page
    pendingCurrentPageIndex = 0; // Current page index
    
    //paginator
  
    //pang filter
    ngOnInit(): void {
      this.listFilter = '';
      console.log(this.displayedItems)
      console.log(this.curriculums)
    }
    //pang filter
  
    //pang check kung may laman yung search input (para di mawalan ng laman yung table)
    ngDoCheck(): void{
      console.log(this.displayRevision)
      if(!this.listFilter){
        if(this.tab==0){
          this.existingtotalItems = this.data.length;
        this.loadPageWithoutFilter(this.existingCurrentPageIndex);
        }
        else if(this.tab==1){
          this.revisionTotalItems = this.rev.length;
        this.loadPageWithoutFilter(this.revisionCurrentPageIndex);
        }
        else if(this.tab==2){
          this.pendingTotalItems = this.data.length;
          this.loadPageWithoutFilter(this.pendingCurrentPageIndex);
        }
      }
      else{
        this.existingCurrentPageIndex=0
        this.revisionCurrentPageIndex=0
        this.pendingCurrentPageIndex=0
        if(this.tab==0){
          this.existingtotalItems = this.existingFilteredList.length;
          this.loadPageWithFilter(this.existingCurrentPageIndex);
          }
          else if(this.tab==1){
            this.revisionTotalItems = this.revisionFilteredList.length;
          this.loadPageWithFilter(this.revisionCurrentPageIndex);
          }
          else if(this.tab==2){
            this.pendingTotalItems = this.pendingFilteredList.length;
            this.loadPageWithFilter(this.pendingCurrentPageIndex);
          }
      }

      
  //  if(this.tab==0){
  //   if(this.listFilter){
  //       this.existingtotalItems = this.existingFilteredList.length;
  //       console.log(this.existingtotalItems)
  //       this.loadPageWithFilter(this.existingCurrentPageIndex);
  //  }
  // }
  //  else if(this.tab==2){
  //   if(this.listFilter){
  //         this.pendingTotalItems = this.pendingFilteredList.length;
  //         console.log(this.pendingTotalItems)
  //         this.loadPageWithFilter(this.pendingCurrentPageIndex);
  //   }
  //  }
    }
  
    //pang check kung may laman yung search input (para di mawalan ng laman yung table)
  
  
    //paginator
    onPageChange(event: PageEvent): void {
      if(this.tab==0){
      this.existingCurrentPageIndex = event.pageIndex;
      this.existingPageSize = event.pageSize;
      this.loadPageWithoutFilter(this.existingCurrentPageIndex);
      }
      else if(this.tab==1){
        this.revisionCurrentPageIndex = event.pageIndex;
        this.revisionPageSize = event.pageSize;
        this.loadPageWithoutFilter(this.revisionCurrentPageIndex);
        }
      else if(this.tab==2){
        this.pendingCurrentPageIndex = event.pageIndex;
        this.pendingPageSize = event.pageSize;
        this.loadPageWithoutFilter(this.pendingCurrentPageIndex);
        }
    }
    
    loadPageWithoutFilter(pageIndex: number): void {
      let startIndex = 0;
      let endIndex = 0;
      if(this.tab==0){
        startIndex = pageIndex * this.existingPageSize;
        endIndex = startIndex + this.existingPageSize;
        this.data=this.curriculums;
        this.displayedItems = this.data.slice(startIndex, endIndex);
      }
      else if(this.tab==1){
        startIndex = pageIndex * this.revisionPageSize;
        endIndex = startIndex + this.revisionPageSize;
        this.rev=this.revisions;
        this.displayRevision = this.rev.slice(startIndex, endIndex);
      }
      else if(this.tab==2){
        startIndex = pageIndex * this.pendingPageSize;
        endIndex = startIndex + this.pendingPageSize;
        this.data=this.curriculumPendings;
        this.displayedItems = this.data.slice(startIndex, endIndex);
      }
    }
    loadPageWithFilter(pageIndex: number): void {
      let startIndex = 0;
      let endIndex = 0;
      if(this.tab==0){
        startIndex = pageIndex * this.existingPageSize;
        endIndex = startIndex + this.existingPageSize;
        this.data=this.curriculums;
        this.displayedItems = this.existingFilteredList.slice(startIndex, endIndex);
      }
      else if(this.tab==1){
        startIndex = pageIndex * this.revisionPageSize;
        endIndex = startIndex + this.revisionPageSize;
        this.rev=this.revisions;
        this.displayRevision = this.revisionFilteredList.slice(startIndex, endIndex);
      }
      else if(this.tab==2){
        startIndex = pageIndex * this.pendingPageSize;
        endIndex = startIndex + this.pendingPageSize;
        this.data=this.curriculumPendings;
        this.displayedItems = this.pendingFilteredList.slice(startIndex, endIndex);
      }
    }
  //paginator
}

@Component({
  selector: 'curriculum-list-modal-dialog',
  templateUrl: './curriculum-list.modal.html',
})
export class curriculumDialog {

}