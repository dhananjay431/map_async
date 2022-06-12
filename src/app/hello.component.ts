import { Component, Input } from '@angular/core';

@Component({
  selector: 'Div',
  template: `<div *ngIf="name |async"></div>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent {
  @Input() name: any;
  tp(d){
    return typeof d;
  }
}
