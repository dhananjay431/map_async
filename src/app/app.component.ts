import { Component, OnInit, VERSION } from '@angular/core';
import { forkJoin, from, of, Subject } from 'rxjs';
import {
  exhaustMap,
  mergeMap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  tap,
  delay,
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name: any = 'Angular ' + VERSION.major;
  data: any = {};
  r = (response) => response.json();

  to = (a, t) => () => {
    fetch('https://jsonplaceholder.typicode.com/todos/' + t.num)
      .then(this.r)
      .then((r) => {
        r.num = t.num;
        r.rnum = t.rnum;
        a(r);
      });
  };

  ab = (t) => (a, b) => {
    setTimeout(this.to(a, t), t.rnum);
  };

  q = (t: any) => from(new Promise(this.ab(t)));

  sub: any = new Subject().pipe(
    // debounceTime(800),
    // distinctUntilChanged(),
    switchMap((d) => this.q(d))
  );
  sub_end: any = '';
  rn(n) {
    return Math.floor(Math.random() * n);
  }
  changeData2() {
    let arr = [
      'https://jsonplaceholder.typicode.com/posts',
      'https://jsonplaceholder.typicode.com/comments',
      'https://jsonplaceholder.typicode.com/albums',
      'https://jsonplaceholder.typicode.com/photos',
      'https://jsonplaceholder.typicode.com/todos',
      'https://jsonplaceholder.typicode.com/users',
    ];

    let url = this.rn(arr.length);
    return this.setName(arr[url]);
  }
  changeData() {
    let z = this.dt();
    z.data = forkJoin({
      a: this.changeData2(),
      b: this.changeData2(),
      c: this.changeData2(),
    });
    z.data = tap(this.setData);

    this.name = z.val();
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
  setData = (d: any) => {
    console.log('setData =>', d);
    this.data = d;
  };
  setName(url) {
    // let z = this.dt();
    // z.data = of([]);
    // z.data = delay(2000)
    // z.data = mergeMap(d=>from(fetch(url).then((response) => response.json()))) ;
    // z.data = tap(this.setData);
    // return z.val();
    //return
    let resp = (r: any) => r.json();
    let z = this.dt();
    z.data = from(fetch(url).then(resp));
    // z.data = tap(this.setData);
    return z.val();
  }
  ngOnInit() {
    this.start();
    this.changeData();
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
