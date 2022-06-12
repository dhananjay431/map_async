import { Component, OnInit, VERSION } from '@angular/core';
import { from, Subject } from 'rxjs';
import {
  exhaustMap,
  mergeMap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name: any = 'Angular ' + VERSION.major;
  data: any = {};
  q(t: any) {
    let qv = new Promise((a, b) => {
      setTimeout(() => {
        fetch('https://jsonplaceholder.typicode.com/todos/' + t.num)
          .then((response) => response.json())
          .then((r) => {
            r.num = t.num;
            r.rnum = t.rnum;
            a(r);
          });
      }, t.rnum);
    });
    return from(qv);
  }

  sub: any = new Subject().pipe(
    // debounceTime(800),
    // distinctUntilChanged(),
    switchMap((d) => this.q(d))
  );
  sub_end: any = '';
  rn(n) {
    return Math.floor(Math.random() * n);
  }
  changeData() {
    let arr = [
      'https://jsonplaceholder.typicode.com/posts',
      'https://jsonplaceholder.typicode.com/comments',
      'https://jsonplaceholder.typicode.com/albums',
      'https://jsonplaceholder.typicode.com/photos',
      'https://jsonplaceholder.typicode.com/todos',
      'https://jsonplaceholder.typicode.com/users',
    ];

    this.name = this.setName(arr[this.rn(arr.length)]);
  }
  dt() {
    function ob(a: any, ...b) {
      return a.pipe(...b);
    }
    return {
      a: [],
      get data() {
        return this.a;
      },
      set data(d) {
        this.a.push(d);
      },
      val() {
        return ob.apply(null, this.a);
      },
    };
  }
  setData = (d) => {
    this.data = d;
  };
  setName(url) {
    let z = this.dt();
    z.data = from(fetch(url).then((response) => response.json()));
    z.data = tap(this.setData);
    return z.val();
  }
  ngOnInit() {
    this.start();
    this.name = this.setName('https://jsonplaceholder.typicode.com/users');
  }

  num: any = 1;
  start() {
    this.num = 1;
    this.sub_end = this.sub.subscribe((r) => {
      console.log('r=>', r);
    });
  }
  end() {
    this.sub_end.unsubscribe();
  }
  _call() {
    let rnum = Math.floor(Math.random() * (10000 - 500 + 1) + 500);
    this.sub.next({ num: this.num, rnum });
    this.num = this.num + 1;
  }
}
