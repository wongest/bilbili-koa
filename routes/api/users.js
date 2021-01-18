const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('../../config/keys')
const passport = require('koa-passport')

/**
 * @route GET appi/users/test
 * @desc 测试接口地址
 * @acsess 接口公开 
 */
router.post('/test', async ctx => {
  console.log(ctx.request.body)
  ctx.status = 200
  ctx.body = {
    code: 0,
    msg: 'this is test api',
    data: {
      name: 'test',
      ...ctx.request.body
    }
  }
})

/**
 * @route POST appi/users/register
 * @desc 测试接口地址
 * @acsess 接口公开 
 */
router.post('/register', async ctx => {
  const { email, name, account, password, avatar } = ctx.request.body
  const findResult = await User.find({email})
  if(findResult && findResult.length > 0) {
    ctx.body = {
      code: -1,
      message: '账号已存在',
      data: {}
    }
  } else {
    // 实例化数据
    const newUser = new User({
      name, email, account, password, avatar
    })
    // 存储到数据库
    await newUser.save()
    
    ctx.body = {
      code: 0,
      message: 'succuss',
      data: { ...ctx.request.body }
    }
  }
})

/**
 * @route GET appi/users/login
 * @desc 登录接口地址
 * @acsess 接口公开 
 */
router.post('/login', async ctx => {
  const { email, password } = ctx.request.body
  console.log(email, password, ctx.request.body)
  const user = await User.find({email, password})
  if(user && user.length > 0) {
    // 验证通过
    const { id, name } = user[0]
    const payload = {
      id,
      name,
    }
    const token = jwt.sign(payload, secretOrKey, { expiresIn: 3600 })
    ctx.status = 200
    ctx.body = {
      code: 0,
      token: 'Bearer ' + token,
      message: '登录成功'
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: -1,
      message: '账号不存在或密码错误'
    }
  }
})

/**
 * @route POST appi/users/current
 * @desc 获取用户信息接口地址
 * @acsess 接口私密
 */
router.post('/current', async (ctx) => {
  return passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (user) {
      const { name, email, account, avatar } = user
        ctx.body = {
          code: 0,
          data: { name, email, account, avatar }
        }
    } else {
        ctx.body = {
          code: 999
        }
    }
})(ctx)
})


/**
 * @route POST appi/users/testtoken
 * @desc 测试token
 * @acsess 接口公开
 */
router.post('/testtoken', async (ctx) => {
  const { token } = ctx.request.body
  console.log(token)
  if(token) {
    jwt.verify(token, secretOrKey, (error, decode) => {
      if(error) {
        console.log(error)
        return
      }
      console.log(decode)
    })
  }
})

/**
 * @route POST appi/users/setcookie
 * @desc 设置cookie
 * @acsess 接口公开
 */
router.get('/cookie', async (ctx) => {
  const cookie = ctx.cookies.get('cid')
  console.log(cookie, '=====cookie=======')

  ctx.cookies.set(
    'cid', 
    'hello666',    //可替换为token
    {
      domain: 'localhost',  // 写cookie所在的域名
      path: '/',       // 写cookie所在的路径
      maxAge: 365 * 24 * 60 * 60 * 1000, // cookie有效时长
      expires: new Date('2021-02-15'),  // cookie失效时间
      httpOnly: false,  // 是否只用于http请求中获取
      overwrite: false  // 是否允许重写
    }
  )
  ctx.code = 200
  ctx.body = { msg: '=====cookie=======' }
})

module.exports = router.routes()