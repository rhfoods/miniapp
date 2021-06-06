// const env = require('./config.js'); //配置文件，在这文件里配置你的OSS keyId和KeySecret,timeout:87600;
// import env from "./config.js"

const base64 = require('./base64.js');//Base64,hmac,sha1,crypto相关算法
const Crypto = require('./crypto.js');

require('./hmac.js');
require('./sha1.js');

/*
 * 上传文件到阿里云oss
 * @filePath - filePath: 临时文件
 * @name 	 - 文件名: "shopID/123.png"
 */ 
export default function ({filePath, name, url, OSSAccessKeyId, AccessKeySecret, stsToken, callback} ) {
	//图片名字 可以自行定义，     这里是采用当前的时间戳 + 150内的随机数来给图片命名的
	// const aliyunFileKey = name + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
	const aliyunFileKey = name										// 文件名: "shopID/123.png"
	const aliyunServerURL = url										// 开发者服务器 url
	const accessid = OSSAccessKeyId;								// 账号
	const policyBase64 = getPolicyBase64();							// 设置图片大小, 上传失效时间
	const signature = getSignature(policyBase64, AccessKeySecret);	// 获取签名
	
	return new Promise((resolve, reject) => {
		const uploadTask = wx.uploadFile({
			url: aliyunServerURL,					// 开发者服务器 url
			filePath: filePath,						// 临时文件
			// fileType: 'image',
			name: 'file',							// 必须填file
			formData: {
				'key': aliyunFileKey,				// 文件名称
				'policy': policyBase64,				// 设置图片大小, 上传失效时间
				'OSSAccessKeyId': accessid,			// 账号
				'signature': signature,				// 加密后的密码
				"x-oss-security-token": stsToken,
				'success_action_status': '200',
			},
			success: function (res) {
				if (res.statusCode != 200) {
					reject(JSON.stringify(res))
					return;
				}
				resolve(name)
			},
			fail: function (err) {
				err.wxaddinfo = aliyunServerURL;
				wx.showToast({ title: '上传图片失败', mask: true, icon: 'none' });
				reject(err)
			},
			complete: function (res) {
			},
		})	
			
		// 上传进度 
		uploadTask.onProgressUpdate((res) => {
			if(callback) {
				callback(res.progress)
			}
		});
	})
}

// 设置规则
export const getPolicyBase64 = function () {
	let date = new Date();
	date.setHours(date.getHours() + 1);			// 加一小时
	let srcT = date.toISOString();
	var policyText = {
		// "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
		"expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
		"conditions": [
			["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
		]
	}	
  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

// 签名
export const getSignature = function (policyBase64, AccessKeySecret) {
  const accesskey = AccessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);
  return signature;
}