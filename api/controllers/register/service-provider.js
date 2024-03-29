module.exports = {
  friendlyName: "Service provider",

  description:
    "Action to register a person who is providing sevices for example cleaning trucks and security guards.",

  inputs: {
    first_name: {
      type: "string",
    },
    last_name: { type: "string" },
    company_name: {
      type: "string",
      required: true,
      description: "the name of the company",
    },
    phone_no: {
      type: "string",
      required: true,
      example: "0620574280",
    },
    type: {
      type: "string",
      required: true,
      description:
        "type of service provider whether is an individual or company.",
    },
    account_no: {
      type: "string",
      required: true,
      maxLength: 50,
      example: "1234899859998",
    },
    charge_amount: {
      type: "number",
      required: true,
    },
    service: {
      type: "string",
      required: true,
    },
  },

  exits: {
    failure: {
      statusCode: 400,
      description: "failed to created service provider.",
    },
    success: {
      statusCode: 201,
      description: "service privider created.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // Creating user service provider.

      // -- creating password which will be payer phone number.
      let hashedPassword = await sails.helpers.passwords.hashPassword(
        inputs.phone_no
      );

      // 👉 generating id string.
      let user_id = await sails.helpers.generateId.with({ identity: "usr" });

      // Creating user in our database
      let user = {
        id: user_id,
        first_name: inputs.first_name,
        last_name: inputs.last_name,
        username: inputs.phone_no,
        password: hashedPassword,
        role: "service_provider",
      };

      let created_user = await User.create(user).fetch();

      // -- Transforming values from frontend.
      let service;
      if (inputs.service === "security guard") service = "security_guard";

      if (inputs.service === "cleanes truck") service = "cleanes_truck";

      // -- Creating service provider object

      // 👉 first generating id.
      let provider_id = await sails.helpers.generateId.with({ identity: "pr" });

      let service_provider = {
        id: provider_id,
        company_name: inputs.company_name,
        phone_no: inputs.phone_no,
        account_no: inputs.account_no,
        charge_amount: inputs.charge_amount,
        service: service,
        type: inputs.type,
      };

      // -- Now creating that provider to our DB.
      let created_service_provider = await Service_provider.create(
        service_provider
      ).fetch();

      // -- Creating collection
      await User.addToCollection(created_user.id, "service_provider").members([
        created_service_provider.id,
      ]);

      // --response for successfull response.
      return exits.success({
        success: true,
        message: "service provider was created.",
      });
    } catch (error) {
      // --checking if unique contraint is not broken.
      if (error.code === "E_UNIQUE") {
        return exits.failure({
          success: false,
          message: "your phone  number or account number is not unique.",
        });
      }
      // --catch error
      return exits.failure({
        success: false,
        message: error.message,
      });
    }
  },
};
