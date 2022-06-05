module.exports = {
  friendlyName: "Create bill",

  description: "action that will be running automaticall every month.",

  fn: async function () {
    try {
      // --Getting payer records.
      let payer_record = await Payer.find({ select: ["id", "type"] });

      // --creating the bill
      payer_record.forEach(async (record) => {
        // Covering different cases.

        // CASE 1: normal-house

        if (record.type === "normal-house") {
          // --Creating new bill
          let id = await sails.helpers.generateId.with({ identity: "bl" });
          let bill_created = await Bill.create({
            id: id,
            amount: 3000,
          }).fetch();

          // --Adding foreign key.
          await Payer.addToCollection(record.id, "bill").members([
            bill_created.id,
          ]);
        }

        // CASE 2: house-with-tenant
        if (record.type === "house-with-tenant") {
          // --Creating new bill
          let id = await sails.helpers.generateId.with({ identity: "bl" });
          let bill_created = await Bill.create({
            id: id,
            amount: 5000,
          }).fetch();

          // --Adding foreign key.
          await Payer.addToCollection(record.id, "bill").members([
            bill_created.id,
          ]);
        }

        // CASE 3: small-bussiness
        if (record.type === "small-bussiness") {
          // --Creating new bill
          let id = await sails.helpers.generateId.with({ identity: "bl" });
          let bill_created = await Bill.create({
            id: id,
            amount: 1500,
          }).fetch();

          // --Adding foreign key.
          await Payer.addToCollection(record.id, "bill").members([
            bill_created.id,
          ]);
        }

        // CASE 4: hotel
        if (record.type === "hotel") {
          // -- Creating new bill
          let id = await sails.helpers.generateId.with({ identity: "bl" });
          let bill_created = await Bill.create({
            id: id,
            amount: 20000,
          }).fetch();

          // --Adding foreign key.
          await Payer.addToCollection(record.id, "bill").members([
            bill_created.id,
          ]);
        }

        return;
      });
    } catch (error) {
      console.log(error.message);
      return;
    }
  },
};
