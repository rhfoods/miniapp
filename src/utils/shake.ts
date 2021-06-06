/**
 * 防抖
 */
class Shake {
  static old = 0;
  static timer = null;

  static wait(t = 300) {
    return new Promise((res) => {
      const now = new Date().getTime();
      Shake.old - now < t && clearTimeout(Shake.timer);
      Shake.timer = setTimeout(() => res(true), t);
      Shake.old = now;
    });
  }
}

export default Shake;
