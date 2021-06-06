class Decorator {
  /**
   * 请求状态
   */
  static loading(cb: any, setLoading: any, setErr: any, setFinish: any) {
    return async function (data = null) {
      setLoading(true);
      try {
        const res = await cb(data);
        setLoading(false);
        setFinish(true);
        return res;
      } catch (error) {
        setLoading(false);
        setErr(error);
        setFinish(true);
      }
    };
  }
}

export default Decorator;
