//Index: can be used as automatic file call for exporting modules in a compact manner

module.exports = {
  User: require("./user"),
  Article: require("./article"),
  Tag: require("./tag"),
  Topic: require("./topic"),
};
