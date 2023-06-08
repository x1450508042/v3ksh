export default class SocketService {
    /**
     * 单例
     */
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }
    //和服务端连接的socket的对象1
    ws = null
    //储存回调函数
    callBackMapping = {}

    //记录重试次数
    sendCound = 0
    //重新连接的次数
    connectCount=0
    //是否连接成功
    connected = false
    //定义服务器的方法
    connect() {
        //连接服务器
        if (!window.WebSocket) {
            return alert('您的浏览器不支持WebSocket')
        }
        this.ws = new WebSocket('ws://localhost:9898')

        //连接成功的事件 
        this.ws.onopen = () => {
            this.connected = true
            console.log('连接成功的事件');
        }
        //连接失败
        this.ws.onclose = () => {
            this.connected = false
            console.log('连接失败');
            this.connectCount++
            setTimeout(()=>{
                this.connect()
            },500*this.connectCount)
        }
        //得到服务端发送过来的数据
        //服务器发送过来的原始数据时在msg中的data字段
        this.ws.onmessage = msg => {
            console.log('得到服务端发送过来的数据');
            // console.log(msg);
            let resData
            if(typeof msg.data ==='string'){
                resData = JSON.parse(msg.data)
            }else{

                resData = msg.data
                console.log(resData);
            }
            // console.log(typeof msg.data ==='string');
           
            // console.log(resData);
            const sockettype = resData.socketType
            //判断回调函数是否存在
            if (this.callBackMapping[sockettype]) {
                const action = resData.action
                if (action === 'getData') {
                    const res = JSON.parse(resData.data)
                    this.callBackMapping[sockettype].call(this, res)
                } else if (action === 'fullScreen') {
                    this.callBackMapping[sockettype].call(this,resData)
                } else if (action === 'themeChange') {
                    this.callBackMapping[sockettype].call(this,resData)
                }
            }
        }
    }
    registerCallBack(socketType, callBakc) {
        this.callBackMapping[socketType] = callBakc
    }
    unregisterCallBack(socketType) {
        //取消某一个回调函数
        this.callBackMapping[socketType] = null
    }

    //发送数据的方法
    send(data) {
        if (this.connected) {
            this.sendCound=0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendCound++
            setTimeout(() => {

                this.send(data)
            }, this.sendCound*500)
        }

    }
}
