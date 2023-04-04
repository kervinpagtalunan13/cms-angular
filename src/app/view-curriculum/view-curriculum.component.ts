import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface firstSemContent {
      courseCode:string;
      descriptiveTitle:string;
      lecUnits:string;
      labUnits:string;
      totalUnits:string;
      hoursPerWeek:string;
      preReq:string;
      coReq:string;
}

export interface comments{
      username:string;
      header:string;
      feedback:string;
}

@Component({
  selector: 'app-view-curriculum',
  templateUrl: './view-curriculum.component.html',
  styleUrls: ['./view-curriculum.component.css']
})

export class ViewCurriculumComponent {

  @ViewChild("firstSemesterForm", {static: false})"firstSemesterForm": NgForm;

  panelOpenState = false;
  del = 'Delete';
  view = 'View Syllabus';
  edit='Edit';
  includeSubjectText='Add Subject';
  cancelAddSubject='Cancel';
  uploadSyllabus='Upload Syllabus';

  comment: comments[]=[
    {'username':'Mang ben', 
    'header':'IT 309',
    'feedback':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {'username':'Ryan Nolasco', 
    'header':'IT 308',
    'feedback':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {'username':'Kyla Delfin', 
    'header':'IT 307',
    'feedback':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },

  ]

  firstSem: firstSemContent[] = [
      {'courseCode':'IT-309',
      'descriptiveTitle':'Subject Name',
      'lecUnits':'1.0',
      'labUnits':'1.0',
      'totalUnits':'2.0',
      'hoursPerWeek':'2',
      'preReq':'IT 309',
      'coReq':'IT 308'},
      {'courseCode':'IT-309',
      'descriptiveTitle':'Subject Name',
      'lecUnits':'1.0',
      'labUnits':'1.0',
      'totalUnits':'2.0',
      'hoursPerWeek':'2',
      'preReq':'IT 309',
      'coReq':'IT 308'},
      {'courseCode':'IT-309',
      'descriptiveTitle':'Subject Name',
      'lecUnits':'1.0',
      'labUnits':'1.0',
      'totalUnits':'2.0',
      'hoursPerWeek':'2',
      'preReq':'IT 309',
      'coReq':'IT 308'},
  ]

  selectedSubject: any;

  isEditing(subjects:any): void{
    this.selectedSubject = Object.assign({}, subjects);
  }

  updateSubject(){
    const index = this.firstSem.findIndex(subject => subject.courseCode === this.selectedSubject.courseCode);
    this.firstSem[index] = Object.assign({}, this.selectedSubject);
    this.selectedSubject = null;
  }

  cancel() {
    this.selectedSubject = null;
  }

  deleteSubject(index: number){
    this.firstSem.splice(index, 1);
  }
  OnSubmit(): void{
    
  }

  addSubject(form: NgForm): void{
    const newItem = {
      courseCode: form.value.courseCode,
      descriptiveTitle: form.value.descriptiveTitle,
      lecUnits: form.value.lecUnits,
      labUnits: form.value.labUnits,
      totalUnits: form.value.totalUnits,
      hoursPerWeek: form.value.hoursPerWeek,
      preReq: form.value.preReq,
      coReq: form.value.coReq,
    };
    if(newItem.coReq && newItem.courseCode && newItem.descriptiveTitle && newItem.hoursPerWeek && newItem.labUnits && newItem.lecUnits && newItem.preReq && newItem.totalUnits){
    this.firstSem.push(newItem);
    form.reset();
    }
  }
  clearValues(): void{
    this.firstSemesterForm.reset();
  }

  addComment(form: NgForm): void{
    const newComment = {
      username: form.value.username,
      header: form.value.header,
      feedback: form.value.feedback,
    };
    if(newComment.username && newComment.header && newComment.feedback){
        this.comment.push(newComment);
        form.reset();
       }
  }
  

}