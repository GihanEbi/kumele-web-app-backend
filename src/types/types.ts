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
  my_referral_code: string;
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

// change password
export interface ChangePassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

// set two factor authentication
export interface SetTwoFactorAuthentication {
  userId: string;
  isEnabled: boolean;
}

//  verify two factor authentication
export interface VerifyTwoFactorAuthentication {
  userId: string;
  otp: string;
}

// customer support request
export interface CustomerSupportRequest {
  userId: string;
  supportType: string;
  supportMessage: string;
}
// guidelines
export interface UserGuideline {
  guideline: string;
  how_to: string;
  popular: string;
}

// terms and conditions
export interface TermsAndConditions {
  terms_cond: string;
}

// delete account
export interface DeleteAccount {
  userId: string;
  password: string;
}

// create hobby
export interface CreateEventCategory {
  name: string;
  svg_code: string;
}

// user event categories
export interface UserEventCategory {
  userId: string;
  event_category_ids: string[];
}

// landing page links
export interface LandingPageLinks {
  android_app_link: string;
  ios_app_link: string;
  youtube_link: string;
  facebook_link: string;
  instagram_link: string;
  twitter_link: string;
  pinterest_link: string;
}

// landing page details
export interface LandingPageDetails {
  title: string;
  subtitle: string;
  description: string;
  bottom_text: string;
  background_image_url: string;
}
