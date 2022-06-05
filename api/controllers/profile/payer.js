module.exports = {
  friendlyName: "Payer",

  description: "Payer profile.",

  inputs: {
    user_id: {
      type: "string",
      description: "id from front-end",
    },
  },

  exits: {
    failure: {
      statusCode: 400,
      description: "failed query.",
    },
    success: {
      statusCode: 200,
      description: "successfull query.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // ⏳ finding the record.
      let payer_record = await User.findOne({
        where: { id: inputs.user_id },
      }).populate("payer");

      let location_record = await Location.findOne({
        where: { id: payer_record.payer[0].location_id },
      });

      // 🎇 successfull response return.
      return exits.success({
        success: true,
        message: "successfull query.",
        data: {
          first_name: payer_record.first_name,
          last_name: payer_record.last_name,
          username: payer_record.username,
          phone_no: payer_record.payer[0].phone_no,
          control_number: payer_record.payer[0].control_number,
          city: location_record.region,
          district: location_record.district,
          ward: location_record.ward,
          street: location_record.street,
        },
      });
    } catch (error) {
      // 🆘 catching any error

      return exits.failure({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
  },
};
