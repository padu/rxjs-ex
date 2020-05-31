import { Component } from '@angular/core';
import { Observable, Observer, fromEvent, interval, of, iif, range, timer } from "rxjs";
import { publish, publishReplay, share, refCount, count, buffer, take, window, mergeAll, concatAll, mergeMap, switchMap, toArray, tap, map, filter, delay, repeat, throttle } from 'rxjs/operators';
//import * as Rx from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'RXJS Demo';
  public message = '';
  public messages: string[] = [];

  public messageObs:Observable<string>;
  public noOfParticipents:string;

  ngOnInit() {
    this.exOperator12();
  }

  // create observable using Obserable.create 
  // emit values using next()
  // the way to subscribe to obserbable and watch for values
  init() {
    // This is how we create Observable
    let observable = Observable.create((producer: Observer<string>) => {
      producer.next('Hello World');
    });

    // This is how we subscribe to get values from observable
    let subscription = observable.subscribe((val) => {
      this.message = val;
    });
  }
  // observable to emit mulitple values over time
  init1() {
    let observable = Observable.create((producer: Observer<string>) => {
      let flag = true;
      setInterval(() => {
        flag = !flag;
        if (flag) { 
          producer.next('Hello World'); 
        }else {
          producer.next('Hello Siemens');
        }
      }, 2000);
    });

    // This is how we subscribe to get values from observable
    observable.subscribe((val) => {
      this.message = val;
    });
  }
  //observable to conclude emitting values no more with complete method 
  init2() {
    let observable = Observable.create((producer: Observer<string>) => {
      producer.next('Hi Guys');
      producer.next('How are you?');
      producer.complete();
      producer.next('You will not get this one');
    });

    // This is how we subscribe to get values from observable
    observable.subscribe((val) => {
      this.messages.push(val);
    });
  }
  // Observale value producer complete method and complete callback on suscribe
  init3() {
    let observable = Observable.create((Producer: Observer<string>) => {
      Producer.next('Hi Guys');
      Producer.next('How are you?');

      let intervalRef =  setInterval(() => {
        Producer.next('I am good');
      }, 2000);

      setTimeout(() => {
        Producer.complete();
        clearInterval(intervalRef); 
      }, 7000);
    });

    // This is how we subscribe to get values from observable
    let subscription = observable.subscribe(
    // next value callback
    (val) => {
      this.messages.push(val);
    },
    // error callback
    (err) => {

    },
    // complete callback
    () => {
      this.messages.push('Complete!!');
    });
  }
  // Unsubscribe to stop getting values from observable
  init4() {
    let observable = Observable.create((Producer: Observer<string>) => {
      Producer.next('Hi Guys');
      Producer.next('How are you?');
      let intvl = setInterval(() => {
        Producer.next('I am good');
      }, 2000);

    });

    // This is how we subscribe to get values from observable
    let subscription;
    let subscribeObs = () => {
      subscription = observable.subscribe((val) => {
        this.messages.push(val);
      },(err) => {
  
      },() => {
        this.messages.push('Complete!!');
      });
    }

    subscribeObs();

    setTimeout(() => {
      subscription.unsubscribe(); 
    }, 6001);

    setTimeout(() => {
      subscribeObs();
    }, 7000);
  }
  // Multiple subscribers
  init5() {
    let observable = Observable.create((Producer: Observer<string>) => {
      Producer.next('Hi Guys');
      Producer.next('How are you?');
      setInterval(() => {
        Producer.next('I am good');
      }, 2000);
    });

    // This is how we subscribe to get values from observable
    let subscription1 = observable.subscribe((val) => {
      this.messages.push(`subscriber 1 : ${val}`);
    });

    let subscription2 = observable.subscribe((val) => {
      this.messages.push(`subscriber 2 : ${val}`);
    });

    setTimeout(() => {
      subscription1.unsubscribe(); 
    }, 6001);
  }
  // unsubscribe one suscription if other unsubscribes
  init6() {
    let observable = Observable.create((Producer: Observer<string>) => {
      Producer.next('Hi Guys');
      Producer.next('How are you?');
      setInterval(() => {
        Producer.next('I am good');
      }, 2000);
    });

    // This is how we subscribe to get values from observable
    let subscription1 = observable.subscribe((val) => {
      this.messages.push(`subscriber 1 : ${ val }`);
    });

    let subscription2 = observable.subscribe((val) => {
      this.messages.push(`subscriber 2 : ${ val }`);
    });

    // add subscription1 with subscription2
    subscription1.add(subscription2);

    setTimeout(() => {
      subscription1.unsubscribe(); 
    }, 6001);
  }

  // Cold Observable
  // Observable started producing the values upon each subscription which makes it cold by definition.
  init7() {
    let observable = Observable.create((Producer: Observer<string>) => {
      Producer.next(`${Date.now()}`); 
    });

    observable.subscribe((val) => {
      this.messages.push(`subscriber 1 : ${ val }`);
    });

    setTimeout(() => {
      observable.subscribe((val) => {
        this.messages.push(`subscriber 2 : ${ val }`);
      });
    })
  }

  //play with cold observable
  init8() {
    let observable = Observable.create((producer) => {
      let count = 1;
      setInterval(() => {
        producer.next(count++);
      },500);
    });
    
    let sub1, sub2;
    
    setTimeout(() => {
      sub1 = observable.subscribe((val) => {
        this.messages.push(`subscriber 1 : ${ val }`);
      });
    }, 1000);

    setTimeout(() => {
      sub2 = observable.subscribe((val) => {
        this.messages.push(`subscriber 2 : ${ val }`);
      });
      sub1.add(sub2);
    }, 2000);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 6000);
  }

  //lets make cold observable hot
  //we are using operator for that, but the question is, what is operator?
  //RxJS is mostly useful for its operators, even though the Observable is the foundation.
  //Operators are the essential pieces that allow complex asynchronous code to be easily composed in a declarative manner.
  //we have made it but it doesnt emit values lets move to next ex
  init9() {
    let observable = Observable.create((producer) => {
      let count = 1;
      setInterval(() => {
        producer.next(count++);
      },500);
    }).pipe(
      publish()
    );
  
    let sub1, sub2;
    
    setTimeout(() => {
      sub1 = observable.subscribe((val) => {
        this.messages.push(`subscriber 1 : ${ val }`);
      });
    },1000);

    setTimeout(() => {
      sub2 = observable.subscribe((val) => {
        this.messages.push(`subscriber 2 : ${ val }`);
      });
      sub1.add(sub2);
    }, 2000);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 6000);
  }

  // Making hot observable emits value
  init10() {
    let observable = Observable.create((producer) => {
      let count = 1;
      setInterval(() => {
        producer.next(count++);
      },500);
    }).pipe(publish());
    
    observable.connect();

    let sub1, sub2;
    
    setTimeout(() => {
      sub1 = observable.subscribe((val) => {
        this.messages.push(`subscriber 1 : ${ val }`);
      });
    }, 1001);

    setTimeout(() => {
      sub2 = observable.subscribe((val) => {
        this.messages.push(`subscriber 2 : ${ val }`);
      });
      sub1.add(sub2);
    }, 2001);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 6000);
  }
  //What if we are interested in previous values emited by observable prior to its subscription
  //We have a operator for that, 'publishReply' to Get all emmited values from hot observables
  init11() {
    let observable = Observable.create((producer) => {
      let count = 1;
      setInterval(() => {
        producer.next(count++);
      },500);
    }).pipe(publishReplay());
    
    observable.connect();

    let sub1, sub2;
    
    setTimeout(() => {
      sub1 = observable.subscribe((val) => {
        this.messages.push(`subscriber 1 : ${ val }`);
      });
    },1001);

    setTimeout(() => {
      sub2 = observable.subscribe((val) => {
        this.messages.push(`subscriber 2 : ${ val }`);
      });
      sub1.add(sub2);
    }, 2001);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 6000);
  }

  //Example of Hot Observables
  init12() {
    var observable = fromEvent(document, 'mousemove')

    setTimeout(() => {
        observable.subscribe(
          (val: MouseEvent) => {
            this.messages.push(`x: ${val.offsetX}, y : ${val.offsetY}`);
          })
    }, 6000);
  }

  //Lets go through observable available operators
  //https://rxjs.dev/guide/operators
  //lets categories of operators based on there use cases 
  // 1. Batching --->
  //    buffer, bufferCount, bufferTime, bufferToggle, bufferWhen 
  //    window, windowCount, windowTime, windowToggle, windowWhen
  //
  // 2. Error Handling --->
  //    catchError, throwIfEmpty, onErrorResumeNext
  //    retry, retryWhen, timeout, timeoutWith
  //
  // 3. Filtering to Multiple Results ---> 
  //    distinct, distinctUntilChanged, distinctUntilKeyChanged
  //    skip, skipLast, skipUntil, skipWhile
  //    take, takeLast, takeUntil, takeWhile
  //    filter, sample, audit, throttle
  //
  // 4. Filtering to Single Results ---> 
  //    first, last, max, min
  //    elementAt, find, findIndex, single
  //
  // 5. Grouping Observables --->
  //    combineAll, concatAll, exhaust
  //    mergeAll, withLatestFrom
  //
  // 6. Grouping Values --->
  //    groupBy, pairwise, partition
  //    switchAll, toArray, zipAll
  //
  // 7. Observable Transformation --->
  //    repeat, repeatWhen
  //    ignoreElements, finalize
  //
  // 8. Time, Duration & Scheduled --->
  //    auditTime, sampleTime, observeOn, subscribeOn, debounce, debounceTime
  //    delay, delayWhen, throttleTime, timeInterval, timestamp
  //
  // 9. Value Transformation --->
  //    concatMap, concatMapTo, defaultIfEmpty, endWith, startWith, exhaustMap
  //    reduce, switchMap/flatMap, mergeMapTo, switchMapTo, materialize, dematerialize
  //    expand, map, mapTo, scan, mergeScan, pluck

  //Creational Of Operator - of 
  exOperator1() {
    const participents:Observable<string> = of('chetan','rishi','chinmay','amit j','amit k','pravin','akshay');
    participents.subscribe((participent) => {
      this.messages.push(`${participent}`);
    });
  }

  //Count Operator
  //emit the total number of emissions
  exOperator2() {
    const participents:Observable<string> = of('chetan','rishi','chinmay','amit j','amit k','pravin','akshay');
    participents.pipe(count()).subscribe((participentCount) => {
      this.noOfParticipents = `There are ${participentCount} participants in meeting!!`;
    });
  }

  //Creational Operator - iif
  exOperator3() {
    const feDev:Observable<string> = of('Chetan Shaha');
    const beDev:Observable<string> = of('Amit Jethani');

    const beOrfe:boolean = false;

    const reqDev = iif(()=>{return beOrfe}, beDev, feDev);

    const BE = 'Backend Developer';
    const FE = 'Fronend Developer';

    reqDev.subscribe((participent) => {
      this.messages.push(`Required ${beOrfe?BE:FE} is ${participent}`);
    });
  }

  //Creational Operator - interval
  exOperator4() {
    const exInterval = interval(1000);
  
    exInterval.subscribe((val) => {
      this.messages.push(`${val}`);
    });
  }

  //Creational Operator - interval, with take
  //play around interval count and use of toArray
  exOperator5() {
    const exInterval = interval(1000).pipe(
      take(4),
      toArray()
    );
    exInterval.subscribe((val) => {
      this.messages.push(`${val}`);
    });
  }

  //Creational Operator - range
  exOperator6() {
    const exRange = range(10, 11);
    exRange.subscribe((val) => {
      this.messages.push(`${val}`);
    });
  }

  //Buffer Operator with interval and take
  //Collecting output from source observable and emitting in batches based on defined condition(s) also called as batching
  exOperator7() {
    //'emit the buffer after 1000 ms'
    interval(100)
    .pipe(
        buffer(interval(1000)),
        take(4), // <-- just to limit the life of the source Observable
        tap((val)=> { console.log('values : ', val)}),
    )
    .subscribe(d => {
      this.messages.push(`${d}`);
    });
  }
  // buffering : emit array of values, windoing : emit an observable of values 
  
  exOperator8() {
    // emit the buffer after 1000 ms
    interval(100)
    .pipe(
        window(interval(1000)),

        take(4), // <-- just to limit the life of the source Observable
        tap((val)=> { console.log('values : ', val)}),
        switchMap(w => w.pipe(toArray()))
    )
    .subscribe(d => {
        this.messages.push(`${d}`);
    });
  }

  // operator map
  exOperator9() {
    const arr = [2,3,4,5,6,7,8,9,10];
    const sqarr = arr.map((no)=>no*no);

    console.log('sqarr : ',sqarr.toString());

    // emit the buffer after 1000 ms
    range(2, 9)
    .pipe(
      map((no)=>no*no)
    )
    .subscribe(d => {
        this.messages.push(`${d}`);
    });
  }

  // operator filter
  exOperator10() {
    const arr = [2,3,4,5,6,7,8,9,10];
    const evenarr = arr.filter((no)=> no%2 === 0);
    console.log('sqarr : ',evenarr.toString());

    // emit the buffer after 1000 ms
    range(2, 9)
    .pipe(
      filter((no)=> no%2 === 0),
      toArray()
    )
    .subscribe(d => {
      this.messages.push(`${d}`);
    });
  }

  //Grouping Observables - concatAll
  //Converts a higher-order Observable into a first-order Observable 
  //by concatenating the inner Observables in order
  exOperator11() {
    const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday'];
    const weekends = ['Saturday', 'Sunday'];
    const $workingDays = of(...workingDays).pipe(delay(1500));
    const $weekends = of(...weekends).pipe(delay(500));
    
    of( $workingDays, $weekends)
      .pipe(concatAll())
      .subscribe(d => this.messages.push(`${d}`));
  }

  //Grouping Observables - mergeAll
  //Converts a higher-order Observable into a first-order Observable which concurrently delivers 
  //all values that are emitted on the inner Observables.
  exOperator12() {
    const source1 = interval(500).pipe(take(10));

    const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday'];
    const source2 = of(...workingDays).pipe(delay(1500));

    const weekends = ['Saturday', 'Sunday'];
    const source3 = of(...weekends).pipe(delay(1000));

    // merge working days and weekends'
    of(source1, source2, source3)
        .pipe(mergeAll(3))
        .subscribe(d => this.messages.push(`${d}`));
  }

  //Observable Tranformational - repeat

  exOperator13() {
    console.log('# emit twice');
    of(1, 2, 3)
      .pipe(repeat(2))
      .subscribe(x => this.messages.push(`${x}`), null, () => this.messages.push('complete'));
  }

  //Timer, duration operator - throttle
  //Emits a value from the source Observable, 
  //then ignores subsequent source values for a duration determined by another Observable, then repeats this process.

  exOperator14() {
    const source = interval(100);
    source
    .pipe(
        take(10),
        tap(x => console.log('emitted from source: ' + x)),
        throttle(y => {
            console.log('used to calculate next Observable: ' + y);
            return timer(500);
        })
    )
    .subscribe(x => {
      console.log('received by subscribers:' + x)
      this.messages.push(`${x}`);
    });
  }

  //Whats Next - 
  //Videos resources to get an idea about new features in rxjs and about complex features made easy.
  //https://www.youtube.com/watch?v=JCXZhe6KsxQ
  //https://www.youtube.com/watch?v=B-nFj2o03i8&t=631s
  //Ineractive online platform to tryout and visualize rxjs code snippets 
  //https://rxviz.com/
  //Firebase rxjs doc is one of the informative documentation avaliable for rxjs 
  //rxjs-dev.firebaseapp.com
  //http://labs.heirloomsoftware.com/2018/06/28/how-i-use-ngrx/
}
