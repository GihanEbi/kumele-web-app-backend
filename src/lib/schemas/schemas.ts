// schema for user registration
import Joi from "joi";
import { UserConstants } from "../../constants/userConstants";

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
