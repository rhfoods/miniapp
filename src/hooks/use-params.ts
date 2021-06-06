import { GETWXCode } from '@/api/api';
import Save from '@/models/save';
import User from '@/models/user';
import Tool from '@/utils/tools';
import { useRouter } from '@tarojs/taro';
import { useEffect, useState } from 'react';

export enum WXCodeType {
  Map = 'M',
  Point = 'P',
  Transfer = 'T',
}
/**
 * 小程序码SCENE定义
 */
export const WECHAT_SCENE_ID = 'Z';

/**
 * 对scene数据进行解码
 */
function decodeScene(scene: string) {
  const type = scene.slice(0, 1) as WXCodeType;
  const id = scene.slice(scene.length - 1);
  const data = scene.slice(1, scene.length - 1);

  const types = [WXCodeType.Map, WXCodeType.Point, WXCodeType.Transfer]
  if (!types.includes(type) || id !== WECHAT_SCENE_ID) {
    Tool.toast({
      text: '解析小程序码发生错误',
    });
    return {};
  }

  if (type === WXCodeType.Transfer) {
    const phone = data.slice(0, 11);
    const userId = data.slice(11);
    const buffer = Buffer.from(userId, 'hex');
    const result = {
      type,
      transfer: {
        phone,
        userId: buffer.readUInt32LE(0)
      }
    };
    return result;
  } else {
    const buffer = Buffer.from(data, 'hex');
    const id = buffer.readUInt32LE(0);
    const commonId = buffer.readInt32LE(4);
    let result, cityCode;

    if (type === WXCodeType.Map) {
      if (id === 0) {
        cityCode = scene.slice(0, scene.length - 1).slice(17);
      }
      result = {
        type,
        share: {
          id,
          commonId,
          cityCode
        }
      }
    } else {
      const noteId = buffer.readUInt32LE(8);
      result = {
        type,
        share: {
          id,
          commonId
        }
      };
      noteId > 0 ? (result.share.topNoteId = noteId) : null;
    }

    return result;
  }
}

function useParams() {
  const [p, setP] = useState(null);
  const { params } = useRouter();

  useEffect(() => {
    const p = Save.getParams();
    if (p) {
      setP(p);
      return;
    }
    // 扫码传参
    if (params.scene) {
      qrCode(params)
      return;
    }
    setP(params); // 转发传参
  }, []);

  /**
   * 解析二维码信息
   */
  async function qrCode(params: any) {
    const scene = decodeScene(params.scene);
    if (scene.type === WXCodeType.Map) {
      if (scene.share.id === 0) {
        setP({
          userId: 0,
          sortId: scene.share.commonId,
          cityCode: scene.share.cityCode
        });
      } else {
        setP({
          userId: scene.share.id,
          sortId: scene.share.commonId,
        });
      }
    } else if (scene.type === WXCodeType.Point) {
      setP({
        psaveId: scene.share.id,
        userId: scene.share.commonId,
        topNoteId: scene.share.topNoteId > 0 ? scene.share.topNoteId : 0,
      });
    } else if (scene.type === WXCodeType.Transfer) {
      if (scene.transfer.userId === User.userId()) {
        setP({})
        return
      }
      GETWXCode({ scene: params.scene }).then(() => {
        setP({
          userId: scene.transfer.userId,
          phone: scene.transfer.phone,
        })
      }).catch(() => {
        setP({})
      })
    }
  }

  return p;
}

export default useParams;
