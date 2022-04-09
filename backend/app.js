const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
//required for admin page: adminJS

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
//const auth = require('./middleware/auth');
//Devo mettere la parte per gestire le immagini che passo -> Devo vedere nel frontend come lo richiama
//const { clearImage } = require('./util/file');
//Required for admin page
const {adminJS, router} = require('./admin');


const app = express();

/*
IMAGES
//Questa parte è utile per memorizzare l'immagine
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
*/

app.use(bodyParser.json()); // application/json
/*
IMAGES
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
//se becco un file (req.file), multer entra automaticamente in azione e in questo caso il tipo di file è image
app.use('/images', express.static(path.join(__dirname, 'images')));
*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//app.use(auth);

/*
IMAGE
//devo aggiungere a mano, ciò che non posso gestire tramite graphql
//invece ciò che posso gestire con graphql, prende automaticamente i valori
//del fetch
app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated!');
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.path });
});
//Devo mettere anche util per eliminare l'immagine quando non mi serve
*/

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

app.use('/uploads', express.static('uploads'));

app.use(adminJS.options.rootPath, router);
//app.use(adminJS.options.loginPath, router);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb://localhost:27017/PersonalSite', { useNewUrlParser: true, useUnifiedTopology: true, }
  )
  .then(result => {
    app.listen(8080, () => console.log(`Example app listening on port 8080!`));
  })
  .catch(err => console.log(err));



