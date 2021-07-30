import { Schema, model } from 'mongoose'

const todoSchema = new Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false
  },
  key: String
})

export default model('Todo', todoSchema)
