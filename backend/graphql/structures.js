const fs = require("fs")
const createDomPurify = require("dompurify");
const marked = require("marked");
const { JSDOM } = require("jsdom");
const { ProvidedRequiredArgumentsOnDirectivesRule } = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");
const { Z_VERSION_ERROR } = require("zlib");
const dompurify = createDomPurify(new JSDOM().window);

const { Article } = require("../models");
const { ObjectId } = require('mongodb');

const sanitizer = async (article, id, type) =>{
    let dirSource = ''
    let file = {}
    let fileContent = {}
    let sanitizedHtml = {}
    if(type == "popularityCache") dirSource= `./popularityCache/${id}`;
    else if(type == "timeCache") dirSource= `./timeCache/${id}`
    else throw error;
    file = fs.readdirSync(dirSource).filter((elem) => elem.endsWith('.md'));
    fileContent = fs.readFileSync(`${dirSource}/${file}`, 'utf-8');
    sanitizedHtml = dompurify.sanitize(marked.parse(fileContent))
    sanitizedHtml = sanitizedHtml.replace(/src="/g, `src="${dirSource}/`)
    
    return {
        ...article._doc,
        sanitizedHtml: sanitizedHtml,
        topic: article.topic.name,
        creator: article.creator.name,
        createdAt: article.createdAt.toISOString(),
    }

}


module.exports = {sanitizer}
// sanitizedHtml = dompurify.sanitize(marked.parse(file.toString("utf8")))
// console.log(sanitizedHtml)