import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  selectedFile: File = null;
  @Output() event = new EventEmitter();
  public image: any;

  private url: string = 'https://vision.googleapis.com/v1/images:annotate?key=' +
    'AIzaSyBGsWzGU2G9sxIRRRAalNajUSBSyASBCQM' //Your API Key
  
  constructor(private http: HttpClient) {
  }

  /**
   *  Validate uploader params
   * @param event
   */
  public async onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile) {
       const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      return this.upload(fd);
      
    }
  }

  /**
   * Upload image to server and receive image object
   */
  private upload(fd: FormData) {

    this.http.post(this.url, fd).subscribe((res: any) => {
      this.image = res.data;
      this.event.emit(this.image);
    }, (err: any) => {
      // Show error message or make something.
    });
  }

}