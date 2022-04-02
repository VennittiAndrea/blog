const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, 
    abstract: {
      type: String, 
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    tag: [
      {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true
      }
    ],
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    markcontent: {
      type: String,
      required: true
    },
  
  }
);

module.exports = mongoose.model('Article', articleSchema);
