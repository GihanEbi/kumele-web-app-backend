// schema for user registration
import Joi from "joi";
import { UserConstants } from "../../constants/userConstants";
import { CustomerSupportConstants } from "../../constants/customerSupportConstants";
import { EventConstants } from "../../constants/eventConstants";

export const userRegistrationSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().label("Name"),
  email: Joi.string()
    .required()
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .label("Email")
    .messages({ "string.pattern.base": "Invalid Email" }),
  password: Joi.string().min(6).max(100).required().label("Password"),
  gender: Joi.string()
    .valid(...Object.values(UserConstants.gender))
    .required()
    .label("Gender"),
  language: Joi.string()
    .valid(...Object.values(UserConstants.language))
    .required()
    .label("Language"),
  dateOfBirth: Joi.date().less("now").required().label("Date of Birth"),
  referralCode: Joi.string().optional().empty("").label("Referral Code"),
  aboveLegalAge: Joi.boolean().required().label("Above Legal Age"),
  termsAndConditionsAccepted: Joi.boolean()
    .required()
    .label("Terms and Conditions Accepted"),
  subscribedToNewsletter: Joi.boolean()
    .required()
    .label("Subscribed to Newsletter"),
});

// email otp schema
export const emailOtpSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  otp: Joi.string().length(4).required().label("OTP"),
});

// login schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

// permission schema
export const permissionSchema = Joi.object({
  allow_notifications: Joi.boolean().required().label("Allow Notifications"),
  allow_photos: Joi.string()
    .valid(...Object.values(UserConstants.allowPhotosPermission))
    .required()
    .label("Allow Photos Permission"),
  allow_location: Joi.string()
    .valid(...Object.values(UserConstants.allowLocationPermission))
    .required()
    .label("Allow Location Permission"),
});

// update user name schema
export const updateUserNameSchema = Joi.object({
  action: Joi.string()
    .valid(...Object.values(UserConstants.setUserNameAction))
    .required()
    .label("Action to Set User Name"),
  // if action is 'save', username is required, if action is 'skip', username is not required
  username: Joi.string().when("action", {
    is: UserConstants.setUserNameAction.SAVE,
    then: Joi.string().min(3).max(50).required().label("Username"),
    otherwise: Joi.string().optional().empty("").label("Username"),
  }),
});

// change password schema
export const changePasswordSchema = Joi.object({
  userId: Joi.string().required().label("User ID"),
  oldPassword: Joi.string().min(6).max(100).required().label("Old Password"),
  newPassword: Joi.string().min(6).max(100).required().label("New Password"),
});

// set up 2FA schema
export const twoFactorAuthSetupSchema = Joi.object({
  userId: Joi.string().required().label("User ID"),
  isEnabled: Joi.boolean().required().label("Enable 2FA"),
});

// verify 2FA schema
export const twoFactorAuthVerifySchema = Joi.object({
  userId: Joi.string().required().label("User ID"),
  otp: Joi.string().length(6).required().label("OTP"),
});

// customer support schema
export const customerSupportSchema = Joi.object({
  userId: Joi.string().required().label("User ID"),
  supportType: Joi.string()
    .valid(...Object.values(CustomerSupportConstants.supportTypes))
    .required()
    .label("Support Type"),
  supportMessage: Joi.string()
    .min(10)
    .max(500)
    .required()
    .label("Support Message"),
});

// guidelines schema
export const guidelinesSchema = Joi.object({
  guideline: Joi.string().required().label("Guideline"),
  how_to: Joi.string().required().label("How To"),
  popular: Joi.string().required().label("Popular"),
});

// terms and conditions schema
export const termsAndConditionsSchema = Joi.object({
  terms_cond: Joi.string().required().label("Terms and Conditions"),
});

// delete account schema
export const deleteAccountSchema = Joi.object({
  userId: Joi.string().required().label("User ID"),
  password: Joi.string().min(6).max(100).required().label("Password"),
});

// create hobby schema
export const createEventCategorySchema = Joi.object({
  name: Joi.string().required().label("Hobby Name"),
  svg_code: Joi.string().required().label("SVG Code"),
});

// user event categories schema
export const userEventCategoriesSchema = Joi.object({
  userId: Joi.string().required().label("User ID"),
  event_category_ids: Joi.array()
    .items(Joi.string())
    .min(3)
    .max(5)
    .required()
    .label("Event Category IDs"),
});

// landing page links schema
export const landingPageLinksSchema = Joi.object({
  android_app_link: Joi.string().required().label("Android App Link"),
  ios_app_link: Joi.string().required().label("iOS App Link"),
  youtube_link: Joi.string().required().label("YouTube Link"),
  facebook_link: Joi.string().required().label("Facebook Link"),
  instagram_link: Joi.string().required().label("Instagram Link"),
  twitter_link: Joi.string().required().label("Twitter Link"),
  pinterest_link: Joi.string().required().label("Pinterest Link"),
});

