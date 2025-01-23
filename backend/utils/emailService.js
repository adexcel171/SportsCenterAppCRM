import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or your email provider's SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Only use this in development
  },
});

export const sendSubscriptionReminder = async (
  userEmail,
  name,
  subscriptionEndDate
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Subscription Reminder",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Hello ${name},</h2>
          <p>This is a friendly reminder that your subscription will expire on 
             <strong>${new Date(
               subscriptionEndDate
             ).toLocaleDateString()}</strong>.</p>
          <p>To ensure uninterrupted service, please renew your subscription before the expiration date.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>${process.env.COMPANY_NAME || "Your Company"}</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendSMSReminder = async (phoneNumber, message) => {
  // Implement SMS service integration here (e.g., Twilio)
  // You'll need to sign up for an SMS service provider
};
