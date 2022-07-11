/******************************************************************
 *  TASK SCHEDULER.
 *  @documentation https://github.com/ghaiklor/sails-hook-cron
 * -----------------------------------------------------------------
 */

// Importing actions modules from cotrollers.
const create_bill = require("../api/controllers/billing/create-bill");
const send_bill_sms = require("../api/controllers/billing/send-bill-sms");
const make_payment = require("../api/controllers/payment/make-payment");

module.exports.cron = {
  create_bill_every_month: {
    // Bill will be created one day before sending bill sms.
    schedule: "00 39 04 * * *", // Time setting
    onTick: function () {
      create_bill.fn();
    },
    start: true,
  },
  send_bill_sms_every_month: {
    schedule: "00 43 12 * * *", // Time setting sms will be sent on 08:00 am.
    onTick: function () {
      send_bill_sms.fn();
    },
    start: true,
  },
  make_payment_every_month: {
    schedule: "00 48 12 * * *", // Time setting --> will be running on 25th of every month
    onTick: function () {
      make_payment.fn();
    },
    start: true,
  },
};
