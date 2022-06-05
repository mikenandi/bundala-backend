module.exports = {
  friendlyName: "Region",

  description: "Region search.",

  inputs: {
    query: {
      type: "string",
    },
  },

  exits: {
    success: {
      statusCode: 200,
      description: "success search region",
    },
    failure: {
      statusCode: 400,
      description: "failed search region",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // 💬 checking for various probabilities.
      let search_result = await Location.find({
        where: {
          or: [
            { region: { startsWith: inputs.query } },
            {
              district: { startsWith: inputs.query },
            },
            {
              ward: { startsWith: inputs.query },
            },
            {
              street: { startsWith: inputs.query },
            },
          ],
        },
      });

      return exits.success({
        succes: true,
        message: "successfull query",
        data: search_result,
      });
    } catch (error) {
      // catching any other error
      return exits.failure({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
  },
};
