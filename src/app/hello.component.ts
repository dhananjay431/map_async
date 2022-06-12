import { Component, Input } from '@angular/core';

@Component({
  selector: 'Div',
  template: `<div>
  null s = {{ name=='null'}}
    null = {{name==null}}
  <div *ngIf="name |async as d">
    null s = {{ d=='null'}}
    null = {{d==null}}
  </div>
  </div>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent {
  @Input() name: any;
  tp(d){
    return typeof d;
  }
}
