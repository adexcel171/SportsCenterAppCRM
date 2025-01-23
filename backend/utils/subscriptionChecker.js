import cron from "node-cron";
import UserData from "../models/userdataModel.js";
import { sendSubscriptionReminder, sendSMSReminder } from "./emailService.js";

export const startSubscriptionChecker = () => {
  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const users = await UserData.find({});

      for (const user of users) {
        if (
          user.isSubscriptionExpiringSoon() &&
          (!user.lastReminderSent ||
            new Date() - user.lastReminderSent > 24 * 60 * 60 * 1000)
        ) {
          // Send email reminder
          await sendSubscriptionReminder(
            user.email,
            user.name,
            user.subscriptionEndDate
          );

          // Send SMS reminder
          const message = `Hello ${
            user.name
          }, your subscription will expire on ${new Date(
            user.subscriptionEndDate
          ).toLocaleDateString()}. Please renew soon.`;
          await sendSMSReminder(user.number, message);

          // Update last reminder sent date
          user.lastReminderSent = new Date();
          await user.save();
        }
      }
    } catch (error) {
      console.error("Error checking subscriptions:", error);
    }
  });
};
