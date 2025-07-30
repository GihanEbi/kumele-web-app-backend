import Joi from "joi";
import { pool } from "../config/db";
import { emailOtpSchema } from "../lib/schemas/schemas";
import { validation } from "../service/schemaValidetionService/schemaValidetionService";
import { EmailOtp } from "../types/types";
import { systemConfig } from "../config/systemConfig";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(systemConfig.emailConfig.apiKey);

export const createUpdateEmailOtp = async (otpData: EmailOtp) => {
  // check validation for email and OTP
  let checkData = validation(
    Joi.object({
      email: Joi.string().email().required().label("Email"),
    }),
    otpData
  );
  if (checkData !== null) {
    return Promise.reject(`Invalid OTP data: ${JSON.stringify(checkData)}`);
  }

  //   check if the email already exists
  const existingOtp = await pool.query(
    "SELECT * FROM email_otp WHERE email = $1",
    [otpData.email]
  );

  //   get random 4 digit otp
  let length = 4;

  var otp = "";
  var numbers = "0123456789";

  for (var i = 0; i < length; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  try {
    //   if the email already exists, update the OTP
    if (existingOtp.rows.length > 0) {
      const result = await pool.query(
        "UPDATE email_otp SET otp = $1, created_at = $2, isverified = false WHERE email = $3 RETURNING *",
        [otp, new Date(), otpData.email]
      );

      //   email send part
      try {
        const msg = {
          to: otpData.email,
          from: systemConfig.emailConfig.email_sender_domain_email,
          subject: "Email Verification from Kumele",
          text: `Hello,

      Your OTP for email verification is: ${otp}
        Please use this OTP to verify your email address.

      Best regards,
      Kumele Team`,

          html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;">
            <h2 style="text-align: center; color: #007bff;">Email Verification</h2>
            <p>Hello,</p>
            <p>Your OTP for email verification is: <strong>${otp}</strong></p>
            <p>Please use this OTP to verify your email address.</p>
          </div>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="text-align: center; font-size: 14px; color: #777;">Best regards,<br><strong>Kumele Team</strong></p>
          </div>
        </div>
        `,
        };
        await sgMail.send(msg);
        return result.rows[0];
      } catch (error) {
        console.error(`Error sending email: ${error}`);
        return Promise.reject(
          `Data added but failed to send OTP email: ${error}`
        );
      }
    } else {
      //   if the email does not exist, insert the OTP
      const result = await pool.query(
        "INSERT INTO email_otp (email, otp) VALUES ($1, $2) RETURNING *",
        [otpData.email, otp]
      );
      //   email send part
      try {
        const msg = {
          to: otpData.email,
          from: systemConfig.emailConfig.email_sender_domain_email,
          subject: "Email Verification from Kumele",
          text: `Hello,

      Your OTP for email verification is: ${otp}
        Please use this OTP to verify your email address.

      Best regards,
      Kumele Team`,

          html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;">
            <h2 style="text-align: center; color: #007bff;">Email Verification</h2>
            <p>Hello,</p>
            <p>Your OTP for email verification is: <strong>${otp}</strong></p>
            <p>Please use this OTP to verify your email address.</p>
          </div>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="text-align: center; font-size: 14px; color: #777;">Best regards,<br><strong>Kumele Team</strong></p>
          </div>
        </div>
        `,
        };
        await sgMail.send(msg);
        return result.rows[0];
      } catch (error) {
        console.error(`Error sending email: ${error}`);
        return Promise.reject(
          `Data added but failed to send OTP email: ${error}`
        );
      }
    }
  } catch (error) {
    console.error(`Error creating/updating email OTP: ${error}`);
    return Promise.reject(`Data added but failed to send OTP email: ${error}`);
  }
};

export const verifyEmailOtp = async (otpData: EmailOtp) => {
  // check validation for email and OTP
  let checkData = validation(emailOtpSchema, otpData);
  if (checkData !== null) {
    return Promise.reject(`Invalid OTP data: ${JSON.stringify(checkData)}`);
  }

  try {
    // first get the otp from the database
    const result = await pool.query(
      "SELECT * FROM email_otp WHERE email = $1",
      [otpData.email]
    );

    if (result.rows.length > 0) {
      // OTP exists, now check if it matches
      if (result.rows[0].otp === otpData.otp) {
        // check the time difference between now and the created_at time
        const createdAt = new Date(result.rows[0].created_at);
        const now = new Date();
        const timeDiff = now.getTime() - createdAt.getTime();

        console.log(`Time difference in milliseconds: ${timeDiff}`);
        console.log(`OTP lifetime in milliseconds: ${Number(systemConfig.otpLifeTime) * 60 * 1000}`);

        // if the time difference is less than the configured OTP lifetime, the OTP is valid
        if (timeDiff < Number(systemConfig.otpLifeTime) * 60 * 1000) {
          // update the isVerified field to true
          await pool.query(
            "UPDATE email_otp SET isVerified = true WHERE email = $1",
            [otpData.email]
          );
          return { message: "OTP verified successfully" };
        } else {
          return Promise.reject("OTP has expired");
        }
      } else {
        return Promise.reject("Invalid OTP");
      }
    } else {
      return Promise.reject("Email not found");
    }
  } catch (error) {
    console.error(`Error verifying email OTP: ${error}`);
    throw new Error("Internal Server Error");
  }
};
