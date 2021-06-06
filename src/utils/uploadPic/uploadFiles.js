import config from '../../config/http';
import upload from './uploadFile';

let {shareShopImage, shareMerchantImage} = config

/**
 * sts : {OSSAccessKeyId, AccessKeySecret, stsToken}
 * tmps: [{name, tmp}]
 */
export function uploadMedias(sts, tmps) {
	let {AccessKeyId, AccessKeySecret, SecurityToken} = sts
	return upload2ali({
		tmps,
		OSSAccessKeyId: AccessKeyId, 
		AccessKeySecret: AccessKeySecret, 
		stsToken: SecurityToken,
	})
}

/**
 * 批量上传到阿里云oss
 * tmps:  要上传的临时文件 [{ tmp, picName }, { tmp, picName }, ... ], 
 * OSSAccessKeyId: 接口 "shop/update" 返回的数据 
 * AccessKeySecret: 接口 "shop/update" 返回的数据 
 * stsToken: 接口 "shop/update" 返回的数据 
  * */ 
export function upload2ali({ tmps, OSSAccessKeyId, AccessKeySecret, stsToken }) {
	let arr = []
	tmps.map(item => {
		let aliUrl = getAliUrl(item.name)
		arr.push(upload({
			filePath: item.tmp,		// 临时图片地址
			name: item.picName,			// 图片名字
			url: aliUrl,          // 阿里云地址
			OSSAccessKeyId: OSSAccessKeyId,
			AccessKeySecret: AccessKeySecret,
			stsToken: stsToken,
		}))						
	})
	return Promise.all(arr)
}

/**
 * 根据图片名上传到不同的 Basket
 */
function getAliUrl(imageName) {
	let aliUrl = shareShopImage
	let type = imageName.split('/')[2]
	if(type === 'IB' || type === 'IF' || type === 'LS') {
		aliUrl = shareMerchantImage
	}
	return aliUrl
}