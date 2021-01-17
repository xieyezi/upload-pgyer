import fs from 'fs'
import Ora from 'Ora'
import dayJs from 'dayjs'
import request from 'request'

const wechat = (apiKey: string, webHook: string, filePath: string, buildUrl: string, platForm: string) => {
	const fileIsExist = fs.existsSync(filePath)
	// check file is Exist
	if (!fileIsExist) {
		const fileNotExistOptions = {
			method: 'POST',
			url: webHook,
			headers: {
				'content-type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				msgtype: 'markdown',
				markdown: {
					content: `## 新的构建任务\n**构建平台**\n${platForm}\n**构建状态**\n<font color="warning">失败</font>\n**失败原因**\nCan not find file,plase check filePath.\n**任务名称**\n[${buildUrl}](${buildUrl})\n**结束时间**\n${dayJs(
						new Date()
					).format('YYYY-MM-DD HH:mm:ss')}\n[查看详情](${buildUrl})`
				}
			})
		}
		request(fileNotExistOptions, function (error, response) {
			if (error) throw new Error(error)
			console.log('send success', response.body)
			console.error('file not exist,plase check filePath.')
		})
	} else {
		const spinner = Ora({
			text: `${filePath} is uploading....\n`
		})
		const uploadOptions = {
			method: 'POST',
			url: 'https://www.pgyer.com/apiv2/app/upload',
			headers: {
				'content-type': 'multipart/form-data'
			},
			formData: {
				_api_key: apiKey,
				file: fs.createReadStream(`${filePath}`)
			}
		}
		// start upload
		spinner.start()
		request(uploadOptions, function (error, response) {
			if (error) throw new Error(error)
			const res = JSON.parse(response.body)
			sendMessageToDingTalk(res)
			spinner.stop()
		})
		// send result to lark
		const sendMessageToDingTalk = (res) => {
			console.log(res)
			if (res.code === 0) {
				const dowloadUrl = `https://www.pgyer.com/${res.data.buildShortcutUrl}`
				const successOptions = {
					method: 'POST',
					url: webHook,
					headers: {
						'content-type': 'application/json;charset=utf-8'
					},
					body: JSON.stringify({
						msgtype: 'markdown',
						markdown: {
							content: `## 新的构建任务\n**构建平台**\n${platForm}\n**构建状态**\n<font color="info">成功</font>\n**任务名称**\n[${buildUrl}](${buildUrl})\n**项目名称**\n${
								res.data.buildName
							}\n**结束时间**\n${dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')}\n[点击下载](${dowloadUrl})`
						}
					})
				}
				request(successOptions, function (error, response) {
					if (error) throw new Error(error)
					console.log('success', response.body)
				})
			} else {
				const uploadFaliedOptions = {
					method: 'POST',
					url: webHook,
					headers: {
						'content-type': 'application/json;charset=utf-8'
					},
					body: JSON.stringify({
						msgtype: 'markdown',
						markdown: {
							content: `## 新的构建任务\n**构建平台**\n${platForm}\n**构建状态**\n<font color="warning">失败</font>\n**失败原因**\nUpload to Pgyer falied,The reason is:${
								res.message
							}\n**任务名称**\n[${buildUrl}](${buildUrl})\n**结束时间**\n${dayJs(new Date()).format(
								'YYYY-MM-DD HH:mm:ss'
							)}\n[查看详情](${buildUrl})`
						}
					})
				}
				request(uploadFaliedOptions, function (error, response) {
					if (error) throw new Error(error)
					console.log('send success', response.body)
					console.warn('upload falied,there may be have some error.')
				})
			}
		}
	}
}
export default wechat
