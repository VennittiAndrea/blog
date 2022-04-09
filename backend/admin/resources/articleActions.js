const {
  after: articleAfterHook,
  before: articleBeforeHook,
} = require('./article.hook');

//Restricted access: RBAC function
const canEditArticles = ({ currentAdmin, record }) => {
    //praticamente la condizione qui sotto è che posso gestire se: 
    //- sono admin
    //- ho creato io quel elemento
    return currentAdmin && (
      currentAdmin.role === 'admin'
      || currentAdmin._id === record.param('ownerId')
    )
  }

const elementAction = { 
  edit: { isAccessible: canEditArticles },
  delete: { isAccessible: canEditArticles },
  new: {
    before: async (request, context) => {
      return await articleBeforeHook(request, context);
    },
    after: async (response, request, context) => {
      return await articleAfterHook(response, request, context);
    }
  }
}

module.exports= elementAction ;