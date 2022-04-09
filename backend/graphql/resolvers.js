//Direi che il jwt non mi serve dato che in realtà io sono senza necessaria verifica
//const jwt = require('jsonwebtoken');

const { name } = require("@adminjs/express");
const path = require("path");
var AdmZip = require("adm-zip");
const readingTime = require("reading-time");

const { User, Article, Tag, Topic } = require("../models");
const article = require("../models/article");

module.exports = {
  articles: async function () {
    const errors = [];
    //Rading the article documents
    const articles = await (
      await Article.find({}).sort({ createdAt: -1 }).populate("creator", "name")
    ).filter((article) => article.published == true);
    if (!articles) {
      const error = new Error("Articles published not found!");
      error.code = 404;
      throw error;
    }
    //Creation of reading time
    articles.map(async (article) => {
      if (!article.readingTime) {
        //unisco due stringhe
        //var filePath = ['..', article.fileLocation].join('')
        var zip = new AdmZip(
          path.join(__dirname, "..\\", article.fileLocation)
        );
        var zipEntries = zip.getEntries();
        var file = zipEntries.reduce((entry) => {
          if (entry.entryName.endsWith(".md")) return entry.getData();
        });
        const stats = readingTime(file);
        article.readingTime = stats.text.replace(" read", "...");
        await Article.findByIdAndUpdate(article._id, {
          readingTime: article.readingTime,
        });
      }
    });

    //Praticamente nel return devo andare a mettere tutto l'oggetto
    //rispettando quello che è la struttura data nello schema.
    //quindi per esempio le date le rendo .toString()
    return {
      articles: articles.map((article) => {
        return {
          ...article._doc,
          creator: article.creator.name,
          createdAt: article.createdAt.toISOString(),
        };
      }),
      totalArticles: articles.length,
    };
  }, 
  article: async function ( {id} ) {
    const errors = [];
    const article = await Article.findById(id).populate("creator", "name")
    if(!article.published){
      const error = new Error("Article not found!");
      error.code = 404;
      throw error;
    }

    //Caching the article

    return {
      ...article._doc,
      creator: article.creator.name,
      createdAt: article.createdAt.toISOString(),
    }
  }
};