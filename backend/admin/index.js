/**
 * @summary Creation of Administration section
 * @description Folder related to the administration options.
 * With content creation, user management and RBAC (Role-Base Access Control)
 * @author Andrea Vennitti
 *
 * @package AdminJS: automatic administration
 * @package AdminJS/express: connection of adminJS to Express
 * @package bcrypt: password encryption
 *
 * @param [ User, Article, Tag, Topic ] models of mongoose collections
 * @param [ userResource, userActions, articleResource, articleActions, tagResource, topicResource ]
 * options of AdminJS: customization
 *
 */

const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const bcrypt = require("bcrypt");
const uploadFeature = require("@adminjs/upload");

const { User, Article, Tag, Topic } = require("../models");
const {
  userResource,
  userActions,
  articleResource,
  articleActions,
  tagResource,
  topicResource,
} = require("./resources");
//const authenticate = require('./util');

// We have to tell AdminJS that we will manage mongoose resources with it
AdminJS.registerAdapter(require("@adminjs/mongoose"));

const sidebarGroups = {
  user: {
    name: "User Management",
    icon: "User",
  },
  article: {
    name: "Article Management",
    icon: "Product",
  },
};

//Typical structure of the AdminJS object.
/**
 * @param resource Mongoose model: collection
 * @param options properties (data to be shown and how), parent (structure of the UI),
 * actions (before, RBAC, after) (creation, deletion, modification)
 * Other options can be added:
 * head: for inserting links and SEO
 * render: html directives for an element
 * Modification of the possible properties:
 * A react component can be added
 */
//Example of react component:
// uploadImage: {
//   components: {
//     edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
//     list: AdminBro.bundle('./components/upload-image.list.tsx'),
//   },
// }
const adminJS = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        properties: userResource,
        parent: sidebarGroups.user,
        actions: userActions,
      },
    },
    {
      resource: Article,
      options: {
        properties: articleResource,
        parent: sidebarGroups.article,
        actions: articleActions,
      },
      features: [
        uploadFeature({
          provider: { local: { bucket: "public" } },
          multiple: true,
          properties: {
            file: "images.file",
            filePath: "images.path",
            filename: "images.filename",
            filesToDelete: "images.toDelete",
            key: "images.key",
            mimeType: "images.mimeType",
            bucket: "images.bucket",
          },
          validation: {
            mimeType: ["image/png", "image/jpg"],
          },
        }),
      ],
    },
    {
      resource: Tag,
      options: {
        parent: sidebarGroups.article,
      },
    },
    {
      resource: Topic,
      options: {
        parent: sidebarGroups.article,
      },
    },
  ],
  rootPath: "/admin",
  dashboard: {
    handler: async () => {
      return { some: "output" };
    },
    component: AdminJS.bundle("./components/dashboard"),
  },
  branding: {
    companyName: "Administration",
    softwareBrothers: false,
    logo: "https://images-platform.99static.com//lPRxXpwQRJ8TILncLSFWBoE6b34=/295x281:1680x1667/fit-in/500x500/99designs-contests-attachments/108/108066/attachment_108066965",
  },
});

//creation of the admin component middleware
const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJS,
  {
    //ATTENTO: qui devi metterla come variabile ENV
    //authenticate,
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: `${process.env.cookiePassword}`,
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

module.exports = { adminJS, router };
