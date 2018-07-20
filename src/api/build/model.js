import mongoose, { Schema } from 'mongoose'

const buildSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  steps: [{
    time: String,
    supply: String,
    action: String,
    comment: String
  }],
  comments: [{
    user: { type: String },
    text: { type: String },
    timestamp: { type: Date, default: Date.now() }
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

buildSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      title: this.title,
      description: this.description,
      steps: this.steps,
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Build', buildSchema)

export const schema = model.schema
export default model
