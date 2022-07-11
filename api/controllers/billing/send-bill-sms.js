module.exports = {
  friendlyName: "Send bill sms",

  description:
    "Automated action that will responsible for sending bills to all payers.",

  fn: async function (inputs) {
    try {
      console.log("sending sms.....");

      let message =
        "your bill is 3000 tzs amount, and your control number is 98764953, nb: please pay it." +
        new Date().toString();

      await sails.helpers.sendSms.with({
        message: message,
        number: sails.config.custom.toNumber,
      });

      return;
    } catch (error) {
      console.log(error.message);
      return;
    }
  },
};
