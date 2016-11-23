function Stream() {

  this.subscribers = [];

  this.next = function(value){
    let subs = this.subscribers;
    for (let i = 0; i < subs.length; i++) {
      subs[i].nextCb(value);
    }
  }

  this.err = function(err){
    let subs = this.subscribers;
    for (let i = 0; i < subs.length; i++) {
      subs[i].errCb(err);
    }
  }

  this.complete = function() {
    let subs = this.subscribers;
    for (let i = 0; i < subs.length; i++) {
      subs[i].completeCb();
    }
    this.subscribers = [];
  }

  this.subscribe = function(next, err, complete) {
    let subscription = new Subscription(next, err, complete);
    this.subscribers.push(subscription);
    return subscription;
  }

  this.map = function(mapFn) {
    let newStream = new Stream();
    let sub = this.subscribe((val) => {
      let mapVal = mapFn(val);
      newStream.next(mapVal);
    });
    return newStream;
  }

  // this.interval = function(interval) {
  //   let count = 0;
  //   function intervalRun() {
  //     return setInterval(() => {
  //       this.next(count);
  //       count += 1;
  //     }, interval);
  //   }
  // }
}

function Subscription(nextCb, errCb, completeCb) {
  this.nextCb = nextCb ? nextCb : () => {};
  this.errCb  = errCb ? errCb : () => {};
  this.completeCb = completeCb ? completeCb : () => {};
}
