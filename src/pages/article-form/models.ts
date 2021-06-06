import {
  MapPointFieldLengths,
  PointNoteLinkTypes
} from '@/api/types/api.constant';
import { BaseBody } from '@/common/base/base.body';
import { IShopInfo } from '@/component/form/point-info';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * 创建点位
 */
export class ArticleForm extends BaseBody {
  @IsString()
  @IsNotEmpty({
    message: '请填写日记标题',
  })
  @MaxLength(MapPointFieldLengths.NOTE_TITLE, {
    message: `日记标题不得超过${MapPointFieldLengths.NOTE_TITLE}字`,
  })
  title: string;

  @IsString()
  @MaxLength(MapPointFieldLengths.NOTE_CONTENT, {
    message: `日记内容不得超过${MapPointFieldLengths.NOTE_CONTENT}字`,
  })
  content: string;

  @IsNotEmpty({
    message: '请指定点位',
  })
  psaveId: string;
  pointInfo: IShopInfo;

  medias: string[];
  scenes: string[];
  recommend: boolean;

  [PointNoteLinkTypes.BILIBILI]: string;
  [PointNoteLinkTypes.WEIBO]: string;
  [PointNoteLinkTypes.REDBOOK]: string;
  noteId: number;

  constructor(data: any = {}) {
    super(data);
    this.init(data);
  }

  async deepCheck(data?: any): Promise<string> {
    const err = await this.check(data);
    if (err?.message) {
      return err.message;
    }
    if (this.medias.length === 0) {
      return '必须上传图片或视频';
    }
    if (this.isBv() === false) {
      return 'b站链接不对';
    }
    if (this.isWb() === false) {
      return '微博链接不对';
    }
    if (this.isRb() === false) {
      return '小红书链接不对';
    }
    return '';
  }

  isAdd() {
    if (this.noteId) return false;
    return true;
  }

  static server2client(serverData: any, point: any) {
    let params: any = { ...serverData };
    params.psaveId = String(serverData.psaveId);
    if (point?.psaveId) params.psaveId = String(point.psaveId);
    return params;
  }

  client2server(formData: any) {
    let data: any = { ...formData };
    if (PointNoteLinkTypes.REDBOOK in formData) {
      data[PointNoteLinkTypes.REDBOOK] = ArticleForm.rbUrl(
        formData[PointNoteLinkTypes.REDBOOK]
      );
    }
    data[PointNoteLinkTypes.REDBOOK] === ''
      ? delete data[PointNoteLinkTypes.REDBOOK]
      : null;
    data[PointNoteLinkTypes.WEIBO] === ''
      ? delete data[PointNoteLinkTypes.WEIBO]
      : null;
    data[PointNoteLinkTypes.BILIBILI] === ''
      ? delete data[PointNoteLinkTypes.BILIBILI]
      : null;
    data.content === '' ? delete data.content : null;
    if ('psaveId' in formData) data.psaveId = parseInt(formData.psaveId);
    return data;
  }

  static wbUrl(wb: string) {
    if (!wb) return '';
    return wb;
  }

  static rbUrl(rb: string) {
    if (!rb) return '';
    const reg = /http[^，]*/;
    return reg.exec(rb)[0] || '';
  }

  isBv() {
    const str = this[PointNoteLinkTypes.BILIBILI];
    if (!str) return true;
    const reg = /^BV\w*/;
    if (str.match(reg)) return true;
    return false;
  }

  isWb() {
    const str = this[PointNoteLinkTypes.WEIBO];
    if (!str) return true;
    const regMobile = /^https:\/\/m.weibo.cn[^,]*/;
    const regWeb = /^https:\/\/weibo.com[^,]*/;
    if (str.match(regMobile)) return true;
    if (str.match(regWeb)) return true;
    return false;
  }

  isRb() {
    const str = this[PointNoteLinkTypes.REDBOOK];
    if (!str) return true;
    const reg = /http[^，]*/;
    if (str.match(reg)) return true;
    return false;
  }
}

export default ArticleForm;
