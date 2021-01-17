## upload-pgyer


这是一款上传apk/ipa文件到蒲公英并通知到指定群的工具（同时支持钉钉、飞书、企业微信）.

> 注：本项目依赖于`node.js`，使用前请先安装 `node.js` 环境 ，然后在项目根目录执行`npm install` 安装依赖.


### 使用示例
```js
node upload-pgyer.js --filepath='xxxx' --apikey='xxxx' --webhook='xxxx' --buildurl='https://www.baidu.com/' --platform='android' --target='lark'
```

### 所需参数
 name | description | value:string
 ---- | --- | ----
 platform |	构建的平台         |  ios / android
 filepath |	上传文件的绝对路径   |   string  
 apikey   |	蒲公英平台提供的API key	  |     string
 webhook  |	要发送平台提供的webhook	  |       string
 buildurl |本次构建的url地址 |  string
 target   |	发送消息的平台 | lark / dingtalk / wechat



注： 由于钉钉的 `webhook` 必须设置安全校验，这里默认关键词设置为`新的构建任务`.即是：如果你使用的是钉钉平台，那么添加机器人的时候必须设置`keyword`为`新的构建任务`.
 ### 预览
依次为飞书、钉钉、企业微信：

| ![](./screenshot/lark_success.jpg)  | ![](./screenshot/lark_failed.jpg) |
| :---------------------------------: | :---------------------------------: |
| ![](./screenshot/dingtalk_success.jpg)  | ![](./screenshot/dingtalk_failed.jpg) 
| ![](./screenshot/wechat_success.jpg) | ![](./screenshot/wechat_failed.jpg)                            
