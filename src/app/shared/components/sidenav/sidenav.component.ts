import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { ContentService } from 'src/app/core/services/content.service';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { ContentManagementComponent } from 'src/app/content/components/content-management/content-management.component';
import { MatDialog } from '@angular/material/dialog';
import { url } from 'src/app/core/url';
import { AccountService } from 'src/app/core/services/account.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  constructor(private route: ActivatedRoute, 
              public dialog: MatDialog, 
              private authService: AuthService,
              private router: Router,
              private contentService: ContentService,
              private curriculumService: CurriculumService,
              private accountService: AccountService
    ){}
    
  showSideNav = false
  baseUrl = url
  pendingCount = 0
  neededData$ = combineLatest([
    this.authService.getCurrentUser(),
    this.authService.currentUser$,

    // this.accountService.pendingUser$,
    // this.accountService.pendingsCount$
  ]).pipe(
    // tap(([,,,pendingCount]) => {
    //   this.pendingCount = pendingCount
    // }),
    map(([x, user]) => {
      return user
    })
  )
  
  newCurr:number = 0
  logo: string = ''
  title:string = ''
  isDarkMode: boolean = false
  contentData$ = combineLatest([
    this.contentService.content$,
    this.contentService.contentAction$,
    this.curriculumService.curriculums$,
    this.curriculumService.revisions$,
  ]).pipe(
      tap(([x, content, curriculums, revisions]) => {

        this.newCurr = curriculums.filter(cur => cur.is_new).length + revisions.filter(rev => rev.is_new).length


        this.title = content.title_text
        this.logo = content.logo_path
        this.isDarkMode = !!content.is_dark_mode_active
        console.log(!!content.is_dark_mode_active);
      })
    ).subscribe()
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const query = params['showSidenav'];
      this.showSideNav = query
    });
  }

  logout(){
    this.authService.logout().subscribe(
      data => this.router.navigate(['/'])
    )
  }
  openDialog(){
    this.dialog.open(ContentManagementComponent);
  }
}
