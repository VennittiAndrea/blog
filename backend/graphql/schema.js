const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type ArticleData {
        title: String!
        creator: String!
        slug: String!
        tag: String!
        topic: String!
        published: Boolean!
        sanitizedHtml: String!
        createdAt: String!
    }

    type ArticlesInfo {
        title: String!
        abstract: String!
        creator: String!
        createdAt: String!
        readingTime: String!
    }

    type ArticlesData {
        articles: [ArticlesInfo!]!
        totalArticles: Int!
    }

    type RootQuery {
        articles: ArticlesData!
        article(id: ID!): ArticleData!
    }

    schema {
        query: RootQuery
    }
`);
