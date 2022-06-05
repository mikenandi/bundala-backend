module.exports = {
  friendlyName: "Profile",

  description: "Profile admin action.",

  inputs: {
    user_id: {
      type: "string",
      required: true,
      description: "user id which will help to fetch his/her details.",
    },
  },

  exits: {
    failure: {
      statusCode: 400,
      description: "failed request",
    },
    success: {
      statusCode: 200,
      description: "success get profile",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // getting records from the database.
      let user_record = await User.findOne({
        where: { id: inputs.user_id },
        select: ["email", "first_name", "last_name", "username"],
      });

      // successfull response.
      return exits.success({
        success: true,
        message: "successfull response",
        data: {
          first_name: user_record.first_name,
          last_name: user_record.last_name,
          email: user_record.email,
          username: user_record.username,
        },
      });
    } catch (error) {
      // Catching any other error
      return exits.failure({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
  },
};
