module.exports = {
  friendlyName: "Taka quest",

  description: "Action that will be handling quests.",

  inputs: {
    // none
  },

  exits: {
    failure: {
      statusCode: 400,
      description: "failed request.",
    },
    success: {
      statusCode: 200,
      description: "successfull response.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // Build our SQL query template.
      var SQL_QUERY = `
      SELECT street_id, count(street_id) 
      FROM request 
      WHERE AGE(NOW(), created_at::timestamp) < '8 days' 
      GROUP BY street_id;`;

      // Send it to the database.
      var rawResult = await sails.sendNativeQuery(SQL_QUERY);

      // console.log(rawResult);
      let array = [];

      for (let data of rawResult.rows) {
        let location = await Location.findOne({
          where: { id: data.street_id },
        });

        let request = {
          id: location.id,
          street: location.street,
          count: data.count,
        };

        array.push(request);
      }

      return exits.success({
        success: false,
        message: "successfull response",
        data: {
          requests: array,
        },
      });
    } catch (error) {
      // 🆘 catching any other error
      return exits.failure({
        success: false,
        message: error.message,
      });
    }
  },
};
