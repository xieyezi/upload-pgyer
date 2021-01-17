/**
 * @required --platform 构建的平台 (android/ios)
 * @required --filepath 上传文件的绝对路径
 * @required --webhook 要发送平台提供的webhook
 * @required --apikey 蒲公英平台提供的API key
 * @required --buildurl 本次构建的url地址
 * @required --target 发送消息的平台 支持飞书(lark)、钉钉(dingtalk)、企业微信(wechat)
 * 调用示例：
 *   node upload-pgyer.js --filepath='xxxx' --apikey='xxxx' --webhook='xxxx' --buildurl='https://www.baidu.com/' --platform='android' --target='lark'
 */
import lark from '../lib/lark'
import wechat from '../lib/wechat'
import dingtalk from '../lib/dingtalk'
const args = require('minimist')(process.argv.slice(2))

const apiKey = args['apikey']
const webHook = args['webhook']
const filePath = args['filepath']
const buildUrl = args['buildurl']
const platForm = args['platform']
const target = args['target']

console.log('platForm', platForm)
console.log('filePath:', filePath)
console.log('webHook:', webHook)
console.log('apiKey:', apiKey)
console.log('buildUrl:', buildUrl)
console.log('target:', target)

switch (target) {
	case 'lark':
		lark(apiKey, webHook, filePath, buildUrl, platForm)
		break
	case 'dingtalk':
		dingtalk(apiKey, webHook, filePath, buildUrl, platForm)
		break
	case 'wechat':
		wechat(apiKey, webHook, filePath, buildUrl, platForm)
		break
	default:
		throw new Error('there may be something error....')
}
