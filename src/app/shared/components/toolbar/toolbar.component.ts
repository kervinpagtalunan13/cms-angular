 import { Component, EventEmitter, Input, Output } from '@angular/core';
import { url } from 'src/app/core/url';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  toggleBtnNavBar = 'menu';
  @Output() toggleSideNav = new EventEmitter()

  @Input() logo:string = ''
  @Input() title: string = '' 
  baseUrl = url
  navToggle = true;
  toggleNavBarIcon(): void{
      this.toggleSideNav.emit()
      this.navToggle = !this.navToggle;

      if(this.navToggle!=false){
          this.toggleBtnNavBar = 'keyboard_arrow_left';
      }
      else{
          this.toggleBtnNavBar = 'menu';
      }
  }
}
