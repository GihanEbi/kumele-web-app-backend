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
  profilepicture: string;
  aboutMe: string;
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

// hobby
export interface Hobby {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

// user settings
export interface UserNotificationSettings {
  userId: string;
  notificationSoundEnabled: boolean;
  emailNotificationsEnabled: boolean;
}