// landing page details schema
export const landingPageDetailsSchema = Joi.object({
  title: Joi.string().required().label("Title"),
  subtitle: Joi.string().required().label("Subtitle"),
  description: Joi.string().required().label("Description"),
  bottom_text: Joi.string().required().label("Bottom Text"),
  background_image_url: Joi.string().required().label("Background Image URL"),
});

// event schema
export const eventSchema = Joi.object({
  user_id: Joi.string().required().label("User ID"),
  category_id: Joi.string().required().label("Category ID"),
  destination: Joi.string().required().label("Destination"),
  event_image_url: Joi.string().required().label("Event Image URL"),
  event_name: Joi.string().required().label("Event Name"),
  subtitle: Joi.string().required().label("Subtitle"),
  description: Joi.string().required().label("Description"),
  event_start_in: Joi.string().required().label("Event Start In"),
  event_date: Joi.string().required().label("Event Date"),
  event_start_time: Joi.string().required().label("Event Start Time"),
  event_end_time: Joi.string().required().label("Event End Time"),
  street_address: Joi.string().required().label("Street Address"),
  home_number: Joi.string().required().label("Home Number"),
  district: Joi.string().required().label("District"),
  postal_zip_code: Joi.string().required().label("Postal/Zip Code"),
  state: Joi.string().required().label("State"),
  age_range_min: Joi.string().required().label("Age Range Min"),
  age_range_max: Joi.string().required().label("Age Range Max"),
  max_guests: Joi.string().label("Max Guests"),
  payment_type: Joi.string()
    .valid(...Object.values(EventConstants.eventPaymentTypes))
    .required()
    .label("Payment Type"),
  price: Joi.string().required().label("Price"),
});

// update event schema
export const updateEventSchema = Joi.object({
  category_id: Joi.string().required().label("Category ID"),
  event_image_url: Joi.string().required().label("Event Image URL"),
  event_name: Joi.string().required().label("Event Name"),
  subtitle: Joi.string().required().label("Subtitle"),
  description: Joi.string().required().label("Description"),
  event_start_in: Joi.string().required().label("Event Start In"),
  event_date: Joi.string().required().label("Event Date"),
  event_start_time: Joi.string().required().label("Event Start Time"),
  event_end_time: Joi.string().required().label("Event End Time"),
  street_address: Joi.string().required().label("Street Address"),
  home_number: Joi.string().required().label("Home Number"),
  district: Joi.string().required().label("District"),
  postal_zip_code: Joi.string().required().label("Postal/Zip Code"),
  state: Joi.string().required().label("State"),
  age_range_min: Joi.string().required().label("Age Range Min"),
  age_range_max: Joi.string().required().label("Age Range Max"),
  max_guests: Joi.string().label("Max Guests"),
  payment_type: Joi.string()
    .valid(...Object.values(EventConstants.eventPaymentTypes))
    .required()
    .label("Payment Type"),
  price: Joi.string().required().label("Price"),
});

// blog create
export const blogCreateSchema = Joi.object({
  event_category_id: Joi.string().required().label("Event Category ID"),
  blog_name: Joi.string().required().label("Blog Name"),
  banner_img_url: Joi.string().required().label("Banner Image URL"),
  blog_img_url: Joi.string().required().label("Blog Image URL"),
  blog_video_link: Joi.string().label("Blog Video Link"),
  youtube_link: Joi.string().label("YouTube Link"),
  facebook_link: Joi.string().label("Facebook Link"),
  instagram_link: Joi.string().label("Instagram Link"),
  pinterest_link: Joi.string().label("Pinterest Link"),
  twitter_link: Joi.string().label("Twitter Link"),
  blog_content: Joi.string().required().label("Blog Content"),
  author_id: Joi.string().required().label("Author ID"),
});
// blog update
export const updateBlogSchema = Joi.object({
  event_category_id: Joi.string().label("Event Category ID"),
  blog_name: Joi.string().label("Blog Name"),
  banner_img_url: Joi.string().label("Banner Image URL"),
  blog_img_url: Joi.string().label("Blog Image URL"),
  blog_video_link: Joi.string().label("Blog Video Link"),
  youtube_link: Joi.string().label("YouTube Link"),
  facebook_link: Joi.string().label("Facebook Link"),
  instagram_link: Joi.string().label("Instagram Link"),
  pinterest_link: Joi.string().label("Pinterest Link"),
  twitter_link: Joi.string().label("Twitter Link"),
  blog_content: Joi.string().label("Blog Content"),
});

