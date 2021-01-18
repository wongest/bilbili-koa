const Router = require('koa-router')
const router = new Router()
const Video = require('../../models/Video')
const uuidv1 = require('uuid').v1;

const paramError = (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: -1,
    message: '参数错误'
  }
}

const successNoParam = (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    message: 'success'
  }
}

const listParam = (ctx, {pageNum, numPerPage}, result = []) => {
  const recordList = result.slice((pageNum - 1) * numPerPage, pageNum * numPerPage)
  ctx.status = 200
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      pageCount: parseInt(result.length / numPerPage) + 1,
      totalCount: result.length,
      currentPage: pageNum,
      recordList
    }
  }
}


/**
 * @route POST api/video/add
 * @desc 添加视频地址
 * @acsess 接口公开 
 */
router.post('/add', async ctx => {
  const { name: vname, cover, tips = '[]' } = ctx.request.body
  try {
    tips_arr = JSON.parse(tips)
  } catch (e) {
    paramError(ctx)
    return
  }
  // 实例化数据
  const newVideo = new Video({
    vid: uuidv1(), name: vname, cover, tips: tips_arr
  })
  // 存储到数据库
  await newVideo.save()
  successNoParam(ctx)
})

/**
 * @route POST api/video/queryVideos
 * @desc 获取视频列表
 * @acsess 接口公开 
 */
router.post('/queryVideos', async ctx => {
  let { pageNum = 1, numPerPage = 10, name: vname, } = ctx.request.body
  try {
    pageNum = Number(pageNum)
    numPerPage = Number(numPerPage)
  } catch (e) {
    paramError(ctx)
    return
  }
  const reg = new RegExp(vname, 'i')
  const result = await Video.find({
    $or: [
      { name: { $regex: reg } },
    ]
  },
    { vid: 1, name: 1, cover: 1, tips: 1, _id: 0 }
  )

  listParam(ctx, {pageNum, numPerPage}, result)
})



module.exports = router.routes()