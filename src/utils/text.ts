class Text {
  /**
   * 99999 -> '999.99'
   */
  static priceStr(value: number) {
    if (!value) {
      return '';
    }
    return String(value / 100);
  }
  /**
   * '99.99' -> 99990
   */
  static priceNum(value: string) {
    let num = Number(value);
    return num * 100;
  }
  /**
   * '1.2324' -> '1.23'
   */
  static fix(value: string) {
    if (!value) return value;
    let price = parseFloat(value);
    price = Math.floor(price * 100) / 100;
    return String(price);
  }
  /**
   * '沙发发生发大' --> '沙发...'
   */
  static ellipsis(text: string, len = 16, addEllips = true) {
    if (!text) return '';
    if (text.length > len) {
      text = text.substr(0, len);
      if(addEllips) text += '…'
      return text
    }
    return text;
  }
  /**
   * 是否为空 or 全为空格
   */
  static isNull(str) {
    if (str == '') return true;
    var regu = '^[ ]+$';
    var re = new RegExp(regu);
    return re.test(str);
  }
}

export default Text;
