const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window) 

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
      type: String
    },
    content: {
      type: String,
      required: true
    },
    sanitizedHtml: {
      type: String,
    },
    images: {
      type: Object, 
    }
  
  }
);

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  if (this.content) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
  }
  next()
})

module.exports = mongoose.model('Article', articleSchema);
