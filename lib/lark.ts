const fs = require('fs')
const Ora = require('Ora')
const dayJs = require('dayjs')
const request = require('request')

const lark = (apiKey: string, webHook: string, filePath: string, buildUrl: string) => {
	const fileIsExist = fs.existsSync(filePath)
	// check file is Exist
	if (!fileIsExist) {
		const fileNotExistOptions = {
			method: 'POST',
			url: webHook,
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				msg_type: 'interactive',
				card: {
					config: {
						wide_screen_mode: true,
						enable_forward: true
					},
					elements: [
						{
							tag: 'div',
							text: {
								tag: 'lark_md',
								content: ''
							},
							fields: [
								{
									is_short: false,
									text: {
										tag: 'lark_md',
										content: ''
									}
								},
								{
									is_short: true,
									text: {
										tag: 'lark_md',
										content: '**构建状态:**\n构建失败'
									}
								},
								{
									is_short: false,
									text: {
										tag: 'lark_md',
										content: ''
									}
								},
								{
									is_short: true,
									text: {
										tag: 'lark_md',
										content: '**失败原因:**\nCan not find file,plase check filePath.'
									}
								},
								{
									is_short: false,
									text: {
										tag: 'lark_md',
										content: ''
									}
								},
								{
									is_short: true,
									text: {
										tag: 'lark_md',
										content: `**任务名称:**\n${buildUrl}`
									}
								},
								{
									is_short: false,
									text: {
										tag: 'lark_md',
										content: ''
									}
								},
								{
									is_short: false,
									text: {
										tag: 'lark_md',
										content: `**结束时间:**\n${dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')}`
									}
								}
							]
						},
						{
							tag: 'action',
							actions: [
								{
									tag: 'button',
									url: buildUrl,
									text: {
										tag: 'plain_text',
										content: '查看详情'
									},
									type: 'danger'
								}
							]
						}
					],
					header: {
						title: {
							content: '🔥-新的构建任务',
							tag: 'plain_text'
						}
					}
				}
			})
		}
		request(fileNotExistOptions, function (error, response) {
			if (error) throw new Error(error)
			console.log('send success', response.body)
			console.warn('file not exist,plase check filePath.')
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
			sendMessageToLark(res)
			spinner.stop()
		})
		// send result to lark
		const sendMessageToLark = (res) => {
			console.log(res)
			if (res.code === 0) {
				const dowloadUrl = `https://www.pgyer.com/${res.data.buildShortcutUrl}`
				const successOptions = {
					method: 'POST',
					url: webHook,
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({
						msg_type: 'interactive',
						card: {
							config: {
								wide_screen_mode: true,
								enable_forward: true
							},
							elements: [
								{
									tag: 'div',
									text: {
										tag: 'lark_md',
										content: ''
									},
									fields: [
										{
											is_short: true,
											text: {
												tag: 'lark_md',
												content: '**构建状态:**\n构建成功'
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: ''
											}
										},
										{
											is_short: true,
											text: {
												tag: 'lark_md',
												content: `**任务名称:**\n${buildUrl}`
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: ''
											}
										},
										{
											is_short: true,
											text: {
												tag: 'lark_md',
												content: `**项目名称:**\n${res.data.buildName}`
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: ''
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: `**结束时间:**\n${dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')}`
											}
										}
									]
								},
								{
									tag: 'action',
									actions: [
										{
											tag: 'button',
											url: dowloadUrl,
											text: {
												tag: 'plain_text',
												content: '点击下载'
											},
											type: 'primary'
										}
									]
								}
							],
							header: {
								title: {
									content: '🌈-新的构建任务',
									tag: 'plain_text'
								}
							}
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
						'content-type': 'application/json'
					},
					body: JSON.stringify({
						msg_type: 'interactive',
						card: {
							config: {
								wide_screen_mode: true,
								enable_forward: true
							},
							elements: [
								{
									tag: 'div',
									text: {
										tag: 'lark_md',
										content: ''
									},
									fields: [
										{
											is_short: true,
											text: {
												tag: 'lark_md',
												content: '**构建状态:**\n构建失败'
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: ''
											}
										},
										{
											is_short: true,
											text: {
												tag: 'lark_md',
												content: `**失败原因:**\n Upload to Pgyer falied,The reason is: ${res.message}`
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: ''
											}
										},
										{
											is_short: true,
											text: {
												tag: 'lark_md',
												content: `**任务名称:**\n${buildUrl}`
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: ''
											}
										},
										{
											is_short: false,
											text: {
												tag: 'lark_md',
												content: `**结束时间:**\n${dayJs(new Date()).format('YYYY-MM-DD HH:mm:ss')}`
											}
										}
									]
								},
								{
									tag: 'action',
									actions: [
										{
											tag: 'button',
											url: buildUrl,
											text: {
												tag: 'plain_text',
												content: '查看详情'
											},
											type: 'danger'
										}
									]
								}
							],
							header: {
								title: {
									content: '🔥-新的构建任务',
									tag: 'plain_text'
								}
							}
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
export default lark
