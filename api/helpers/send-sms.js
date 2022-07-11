const accountSid = sails.config.custom.accountSid;
const authToken = sails.config.custom.authToken;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  friendlyName: "Send sms",

  description: "A helper function to send sms to a fixed number.",

  inputs: {
    message: {
      type: "string",
      required: true,
      description: "message that needs to be sent to the user.",
    },
    number: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    let message = await client.messages.create({
      body: inputs.message,
      from: sails.config.custom.fromNumber,
      to: sails.config.custom.toNumber,
    });

    console.log(message);

    return exits.success();
  },
};
