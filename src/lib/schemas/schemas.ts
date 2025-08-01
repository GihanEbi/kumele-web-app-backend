// schema for user registration
import Joi from "joi";
import { UserConstants } from "../../constants/userConstants";
import { CustomerSupportConstants } from "../../constants/customerSupportConstants";

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

// create hobby schema
export const createHobbySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Hobby Name"),
  icon: Joi.string().required().label("Hobby Icon"),
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
