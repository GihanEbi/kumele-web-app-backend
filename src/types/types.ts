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
  qr_code_url: string;
  aboutMe: string;
}

// Data needed to find or create a user
export interface GoogleUserData {
  email: string;
  firstName: string;
  lastName: string;
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

// event category
export interface EventCategory {
  id: string;
  user_id: string;
  category_id: string;
  event_name: string;
  event_image_url: string;
  subtitle: string;
  description: string;
  event_start_in: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  street_address: string;
  home_number: string;
  district: string;
  postal_zip_code: string;
  state: string;
  age_range_min: number;
  age_range_max: number;
  max_guests: number;
  payment_type: string;
  price: number;
}

// This describes the data that can be stored on the socket instance itself
export interface SocketData {
  user: {
    id: number; // Or string, depending on your user ID type
    username: string;
  };
}

export interface Message {
  id: string; // Or number
  content: string;
  sender_id: string; // Matches your req.UserID type
  event_id: string; // Or number
  created_at: string;
  // We'll add sender info dynamically
  sender?: {
    username: string;
    // any other user info you want to send
  };
}

// Interface for the data passed to the create message service
export interface CreateMessageData {
  eventId: string;
  content: string;
  userId: number;
}

// This interface describes the data the server can send to the client
export interface ServerToClientEvents {
  message_history: (messages: Message[]) => void;
  new_message: (message: Message) => void;
  error: (data: { message: string }) => void;
}

// This interface describes the data the client can send to the server
export interface ClientToServerEvents {
  join_event: (data: { eventId: string }) => void;
  send_message: (data: { eventId: string; content: string }) => void;
}

// blog
export interface Blog {
  id: string;
  event_category_id: string;
  blog_name: string;
  banner_img_url: string;
  blog_img_url: string;
  blog_video_link: string;
  youtube_link: string;
  facebook_link: string;
  instagram_link: string;
  pinterest_link: string;
  twitter_link: string;
  blog_content: string;
  author_id: string;
}

// blog comment
export interface BlogComment {
  blog_id: string;
  user_id: string;
  reply_to: string | null;
  content: string;
}

// subscription data
export interface SubscriptionData {
  icon_code: string;
  title: string;
  description: string;
  price: number;
  validity_period: string;
}

// guest tickets
export interface GuestTicket {
  icon_code: string;
  title: string;
  description: string;
  price: number;
}

// create user subscriptions
export interface CreateUserSubscription {
  user_id: string;
  subscription_id: string;
  stripe_payment_intent_id: string;
}

// create advert
export interface CreateAdvert {
  category_id: string;
  advert_image_type: string;
  advert_image_url_1: string;
  advert_image_url_2?: string;
  advert_image_url_3?: string;
  call_to_action: string;
  call_to_action_link: string;
  second_call_to_action: string;
  second_call_to_action_link: string;
  campaign_name: string;
  title: string;
  description: string;
  audience_min_age: number;
  audience_max_age: number;
  gender: "male" | "female" | "Non-binary";
  region: string;
  advert_location: string;
  language: string[];
  advert_placement: "general" | "notification" | "both";
  platform: string[];
  daily_budget_type: string;
  daily_budget: number;
  advert_duration: number;
  save_template?: boolean;
}

// notification types
export interface NotificationType {
  title: string;
  event_category_id: string;
  message: string;
  type: string;
  created_by: string;
}

// user app notification
export interface UserAppNotification {
  notification_id: string;
  user_id: string;
  status: string;
}

// product
export interface Product {
  name: string;
  description: string;
  type: string;
  price: number;
}

// user cart
export interface UserCart {
  user_id: string;
  product_id: string;
  quantity: number;
}

// user purchases history
export interface UserPurchasesHistory {
  user_id: string;
  product_id: string;
}
