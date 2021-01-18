const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 实例化数据模板
const VideoSchema = new Schema({
  vid: {
    type: 'String',
    required: true
  },
  name: {
    type: 'String',
    required: true
  },
  cover: {
    type: 'String',
    required: true
  },
  tips: {
    type: 'Array',
    required: false
  },
  date: {
    type: 'Date',
    default: Date.now
  },
})

module.exports = Video = mongoose.model('video', VideoSchema)