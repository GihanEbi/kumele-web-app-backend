export interface User {
  ID: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
  language: string;
  dateOfBirth: string;
  referralCode: string;
  aboveLegalAge: boolean;
  termsAndConditionsAccepted: boolean;
  subscribedToNewsletter: boolean;
}

export interface IdGenerator {
  code: string;
  seq: number;
}

// email otp
export interface EmailOtp {
  email: string;
  otp: string;
}
