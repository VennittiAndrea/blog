const bcrypt = require('bcrypt');

//solo l'admin può modificare i ruoli degli utenti
const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin';

const elementAction= {
    edit: { isAccessible: canModifyUsers },
    delete: { isAccessible: canModifyUsers },
    new: {
        isAccessible: canModifyUsers,
        before: async (request) => {
            if(request.payload.password) {
            request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
            }
            }
            return request;
        },
        after: async(response) => {
            if(response.record && response.record.errors){
                response.record.errors.password= response.record.errors.encryptedPassword;
            }
            return response;
        },
    },
}

module.exports = elementAction;