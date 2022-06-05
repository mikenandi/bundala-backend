module.exports = {
  friendlyName: "Unpaid bills query",

  description: "showing list of people who have not paid their bills.",

  inputs: {
    // no inputs just query.
  },

  exits: {
    failure: {
      statusCode: 400,
      description: "failed query.",
    },
    success: {
      statusCode: 200,
      description: "successfull query",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // Build our SQL query template.
      let SQL_QUERY = `
      SELECT payer_id, SUM(amount) 
      FROM bill 
      WHERE status = 'unpaid'
      GROUP BY payer_id 
      HAVING SUM(amount) > 0;`;

      // Send it to the database.
      let rawResult = await sails.sendNativeQuery(SQL_QUERY);

      // creating array that will be used to store data.
      let result_array = [];

      for (let data of rawResult.rows) {
        // finding payer record from each data found.
        let payer_record = await Payer.findOne({
          where: { id: data.payer_id },
          select: ["house_no", "type", "user_id", "location_id"],
        });

        // finding street record from each data found.
        let street_record = await Location.findOne({
          where: { id: payer_record.location_id },
          select: ["street", "ward"],
        });

        // finding user record for each data found.
        let user_record = await User.findOne({
          where: { id: payer_record.user_id },
          select: ["first_name", "last_name"],
        });

        // forming data according to our requirement.
        let compose_object = {
          id: user_record.id,
          first_name: user_record.first_name,
          last_name: user_record.last_name,
          street: street_record.street,
          amount: data.sum,
          ward: street_record.ward,
        };

        // adding element to our array.
        result_array.push(compose_object);
      }

      // response for successfull response.
      return exits.success({
        sucess: true,
        message: "successfull query.",
        data: {
          results: result_array,
        },
      });
    } catch (error) {
      // catching any other errors.
      return exits.failure({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
  },
};
