import {
  MapPointFieldLengths,
  SystemConstants,
} from '@/api/types/api.constant';
import { BaseBody } from '@/common/base/base.body';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * 创建点位
 */
export class CreateMapPoint extends BaseBody {
  /**
   * 地址
   */
  @IsString()
  @IsNotEmpty({ message: '请填写点位地址' })
  @MaxLength(512)
  address: string;
  /**
   * 店名
   */
  @IsString()
  @IsNotEmpty({ message: '请填写点位名称' })
  @MaxLength(SystemConstants.SMALL_LENGTH, {
    message: `点位名称不得超过${SystemConstants.LITTLE_LENGTH}字`,
  })
  name: string;
  /**
   * 人均价格
   */
  @IsString()
  price: string;
  /**
   * 标签
   */
  @IsString()
  @IsNotEmpty({ message: '请填写展示标签' })
  @MaxLength(MapPointFieldLengths.TAG, {
    message: `展示标签不得超过${MapPointFieldLengths.TAG}字`,
  })
  tag: string;
  /**
   * 点位logo
   */
  logo: string;
  /**
   * 经度
   */
  longitude: string;
  /**
   * 纬度
   */
  latitude: string;
  /**
   * 分类id
   */
  @IsNotEmpty({
    message: '请选择所属分类',
  })
  sortId: string;
  /**
   * 分类名称
   */
  sortName: string;
  /**
   * 点位id
   */
  psaveId: number;
  /**
   * 是否是自己的点
   */
  isOwn = false;

  constructor(data: any = {}) {
    super(data);
    this.init(data);
  }

  isAdd() {
    if (this.psaveId) return false;
    return true;
  }

  async deepCheck(data?: any): Promise<string> {
    const err = await this.check(data);
    if (err) {
      return err.message;
    }
    return '';
  }

  client2server(formData: any) {
    if ('price' in formData) formData.price = parseInt(formData.price);
    if ('sortId' in formData) formData.sortId = parseInt(formData.sortId);
    if ('latitude' in formData)
      formData.latitude = parseFloat(formData?.latitude);
    if ('longitude' in formData)
      formData.longitude = parseFloat(formData.longitude);
    return formData;
  }

  static server2client(data: any) {
    return {
      psaveId: data.psaveId,
      isOwn: data.isOwn,
      name: data.name,
      address: data.address,
      price: data.price ? String(data.price) : '',
      tag: data.tag,
      logo: data.logo,
      longitude: String(data?.longitude),
      latitude: String(data?.latitude),
      sortId: data.sortId === 0 ? '0' : String(data.sortId),
      sortName: data.sortId === 0 ? '默认分类' : data.sortName,
    };
  }
}

export default CreateMapPoint;
