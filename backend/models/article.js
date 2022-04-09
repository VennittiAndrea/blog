const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
const path = require("path");
//var AdmZip = require("adm-zip");
//const readingTime = require("reading-time");

// const marked = require('marked');
// const createDomPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
// const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    // NOTE: It is possible to remove this field, the path is the ID/nameFile
    fileLocation: {
      type: String,
    },
    // NOTE: It is possible to remove this field, the path is the ID/nameFile
    imageLocation: {
      type: String,
    },
    readingTime: {
      type: String,
    },
    tag: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    slug: {
      type: String,
    },
    sanitizedHtml: {
      type: String,
    },
    published: {
      type: Boolean,
      required: true,
    },
    visuals: {
      type: Number,
    },
  },
  { timestamps: true }
);

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    console.log(this.slug)
  }
  // if (this.fileLocation) {
  //   var zip = new AdmZip(this.fileLocation);
  //   var zipEntries = zip.getEntries();
  //   var file = zipEntries.reduce((entry) => {
  //     if (entry.entryName.endsWith(".md")) return entry.getData();
  //   });
  //   const stats = readingTime(file);
  //   this.readingTime = stats.text.replace(" read", "...");
  //   console.log(this.readingTime);
  // }
  // if (this.content) {
  //   this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
  // }
  next();
});



module.exports = mongoose.model("Article", articleSchema);
