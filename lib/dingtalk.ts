import fs from 'fs'
import Ora from 'Ora'
import dayJs from 'dayjs'
import request from 'request'

const dingtalk = (apiKey: string, webHook: string, filePath: string, buildUrl: string, platForm: string) => {
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
				msgtype: 'actionCard',
				actionCard: {
					title: '新的构建任务',
					text: `## 新的构建任务\n\n **构建平台**\n\n ${platForm} \n\n  **构建状态**\n\n 失败 \n\n **失败原因** \n\n Can not find file,plase check filePath. \n\n **任务名称** \n\n [${buildUrl}](${buildUrl}) \n\n **结束时间** \n\n ${dayJs(
						new Date()
					).format('YYYY-MM-DD HH:mm:ss')} \n\n`,
					hideAvatar: '0',
					btnOrientation: '0',
					btns: [
						{
							title: '查看详情',
							actionURL: buildUrl
						}
					]
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
						msgtype: 'actionCard',
						actionCard: {
							title: '新的构建任务',
							text: `## 新的构建任务\n\n **构建平台**\n\n ${platForm} \n\n **构建状态**\n\n 成功 \n\n **任务名称** \n\n [${buildUrl}](${buildUrl})  \n\n **项目名称** \n\n ${
								res.data.buildName
							} \n\n **结束时间** \n\n ${dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')} \n\n`,
							hideAvatar: '0',
							btnOrientation: '0',
							btns: [
								{
									title: '点击下载',
									actionURL: dowloadUrl
								}
							]
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
						msgtype: 'actionCard',
						actionCard: {
							title: '新的构建任务',
							text: `## 新的构建任务\n\n  **构建平台**\n\n ${platForm} \n\n **构建状态**\n\n 失败 \n\n **失败原因** \n\n Upload to Pgyer falied,The reason is: ${
								res.message
							} \n\n **任务名称** \n\n [${buildUrl}](${buildUrl}) \n\n **结束时间** \n\n ${dayJs(new Date()).format(
								'YYYY-MM-DD HH:mm:ss'
							)} \n\n`,
							hideAvatar: '0',
							btnOrientation: '0',
							btns: [
								{
									title: '查看详情',
									actionURL: buildUrl
								}
							]
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
export default dingtalk
