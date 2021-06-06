import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';

class Loading {
  ing = false;

  show(title: string) {
    this.ing = true;
    Taro.showLoading({ title, mask: true });
  }

  async hide(info = '', time = 1500) {
    Taro.hideLoading();
    this.ing = false;
    if (info) {
      Taro.showToast({ title: info, icon: 'none', mask: true });
      await Tool.sleep(time);
    }
  }
  /**
   * time: 信息显示时长
   */
  async alert(info = '', time = 1500) {
    Taro.showToast({ title: info, icon: 'none', mask: true });
    await Tool.sleep(time);
  }
}

export { Loading };
