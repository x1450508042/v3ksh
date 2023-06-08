// 处理业务逻辑的中间键 ， 读取json 文件的数据
const path = require('path')
const fileUlits=require('../utils/file_utils')
module.exports= async (ctx,next)=>{
    //根据url
    const url =ctx.request.url
    let filePath = url.replace('/api','')
    filePath='../data'+filePath+'.json'
    filePath=path.join(__dirname,filePath)
    
    try{
        const ret =await fileUlits.getFileJsonDate(filePath)
        ctx.response.body=ret
    }catch(error){
        const errorMsg={
            message:'读取文件失败，文件资源不存在',
            statue:404
        }
        ctx.response.body=JSON.stringify(errorMsg)
    }
    
    console.log(filePath);
    await next()
}