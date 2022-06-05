module.exports = {
  friendlyName: "Send bill sms",

  description:
    "Automated action that will responsible for sending bills to all payers.",

  fn: async function (inputs) {
    try {
      console.log("sending sms.....");
      await sails.helpers.sendSms();

      return;
    } catch (error) {
      console.log(error.message);
      return;
    }
  },
};
