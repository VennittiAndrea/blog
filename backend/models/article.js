const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

// const marked = require('marked');
// const createDomPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
// const dompurify = createDomPurify(new JSDOM().window);

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
    fileLocation: {
      type: String,
    },
    imageLocation: {
      type: String,
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
    },
    sanitizedHtml: {
      type: String,
    },
    published: {
      type: Boolean,
    }
  }
);

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  // if (this.content) {
  //   this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
  // }
  next()
})

module.exports = mongoose.model('Article', articleSchema);
