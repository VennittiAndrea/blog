//Direi che il jwt non mi serve dato che in realtà io sono senza necessaria verifica
//const jwt = require('jsonwebtoken');

const fs = require("fs");
const { ObjectId} = require('mongodb');
const { name } = require("@adminjs/express");
const path = require("path");
var AdmZip = require("adm-zip");
const readingTime = require("reading-time");

const { User, Article, Tag, Topic } = require("../models");
const article = require("../models/article");
const {sanitizer} = require("./structures");

module.exports = {
  articles: async function () {
    const errors = [];
    //Rading the article docuemnts from the database
    //The idea is to take the ones ready to be published and in descending chronological order
    const articles = await (
      await Article.find({}).sort({ createdAt: -1 }).populate("creator", "name")
    ).filter(
      (article) =>
        article.published == true &&
        article.fileLocation &&
        article.imageLocation
    );
    // console.log("Articles")
    // console.log(articles)
    if (!articles) {
      const error = new Error("Articles published not found!");
      error.code = 404;
      throw error;
    }
    //Creation of reading time for every articles
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

    ///// CACHING METHOD /////
    //Creation of caching object
    //Taking the 10 most visualized articles
    //Articoli da prendere?
    //Number cached articles = 5
    const articleCache = 5;
    var articlesToBeCachedId= []
    if (articles.length >= articleCache) {
      //Super interesting selection method
      articles
        .sort((x, y) => y.visuals - x.visuals)
        .splice(0, articleCache).map((article,i) => {articlesToBeCachedId[i]= articles[i]._id.toString()});
    } else {
      articles.map((article,i) => {articlesToBeCachedId[i]= articles[i]._id.toString()});
    }
    console.log("articlesToBeCached")
    console.log(articlesToBeCachedId)

    //Searching for previously popular articles
    //super interesting method
    //Quali erano cached?
    let oldTopArticlesId = []
    let filtered = (articles.filter((article) => article.popCached == true))
    console.log("filtered: ", filtered)
    filtered.forEach((article,i) => oldTopArticlesId[i] = filtered[i]._id.toString())
    console.log("Vecchi articoli")
    console.log(oldTopArticlesId);

    //Deleting the cached folder corresponding to possible deleted articles
    //If there is a difference between the oldTopArticlesId and the folders in popularityCache, then there are deleted articles
    //Articles in the caching folder?
    const presentInCache = fs.readdirSync(`./popularityCache`)
    console.log("Already in cache")
    console.log(presentInCache)
    if(presentInCache != oldTopArticlesId){
      presentInCache.filter(x => !oldTopArticlesId.includes(x)).map((elem) => {
        console.log("eliminating: ", elem)
        fs.rm(
          `./popularityCache/${elem}`,
          { recursive: true },
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      })
    }
      
    //Management of case in which cache is not updated
    //TOBETESTED: quando ci saranno più elementi nel database
    if (articlesToBeCachedId != oldTopArticlesId) {
      //Delete nomore trendy articles
      if(articles.length >= articleCache){
        oldTopArticlesId.filter(x => !articlesToBeCachedId.includes(x)).map(async (elem) => {
          //console.log("removing from cache: ", elem)
          await Article.findByIdAndUpdate(ObjectId(elem), { popCached: false })
          fs.rm(
            `./popularityCache/${elem}`,
            { recursive: true },
            (err) => {
              if (err) {
                throw err;
              }
            }
          );
        })
      }

      //Creo le folders per i nuovi elementi cached
      articlesToBeCachedId
        .filter((elem) => !oldTopArticlesId.includes(elem))
        .map(async (article) => {
          console.log("Solo nuovi elementi")
          console.log(article)
          await Article.findByIdAndUpdate(ObjectId(article), { popCached: true })
          await Article.findByIdAndUpdate(ObjectId(article), { modified: false })
          let zipArticle = fs
            .readdirSync(`./uploads/${article}`)
            .filter((elem) => elem.endsWith(".zip"));
          // console.log(zipArticle);

          let sourceDir = `uploads/${article}/${zipArticle}`;
          let zip = new AdmZip(sourceDir);
          await zip.extractAllTo(`./popularityCache/${article}`);
        });
    }

    //Management of case of modified articles: update
    articlesToBeCachedId
        .filter((elem) => oldTopArticlesId.includes(elem) && elem.modified == true)
        .map(async (article) => {
          console.log("Solo modified elements")
          console.log(article)
          await Article.findByIdAndUpdate(ObjectId(article), { popCached: true })
          await Article.findByIdAndUpdate(ObjectId(article), { modified: false })
          let zipArticle = fs
            .readdirSync(`./uploads/${article}`)
            .filter((elem) => elem.endsWith(".zip"));
          // console.log(zipArticle);

          let sourceDir = `uploads/${article}/${zipArticle}`;
          let zip = new AdmZip(sourceDir);
          await zip.extractAllTo(`./popularityCache/${article}`);
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
  article: async function ({ id }) {
    const errors = [];
    const article = await Article.findById(id).populate("creator", "name").populate("topic","name");
    if (!article.published) {
      const error = new Error("Article not found!");
      error.code = 404;
      throw error;
    }

    //Caching the article
    //Case of hit cache positive: article already in the cache
    //Check from the popularity cache
    const popularityCache = fs.readdirSync(`./popularityCache`)
    console.log("Already in popularity cache")
    console.log(popularityCache)
    if(popularityCache.includes(id)){
      return sanitizer(article, id, "popularityCache");
    }
    //check from the time cache
    const timeCache = fs.readdirSync(`./timeCache`)
    console.log("Already in time cache")
    console.log(timeCache)
    if(timeCache.includes(id) && article.modified == false){
      await Article.findByIdAndUpdate(ObjectId(article._id), { timeCached: new Date() })
      return sanitizer(article, id, "timeCache");
    }
    //I don't need to consider the case of article present in timeCache and modified
    //because admzip overwrite the elements
    //Case of hit cache negative: article to be unzipped
    let zipArticle = fs
            .readdirSync(`./uploads/${article._id}`)
            .filter((elem) => elem.endsWith(".zip"));
          // console.log(zipArticle);

    let sourceDir = `uploads/${article._id}/${zipArticle}`;
    let zip = new AdmZip(sourceDir);
    await zip.extractAllTo(`./timeCache/${article._id}`);
    //set the time of timecache addition
    await Article.findByIdAndUpdate(ObjectId(article._id), { timeCached: new Date() })
    await Article.findByIdAndUpdate(ObjectId(article._id), { modified: false })
    return sanitizer(article, id, "timeCache");
  },
};
