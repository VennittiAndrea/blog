
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
      console.log(context)
      console.log(request)
      if (request.method === "post") {
        //insert the currentAdmin
        request.payload = {
          ...request.payload,
          ownerId: context.currentAdmin._id,
        };
        return request;
      }
      return request;
    },
  }
}

module.exports= elementAction ;