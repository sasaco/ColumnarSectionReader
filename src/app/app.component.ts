import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @Output() event = new EventEmitter();

  public image: any;

  private url: string = 'https://vision.googleapis.com/v1/images:annotate?key=' +
    'Your API Key';

  
  constructor(private http: HttpClient) {
  }


  public onFileSelected(event) {

    const selectedFile: File = <File>event.target.files[0];

    if (selectedFile) {

      // 画像を開いてプレビューする
      var reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (_event) => {
        this.image = reader.result;

        // Google Cloud Vision API に送る
        return this.upload();
      }
    }
  }


  private upload() {

    // 画像データの先頭 "data:image/png;base64" の部分が余計なので削除する
    const content = this.image.replace(/^data:image\/[a-z]+;base64,/, "");

    // Google Cloud Vision API に送るデータを用意
    const obj = {
      "requests": [
        {
          "image": { "content": content },
          "features": [
            {
              "type": "TEXT_DETECTION",
              "maxResults": "10"
            }
          ]
        }
      ]
    };
    const body = JSON.stringify(obj);

    // Google Cloud Vision API にポストする
    this.http.post(this.url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe((res: any) => {
      this.event.emit(this.image);
      // Google Cloud Vision API からのレスポンスを表示する
      alert("成功！！ console.log に画像認識 した結果を出力しました。");
      console.log(res);
    }, (err: any) => {
      // エラー
        alert("エラー console.log を確認してください。");
      console.log(err);
    });




  }

}