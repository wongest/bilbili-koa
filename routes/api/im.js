const Router = require('koa-router')
const router = new Router()

/**
 * @route GET appi/im/testsocket
 * @desc 测试socket接口地址
 * @acsess 接口公开 
 */
router.post('/testsocket', async ctx => {
  ctx.websocket.on('message', function (message) {
    console.log(message);
    // 返回给前端的数据
    let data = JSON.stringify({
        id: Math.ceil(Math.random()*1000),
        time: parseInt(new Date()/1000)
    })
    ctx.websocket.send(data);
  })
})

module.exports = router.routes()