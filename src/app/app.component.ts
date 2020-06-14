import { AfterViewInit, Component, DoCheck, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('myCanvas', { static: false }) myCanvas;
  @Output() event = new EventEmitter();

  public image: any;
  public canvasWidth: number;
  public canvasHeight: number;
  private img: any;

  private url: string = 'https://vision.googleapis.com/v1/images:annotate?key=' +
    'Your API Key';


  constructor(private http: HttpClient) {
  }

  context: CanvasRenderingContext2D;

  ngAfterViewInit() {
    // 参照をとれる
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');
  }

  public onFileSelected(event) {

    const selectedFile: File = <File>event.target.files[0];

    if (selectedFile) {

      // 画像を開いてプレビューする
      var reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (_event) => {
        this.image = reader.result;
        this.img = new Image();
        this.img.src = this.image;
        this.img.onload = () => {
          this.canvasWidth = this.img.width;
          this.canvasHeight = this.img.height;
        }
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
      // Google Cloud Vision API からのレスポンスを表示する
      alert("成功！！ 画像に アノテーションを追加しました。");
      this.draw(res);

    }, (err: any) => {
      // エラー
      alert("エラー console.log を確認してください。");
      console.log(err);
    });

  }

  // Canvas要素を更新します。 
  private draw(res: any): void {
    const ctx = this.context;
    if (!ctx) {
      return;
    }
    // 画像の読み込み
    ctx.drawImage(this.img, 0, 0);
    
    // 矩形を描く
    ctx.strokeStyle = '#FF0000';

    const responses = res.responses[0];
    const textAnnotations = responses.textAnnotations;
    for (let i = 1; i < textAnnotations.length; i++) {

      const block = textAnnotations[i];
      const text: string = block.description;
      const pos: Array<any> = block.boundingPoly['vertices'];

      const w: number = pos[2].x - pos[0].x;
      const h: number = pos[2].y - pos[0].y;
      ctx.strokeRect(pos[0].x, pos[0].y, w, h);

    }

    console.log(res);
  }

}