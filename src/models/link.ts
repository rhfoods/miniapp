import bv2av from '@/utils/bv2av';
import Taro from '@tarojs/taro';

class LinkMini {
  static jumpBL(bv: string) {
    let av = bv2av(bv);
    if (!av) {
      return;
    }
    av = av.substr(2);
    Taro.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path: `pages/video/video?avid=${av}`,
    });
  }
  static jumpWB(wburl: string) {
    const arr = wburl.split('/');
    const blogId = arr[arr.length - 1];
    Taro.navigateToMiniProgram({
      appId: 'wx9074de28009e1111',
      path: `pages/index/index?blog_id=${blogId}`,
    });
  }
}

export default LinkMini;
