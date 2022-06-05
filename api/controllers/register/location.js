module.exports = {
  friendlyName: "Location Register.",

  description: "Action that will enable user to register location.",

  inputs: {
    region: {
      type: "string",
      required: true,
      example: "Dar es salaam",
    },
    district: {
      type: "string",
      required: true,
      example: "Kinondoni",
    },
    ward: {
      type: "string",
      requried: true,
      example: "Sinza",
    },
    street: {
      type: "string",
      required: true,
      example: "Sinza A",
    },
  },

  exits: {
    failure: {
      statusCode: 400,
      description: "location creation failed.",
    },
    success: {
      statusCode: 201,
      description: "location was created.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // -- making the street code.
      let random_five = () => {
        let random_number = Math.floor(Math.random() * 9000 + 1000); // 🤚 function to generate number between 0 and 10000
        let output = String(random_number).padStart(5, "0"); // 👋 function to add zero so as our output will have five digits.

        return output;
      };

      let short_region = inputs.region.substring(0, 3).toUpperCase();

      let generated_street_code = short_region + "_" + random_five();

      // -- generating id.
      let id = await sails.helpers.generateId.with({ identity: "loc" });
      // -- creating location object.
      let location = {
        id: id,
        region: inputs.region,
        district: inputs.district,
        ward: inputs.ward,
        street: inputs.street,
        street_code: generated_street_code,
      };

      // -- creating street in database.
      await Location.create(location);

      // -- response for successful response.
      return exits.success({
        success: true,
        message: "location been registered.",
      });
    } catch (error) {
      if (error.code === "E_UNIQUE") {
        // -- if there is that  error means that location street has
        // -- already been registered.
        console.log(error.message);
        return exits.failure({
          success: false,
          message: "street has already registered.",
        });
      }

      // -- Catching any other error.
      return exits.failure({
        success: false,
        message: error.message,
      });
    }
  },
};
