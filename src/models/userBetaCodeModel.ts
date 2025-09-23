import { pool } from "../config/db";
import { systemConfig } from "../config/systemConfig";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(systemConfig.emailConfig.apiKey);

export const createUserBetaCodeModel = async (email: string) => {
  // check if email already exists with is_used = true
  const emailCheckQuery = `
    SELECT * FROM user_beta_codes WHERE email = $1 AND is_used = true
  `;
  const emailCheckValues = [email];
  const emailCheckResult = await pool.query(emailCheckQuery, emailCheckValues);
  if (emailCheckResult.rows.length > 0) {
    throw new Error("Email already used");
  }

  //   generate a random 5 character beta code
  let length = 5;
  let betaCode = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    betaCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  console.log("Generated Beta Code:", betaCode);
  

  const query = `
    INSERT INTO user_beta_codes (email, beta_code) VALUES ($1, $2)
  `;
  const values = [email, betaCode];
  await pool.query(query, values);

  //   email send part
  try {
    const msg = {
      to: email,
      from: systemConfig.emailConfig.email_sender_domain_email,
      subject: "Beta Code from Kumele",
      text: `Hello,

        Your Beta Code is: ${betaCode}
          Please use this Beta Code to register.

        Best regards,
        Kumele Team`,

      html: `
          <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto;">
              <h2 style="text-align: center; color: #007bff;">Beta Code Verification</h2>
              <p>Hello,</p>
              <p>Your Beta Code is: <strong>${betaCode}</strong></p>
              <p>Please use this Beta Code to register.</p>
            </div>
              <hr style="border: none; border-top: 1px solid #ddd;">
              <p style="text-align: center; font-size: 14px; color: #777;">Best regards,<br><strong>Kumele Team</strong></p>
            </div>
          </div>
          `,
    };
    await sgMail.send(msg);
    return;
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return Promise.reject(
      `Data added but failed to send Beta Code email: ${error}`
    );
  }
};
