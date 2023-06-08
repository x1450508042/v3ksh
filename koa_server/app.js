//服务器入口文件
//1、创建koa实例对象
const koa = require('koa')
const app=new koa()
//2、绑定中间件
//第一层中间件  计算服务器消耗时长
const resDur = require('./middleware/koa_response_duration')
app.use(resDur)
//第二层中间件 响应头
const respHader=require('./middleware/koa_response_header')
app.use(respHader)
//第三层中间件  处理业务逻辑
const respData = require('./middleware/koa_response_data')
app.use(respData)

//3、绑定端口号
let part = 8888
app.listen(part)
console.log(`http://127.0.0.1:${part}`);

const webSocketService=require('./service/WebSocketService')
//开启服务端的监听 ，监听客户端的连接
//当某一个客户端连接成功后，就会对这个客户端进行message的监听
webSocketService.listen()
