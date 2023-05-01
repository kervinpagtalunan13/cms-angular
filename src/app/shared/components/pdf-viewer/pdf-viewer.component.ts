import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent {
  pdfLoc = 'https://www.slarenasitsolutions.com/4iadonis/public_html/index.php/api/subjectsGetSyllabus/';
  myUrl: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ref: string }
  ) {
    this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfLoc + data.ref);
  }

}