// blog comment
export const blogCommentSchema = Joi.object({
  blog_id: Joi.string().required().label("Blog ID"),
  user_id: Joi.string().required().label("User ID"),
  reply_to: Joi.string().optional().empty("").label("Reply To"),
  content: Joi.string().required().label("Content"),
});

// subscription data
export const subscriptionDataSchema = Joi.object({
  icon_code: Joi.string().required().label("Icon Code"),
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  price: Joi.number().required().label("Price"),
  validity_period: Joi.string().required().label("Validity Period"),
});

// guest ticket
export const guestTicketSchema = Joi.object({
  icon_code: Joi.string().required().label("Icon Code"),
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  price: Joi.number().required().label("Price"),
});

// create user subscription
export const createUserSubscriptionSchema = Joi.object({
  user_id: Joi.string().required().label("User ID"),
  subscription_id: Joi.string().required().label("Subscription ID"),
  stripe_payment_intent_id: Joi.string().required().label("Stripe Payment Intent ID"),
});

// create advert
export const createAdvertSchema = Joi.object({
  category_id: Joi.string().required().label("Category ID"),
  advert_image_type: Joi.string()
    .valid("static", "carousel")
    .required()
    .label("Advert Image Type"),
  advert_image_url_1: Joi.string().required().label("Advert Image URL 1"),
  advert_image_url_2: Joi.string()
    .optional()
    .empty("")
    .label("Advert Image URL 2"),
  advert_image_url_3: Joi.string()
    .optional()
    .empty("")
    .label("Advert Image URL 3"),
  call_to_action: Joi.string().required().label("Call to Action"),
  call_to_action_link: Joi.string().required().label("Call to Action Link"),
  second_call_to_action: Joi.string().required().label("Second Call to Action"),
  second_call_to_action_link: Joi.string()
    .required()
    .label("Second Call to Action Link"),
  campaign_name: Joi.string().required().label("Campaign Name"),
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  audience_min_age: Joi.number().min(0).required().label("Audience Min Age"),
  audience_max_age: Joi.number().min(0).required().label("Audience Max Age"),
  gender: Joi.array()
    .items(Joi.string().valid("male", "female", "Non-binary"))
    .required()
    .label("Gender"),
  region: Joi.string().required().label("Region"),
  advert_location: Joi.array()
    .items(Joi.string()).min(1).max(3)
    .required()
    .label("Advert Location"),
  language: Joi.string().required().label("Language"),
  advert_placement: Joi.string()
    .valid("general", "notification", "both")
    .required()
    .label("Advert Placement"),
  platform: Joi.array()
    .items(Joi.string().valid("web", "ios", "android", "all"))
    .min(1)
    .required()
    .label("Platform"),
  daily_budget_type: Joi.string().required().label("Daily Budget Type"),
  daily_budget: Joi.number().min(0).required().label("Daily Budget"),
  advert_duration: Joi.number().min(0).required().label("Advert Duration"),
  save_template: Joi.boolean().required().label("Save as Template"),
});

// update advert
export const updateAdvertSchema = Joi.object({
  category_id: Joi.string().required().label("Category ID"),
  advert_image_type: Joi.string()
    .valid("static", "carousel")
    .required()
    .label("Advert Image Type"),
  advert_image_url_1: Joi.string().required().label("Advert Image URL 1"),
  advert_image_url_2: Joi.string()
    .optional()
    .empty("")
    .label("Advert Image URL 2"),
  advert_image_url_3: Joi.string()
    .optional()
    .empty("")
    .label("Advert Image URL 3"),
  call_to_action: Joi.string().required().label("Call to Action"),
  call_to_action_link: Joi.string().required().label("Call to Action Link"),
  second_call_to_action: Joi.string().required().label("Second Call to Action"),
  second_call_to_action_link: Joi.string()
    .required()
    .label("Second Call to Action Link"),
  saved_campaign: Joi.string().required().label("Saved Campaign"),
  campaign_name: Joi.string().required().label("Campaign Name"),
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  audience_min_age: Joi.number().min(0).required().label("Audience Min Age"),
  audience_max_age: Joi.number().min(0).required().label("Audience Max Age"),
  gender: Joi.string()
    .valid("male", "female", "Non-binary")
    .required()
    .label("Gender"),
  region: Joi.string().required().label("Region"),
  advert_location: Joi.string().required().label("Advert Location"),
  language: Joi.string().required().label("Language"),
  advert_placement: Joi.string()
    .valid("general", "notification", "both")
    .required()
    .label("Advert Placement"),
  platform: Joi.string()
    .valid("web", "ios", "android", "all")
    .required()
    .label("Platform"),
  daily_budget: Joi.number().min(0).required().label("Daily Budget"),
  advert_duration: Joi.number().min(0).required().label("Advert Duration"),
});
