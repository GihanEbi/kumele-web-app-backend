import { pool } from "../config/db";
import { Request, Response, NextFunction } from "express";
import {
  generatePasskeyAuthenticationOptions,
  generatePasskeyRegistrationOptions,
  verifyPasskeyAuthenticationResponse,
  verifyPasskeyRegistrationResponse,
} from "../models/passkeyModel";
import { generateToken } from "../service/authService/authService";

// Store challenges temporarily (use Redis in production)
const registrationChallenges = new Map<string, string>();
const authenticationChallenges = new Map<string, string>();
/**
 * Start passkey registration process
 */
export const startPasskeyRegistration = async (req: Request, res: Response) => {
  try {
    const user_id = req.UserID;
    const username = req.username;

    if (typeof user_id !== "string" || typeof username !== "string") {
      return res.status(400).json({ error: "Invalid user ID or username" });
    }

    // Generate registration options
    const options = await generatePasskeyRegistrationOptions(
      user_id,
      username,
      username
    );

    // Store the challenge for this user session
    registrationChallenges.set((req as any).sessionID, options.challenge);

    res.status(201).json({
      success: true,
      message: "Passkey created successfully",
      data: options,
    });
  } catch (error) {
    console.error("Start registration error:", error);
    res.status(500).json({ error: "Failed to start passkey registration" });
  }
};

/**
 * Finish passkey registration process
 */
export const finishPasskeyRegistration = async (
  req: Request,
  res: Response
) => {
  try {
    const user_id = req.UserID;
    const username = req.username;

    if (typeof user_id !== "string" || typeof username !== "string") {
      return res.status(400).json({ error: "Invalid user ID or username" });
    }

    const { attestationResponse } = req.body;

    // Retrieve the expected challenge for this session
    const expectedChallenge = registrationChallenges.get(
      (req as any).sessionID
    );
    
    if (!expectedChallenge) {
      return res.status(400).json({ error: "No registration session found" });
    }

    // Verify the registration response
    const verification = await verifyPasskeyRegistrationResponse(
      user_id,
      attestationResponse,
      expectedChallenge
    );

    console.log(verification);
    

    // Clean up the challenge
    registrationChallenges.delete((req as any).sessionID);
    if (!verification) {
      return res
        .status(400)
        .json({ error: "Registration verification failed" });
    }
    res.status(201).json({
      success: true,
      message: "Passkey registered successfully",
    });
  } catch (error) {
    console.error("Finish registration error:", error);
    res.status(500).json({ error: "Failed to complete passkey registration" });
  }
};

/**
 * Start passkey authentication process
 */
export const startPasskeyAuthentication = async (
  req: Request,
  res: Response
) => {
  try {
    const options = await generatePasskeyAuthenticationOptions();

    // Store the challenge for this session
    authenticationChallenges.set((req as any).sessionID, options.challenge);

    res.status(201).json({
      success: true,
      message: "Passkey authentication started successfully",
      data: options,
    });
  } catch (error) {
    console.error("Start authentication error:", error);
    res.status(500).json({ error: "Failed to start passkey authentication" });
  }
};

/**
 * Finish passkey authentication process
 */
export const finishPasskeyAuthentication = async (
  req: Request,
  res: Response
) => {
  function base64urlToBase64(base64url: string): string {
    // Replace URL-safe chars
    let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    // Pad with =
    while (base64.length % 4) {
      base64 += "=";
    }
    return base64;
  }
  try {
    const { authenticationResponse } = req.body;

    // Retrieve the expected challenge
    const expectedChallenge = authenticationChallenges.get(
      (req as any).sessionID
    );
    if (!expectedChallenge) {
      return res.status(400).json({ error: "No authentication session found" });
    }

    const credentialID = Buffer.from(
      authenticationResponse.rawId,
      "utf8"
    ).toString("base64");

    // Find the passkey in database
    const passkeyResult = await pool.query(
      `SELECT * FROM passkeys WHERE credential_id = $1`,
      [credentialID]
    );

    if (passkeyResult.rows.length === 0) {
      return res.status(400).json({ error: "Passkey not found" });
    }
    const passkey = passkeyResult.rows[0];

    // Verify the authentication response
    const verification = await verifyPasskeyAuthenticationResponse(
      authenticationResponse,
      expectedChallenge,
      passkey.credential_id,
      passkey.public_key,
      passkey.counter
    );

    if (!verification || !verification.verified) {
      return res
        .status(400)
        .json({ error: "Authentication verification failed" });
    }

    // Update the counter and last used timestamp

    await pool.query(
      `UPDATE passkeys SET counter = $1, last_used = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [verification.authenticationInfo.newCounter, passkey.id]
    );

    // Clean up the challenge
    authenticationChallenges.delete((req as any).sessionID);

    // get the user associated with the passkey
    const userResult = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [passkey.user_id]
    );
    const user = userResult.rows[0];

    const token = generateToken(user.id, user.username);
    // remove user password field in result
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "Passkey authenticated successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Finish authentication error:", error);
    res
      .status(500)
      .json({ error: "Failed to complete passkey authentication" });
  }
};
