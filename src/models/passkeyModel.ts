import { pool } from "../config/db";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import { isoUint8Array } from "@simplewebauthn/server/helpers";

// Your application's origin (e.g., https://yourdomain.com)
const rpID = process.env.RP_ID || "localhost";
const origin = process.env.ORIGIN || `http://${rpID}:3000`;

export async function generatePasskeyRegistrationOptions(
  userId: string,
  username: string,
  userDisplayName: string
) {
  const options = await generateRegistrationOptions({
    rpName: "Your App Name",
    rpID,
    userID: isoUint8Array.fromUTF8String(userId),
    userName: username,
    userDisplayName: userDisplayName,
    attestationType: "none", // 'direct' for stricter verification
    excludeCredentials: [], // You can exclude existing passkeys here
    authenticatorSelection: {
      residentKey: "preferred", // Creates a discoverable credential
      userVerification: "discouraged", // Prefer biometric verification
    },
  });

  return options;
}

/**
 * Verify the registration response from the client
 */
export async function verifyPasskeyRegistrationResponse(
  userID: string,
  response: any,
  expectedChallenge: string
) {
  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    // console.log(verification);

    // Ensure registrationInfo is defined
    if (!verification.registrationInfo) {
      throw new Error(
        "Registration information is missing from verification response."
      );
    }

    if (verification.registrationInfo) {
      // Store the new passkey in database
      const result = await pool.query(
        `INSERT INTO passkeys (user_id, credential_id, public_key, counter, device_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          userID,
          Buffer.from(verification.registrationInfo.credential.id).toString(
            "base64"
          ),
          Buffer.from(
            verification.registrationInfo.credential.publicKey
          ).toString("base64"),
          verification.registrationInfo.credential.counter,
          verification.registrationInfo.credentialDeviceType,
        ]
      );
    }

    console.log("///////////", verification);

    return verification.registrationInfo;
  } catch (error) {
    console.error("Error verifying registration response:", error);
  }
}
/**
 * Generate options for passkey authentication
 */
export async function generatePasskeyAuthenticationOptions() {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  });

  return options;
}

/**
 * Verify the authentication response from the client
 */
export async function verifyPasskeyAuthenticationResponse(
  response: any,
  expectedChallenge: string,
  credentialID: string,
  publicKey: string,
  counter: number
) {
  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: credentialID,
        publicKey: Buffer.from(publicKey, "base64"),
        counter,
        transports: ["internal" as AuthenticatorTransportFuture],
      },
      requireUserVerification: false,
    });
    console.log("Authentication verification result:", verification);

    return verification;
  } catch (error) {
    console.log(error);
  }
}
