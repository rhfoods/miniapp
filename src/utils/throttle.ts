// 节流

class Throttle {
  static old = 0;
  static timer = null;

  static wait(t = 1000) {
    return new Promise((res) => {
      const now = new Date().getTime();
      if (now - Throttle.old > t) {
        Throttle.old = now;
        res(true);
      }
    });
  }

  static delay(callback, delay=1000) {
    let last = 0
    return (...args) => {
      let now = +new Date()
      if(now-last > delay) {
        last=now
        callback.apply(this, args)
      }
    }
  }

}

export default Throttle;
