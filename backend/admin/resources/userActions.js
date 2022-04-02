const bcrypt = require("bcrypt");
const validator = require("validator");
const { ValidationError } = require("adminjs");

//solo l'admin può modificare i ruoli degli utenti
const canModifyUsers = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

const elementAction = {
  edit: { isAccessible: canModifyUsers },
  delete: { isAccessible: canModifyUsers },
  new: {
    isAccessible: canModifyUsers,
    before: async (request) => {
      if (!validator.isEmail(request.payload.email)) {
        throw new ValidationError({
            email: {
              message: 'E-Mail is invalid.',
            },
          }, {
            message: 'something wrong happened',
          });
      }
      if (
        validator.isEmpty(request.payload.password) ||
        !validator.isLength(request.payload.password, { min: 5 })
      ) {
        throw new ValidationError({
            password: {
              message: 'Password is invalid. At least 5 characters are required.',
            },
          }, {
            message: 'something wrong happened',
          });
      }
      if (request.payload.password) {
        request.payload = {
          ...request.payload,
          encryptedPassword: await bcrypt.hash(request.payload.password, 10),
          password: undefined,
        };
      }
      return request;
    },
    after: async (response) => {
      if (response.record && response.record.errors) {
        response.record.errors.password =
          response.record.errors.encryptedPassword;
      }
      return response;
    },
  },
};

module.exports = elementAction;
