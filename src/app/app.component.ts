import { Component } from '@angular/core';
import { ContentService } from './core/services/content.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent{
  title = 'cict-curriculum-system';
   body = document.querySelector('body');
   isDarkMode: any;
   constructor(private contentService: ContentService){
    this.contentService.contentAction$.subscribe(
        content => {
          if(content){
            this.isDarkMode = !!Number(content.is_dark_mode_active)
          }
        }
      )
      }
      

      ngDoCheck(): void {
        console.log('is dark? '+this.isDarkMode)
        if(!this.isDarkMode){
          if (this.body) {
           // this.reloadPage()
                 this.body.classList.add('theme-light');
                 this.body.classList.remove('theme-dark');
                // console.log('putaninang yan'+this.madilimBa);
             }
           }
           else if(this.isDarkMode){
             if (this.body) {
             // this.reloadPage()
               this.body.classList.add('theme-dark');
               this.body.classList.remove('theme-light');
              // console.log('putaninang mo');
           }
           }
      }
      ngOnInit(): void {
        this.contentService.contentAction$.subscribe(
          data => {
            console.log(data)
          }
        )

        // console.log(this.isDarkMode)
        if(!this.isDarkMode){
         if (this.body) {
         // this.reloadPage()
                this.body.classList.add('theme-light');
                this.body.classList.remove('theme-dark');
                //console.log('set as light');
            }
          }
          else if(this.isDarkMode){
            if (this.body) {
              //this.reloadPage()
              this.body.classList.add('theme-dark');
              this.body.classList.remove('theme-light');
              //console.log('set as dark');
          }
          }
      }
      reloadPage(){
        location.reload();
      }
  }
  

