const fs = require("fs")

const { Article } = require("../models");

const cacheUpdate = async () => {
  var files = fs.readdirSync('./timeCache')
  const numCache = 10;
  const content =  await Article.find({ _id: { $in: files } }, {_id: 1, timeCached: 1}).sort({ timeCached: -1 });
  console.log("content: ",content)
  contentReduced = content.splice(numCache, );
  console.log("reduced: ", contentReduced)
  //Now it's time to remove the final elements (unwanted)
  contentReduced.forEach((elem) => {
      fs.rm(
          `./timeCache/${elem._id}`,
          { recursive: true },
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
  })
}  
module.exports = {cacheUpdate}