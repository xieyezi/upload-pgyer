/**
 * @required --platform 发送消息的平台
 * @required --filepath 上传文件的绝对路径
 * @required --webhook 要发送平台提供的webhook
 * @required --apikey 蒲公英平台提供的API key
 * @required --buildurl 本次构建的url地址
 * 调用示例：
 *   node index.js --filepath='/User/xxxxx.apk' --apikey='xxxxxx' --webhook='https://www.baidu.com/' --buildurl='https://www.baidu.com/' --platform='lark'
 */
import lark from '../lib/lark'
import wechat from '../lib/wechat'
import dingding from '../lib/dingding'
const args = require('minimist')(process.argv.slice(2))

const apiKey = args['apikey']
const webHook = args['webhook']
const filePath = args['filepath']
const buildUrl = args['buildurl']
const platForm = args['platform']

console.log('platForm', platForm)
console.log('filePath:', filePath)
console.log('webHook:', webHook)
console.log('apiKey:', apiKey)
console.log('buildUrl:', buildUrl)

switch (platForm) {
	case 'lark':
		lark(apiKey, webHook, filePath, buildUrl)
		break
	case 'dingding':
		dingding(apiKey, webHook, filePath, buildUrl)
		break
	case 'wechat':
		wechat(apiKey, webHook, filePath, buildUrl)
		break
	default:
		throw new Error('there may be something error....')
}
