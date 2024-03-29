/**
 * Bill.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: "id",
  attributes: {
    id: {
      type: "string",
      required: true,
    },
    payer_id: {
      model: "payer",
      description: "id that will be referencing the user.",
    },
    amount: {
      type: "number",
      required: true,
      description: "amount that he/she is required to pay.",
    },
    paid_amount: {
      type: "number",
      defaultsTo: 0,
      description: "the amount which the person paid on bill.",
    },
    status: {
      type: "string",
      isIn: ["paid", "unpaid"],
      defaultsTo: "unpaid",
    },
  },
};
