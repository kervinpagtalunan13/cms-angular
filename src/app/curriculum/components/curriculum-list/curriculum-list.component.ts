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
  selectedTabIndex:number = 0
  filter:string = ''
  onSelectedTabChange(index: any) {
    this.filter = ''
    this.currentSortColumn = ''
    this.currentSortDirection = 'asc';
  }

  filteredData(index: number){
    let list:any[] = []
    if(index == 0)list = this.curriculums
    if(index == 1)list = this.revisions
    if(index == 2)list = this.curriculumPendings

    if(this.selectedTabIndex != index){
      return list
    }

    if(index == 0 || index == 2){
      let filteredList = list.filter(cur => {
        if(!this.filter) return true
        return cur.version.toLowerCase().includes(this.filter.toLowerCase()) ||
        cur.user?.profile?.name.toLowerCase().includes(this.filter.toLowerCase()) || 
        cur.department?.department_code?.toLowerCase().includes(this.filter.toLowerCase())
      })
      
      if(!this.currentSortColumn) return filteredList

      let sortedValue:any[] = []

      if(this.currentSortColumn == 'version' || this.currentSortColumn == 'created_at' || this.currentSortColumn == 'status'){        
        sortedValue = filteredList.sort((a: any, b: any) => {
          if (a[this.currentSortColumn] < b[this.currentSortColumn]) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a[this.currentSortColumn] > b[this.currentSortColumn]) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      if(this.currentSortColumn == 'name'){
        sortedValue = filteredList.sort((a: any, b: any) => {
          if (a.user?.profile?.name < b.user?.profile?.name) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a.user?.profile?.name > b.user?.profile?.name) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      if(this.currentSortColumn == 'department'){
        sortedValue = filteredList.sort((a: any, b: any) => {
          if (a.department?.department_code < b.department?.department_code) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a.department?.department_code > b.department?.department_code) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      

      return sortedValue
              //  cur.status.toLowerCase().includes(this.filter.toLowerCase()) || 
              //  cur.created_at?.toLowerCase().includes(this.filter.toLowerCase())
    }else{
      let filteredData = list.filter(cur => {
        if(!this.filter) return true
        return cur.curriculum?.version.toLowerCase().includes(this.filter.toLowerCase()) ||
        cur.user?.profile?.name.toLowerCase().includes(this.filter.toLowerCase()) || 
        cur.curriculum?.department?.department_code?.toLowerCase().includes(this.filter.toLowerCase())
      })
      if(!this.currentSortColumn) return filteredData

      if(this.currentSortColumn == 'status' ||  this.currentSortColumn == 'created_at'){        
        filteredData = filteredData.sort((a: any, b: any) => {
          if (a[this.currentSortColumn] < b[this.currentSortColumn]) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a[this.currentSortColumn] > b[this.currentSortColumn]) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      if(this.currentSortColumn == 'department'){        
        filteredData = filteredData.sort((a: any, b: any) => {
          if (a?.curriculum?.department?.department_code < b?.curriculum?.department?.department_code) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a?.curriculum?.department?.department_code > b?.curriculum?.department?.department_code) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      if(this.currentSortColumn == 'version'){        
        filteredData = filteredData.sort((a: any, b: any) => {
          if (a?.curriculum?.version < b?.curriculum?.version) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a?.curriculum?.version > b?.curriculum?.version) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }
      if(this.currentSortColumn == 'name'){
        filteredData = filteredData.sort((a: any, b: any) => {
          if (a.user?.profile?.name < b.user?.profile?.name) {
            return this.currentSortDirection === 'asc' ? -1 : 1;
          } else if (a.user?.profile?.name > b.user?.profile?.name) {
            return this.currentSortDirection === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        });
      }

      return filteredData 
    }
  }

  currentSortColumn: string='';
  currentSortDirection: string = 'asc';

  sortCurriculum(column: string) {
    if (this.currentSortColumn === column) {
      // Reverse the direction if the same column is clicked again
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
      console.log(this.currentSortColumn);
    } else {
      // Set the new column and direction if a different column is clicked
      this.currentSortColumn = column;
      this.currentSortDirection = 'asc';
    }
  }

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
      console.log(revisions);
      
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
  // The items to display on the current page
  //paginator
    existingtotalItems = 0; // Total number of items in your table
    existingPageSize = 3; // Number of items to display per page
    existingPageSizeOptions = [3, 5, 10]; // Options for the number of items per page
    existingCurrentPageIndex = 0; // Current page index

    revisionTotalItems = 0; // Total number of items in your table
    revisionPageSize = 3; // Number of items to display per page
    revisionPageSizeOptions = [3, 5, 10]; // Options for the number of items per page
    revisionCurrentPageIndex = 0; // Current page index

    pendingTotalItems = 0; // Total number of items in your table
    pendingPageSize = 3; // Number of items to display per page
    pendingPageSizeOptions = [3, 5, 10]; // Options for the number of items per page
    pendingCurrentPageIndex = 0; // Current page index
    
    //paginator
  
    ngOnInit(): void {
      //this.listFilter = '';
    }
    existing:any[]=[];
    revision:any[]=[];
    pending: any[] = []; 
    
    displayExisting:any[]=[];
    displayRevision:any[]=[];
    displayPending: any[] = []; 
    ngDoCheck(): void{
      console.log(this.filteredData(0).length)
      console.log(this.filteredData(1).length)
      console.log(this.filteredData(2).length)

      this.existing=this.filteredData(0)
      this.revision=this.filteredData(1)
      this.pending=this.filteredData(2)

      this.existingtotalItems = this.filteredData(0).length;
      this.revisionTotalItems = this.filteredData(1).length;
      this.pendingTotalItems = this.filteredData(2).length;
    }
  
  
  
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
        this.displayExisting = this.filteredData(0).slice(startIndex, endIndex);
      }
      else if(this.tab==1){
        startIndex = pageIndex * this.revisionPageSize;
        endIndex = startIndex + this.revisionPageSize;
        this.displayRevision = this.revision.slice(startIndex, endIndex);
      }
      else if(this.tab==2){
        startIndex = pageIndex * this.pendingPageSize;
        endIndex = startIndex + this.pendingPageSize;
        this.displayPending = this.pending.slice(startIndex, endIndex);
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