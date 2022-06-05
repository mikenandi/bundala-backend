// --Module imports.
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

module.exports = {
  friendlyName: "Signup",

  description: "Signup action.",

  inputs: {
    first_name: {
      type: "string",
      example: "michael",
    },
    last_name: {
      type: "string",
      example: "nandi",
    },
    email: {
      type: "string",
      required: true,
      isEmail: true,
      example: "mikejohn@gmail.com",
    },
    password: { type: "string" },
  },

  exits: {
    success: {
      statusCode: 201,
      description: "the user was created",
    },
    failure: {
      statusCode: 400,
      description: "the user was not created",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // --hashing password.
      let hashedPassword = await sails.helpers.passwords.hashPassword(
        inputs.password
      );

      // --generating id.
      let id = await sails.helpers.generateId.with({ identity: "usr" });

      // --creating variable user.
      let user = {
        id: id,
        first_name: inputs.first_name,
        last_name: inputs.last_name,
        username: inputs.email,
        email: inputs.email,
        password: hashedPassword,
        role: "admin",
      };

      let created_user = await User.create(user).fetch();

      // --getting private key.
      const pathToKey = path.resolve("secrets/priv_key.pem");
      const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

      // --creating payload.
      let payload = {
        sub: created_user.id,
        iat: Date.now(),
      };

      // --signing token.
      let signToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: "1d",
        algorithm: "RS256",
      });

      // --creating token with bearer word.
      let authToken = {
        token: "Bearer " + signToken,
      };

      // --response when user was successfull created.
      return exits.success({
        success: true,
        message: "new user was created",
        data: {
          user_id: created_user.id,
          role: created_user.role,
          token: authToken,
        },
      });
    } catch (error) {
      // --when there is a person with that email already created.
      if (error.code === "E_UNIQUE") {
        return exits.failure({
          success: false,
          message: "Email already exists",
        });
      }
      // 👌 catching any other error.
      return exits.failure({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
  },
};
