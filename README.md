# Kumele Web App Backend - API Documentation

## Overview
This is the backend API for the Kumele web application, built with Node.js, Express, and TypeScript. The API provides comprehensive functionality for event management, user authentication, social features, payments, and more.

## Table of Contents
1. [Setup and Installation](#setup-and-installation)
2. [Authentication](#authentication)
3. [File Upload](#file-upload)
4. [API Endpoints](#api-endpoints)
   - [User Routes](#user-routes)
   - [OTP Routes](#otp-routes)
   - [Customer Support Routes](#customer-support-routes)
   - [Guidelines Routes](#guidelines-routes)
   - [Terms & Conditions Routes](#terms--conditions-routes)
   - [Event Category Routes](#event-category-routes)
   - [Landing Page Routes](#landing-page-routes)
   - [Event Routes](#event-routes)
   - [Blog Routes](#blog-routes)
   - [Subscription Data Routes](#subscription-data-routes)
   - [Guest Ticket Routes](#guest-ticket-routes)
   - [Advert Routes](#advert-routes)
   - [Chat Routes](#chat-routes)
   - [Payment Routes](#payment-routes)
   - [Passkey Routes](#passkey-routes)
   - [Stripe Routes](#stripe-routes)
   - [Notification Routes](#notification-routes)
   - [Product Routes](#product-routes)
   - [User Cart Routes](#user-cart-routes)
   - [Purchase History Routes](#purchase-history-routes)
   - [User Event Routes](#user-event-routes)
   - [Event Host Rating Routes](#event-host-rating-routes)
   - [Event Report Routes](#event-report-routes)
   - [Following/Follower Routes](#followingfollower-routes)
5. [Error Responses](#error-responses)

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Build the project: `npm run build`
5. Start the server: `npm start`

## Authentication

Most routes require authentication using the JWT token middleware. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## File Upload

Several routes support file uploads using multipart/form-data:
- Profile pictures
- Event images
- Blog images
- Advert images
- Banner images
- Background images
- SVG icons

Always include a `destination` field in the form data to specify the upload folder.

## API Endpoints

### User Routes

#### POST `/api/users/login`
**Purpose**: User login authentication
**Requirements**: 
- `email` (string, required)
- `password` (string, required)
**Response**:
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {user_data}
}
```

#### POST `/api/users/send-password-reset-email`
**Purpose**: Send password reset email
**Requirements**:
- `email` (string, required)
**Response**:
```json
{
  "success": true,
  "message": "Password reset link successfully sent to email"
}
```

#### POST `/api/users/reset-password`
**Purpose**: Reset user password
**Requirements**:
- Reset token and new password
**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### POST `/api/users/google-signin`
**Purpose**: Google OAuth sign-in
**Requirements**:
- `token` (string, required) - Google ID token
**Response**:
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {user_data}
}
```

#### POST `/api/users/google-signup`
**Purpose**: Google OAuth sign-up
**Requirements**:
- `token` (string, required) - Google ID token
**Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {user_data}
}
```

#### POST `/api/users/google-signup-complete`
**Purpose**: Complete Google sign-up process
**Authentication**: Required
**Requirements**: Additional user data for completion
**Response**:
```json
{
  "success": true,
  "message": "Google signup completed successfully"
}
```

#### POST `/api/users/register`
**Purpose**: Register new user
**Requirements**:
- `fullName` (string)
- `email` (string)
- `password` (string, min 6 chars)
- `gender` (string)
- `language` (string)
- `dateOfBirth` (date)
- `aboveLegalAge` (boolean)
- `termsAndConditionsAccepted` (boolean)
- `subscribedToNewsletter` (boolean)
**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {user_data}
}
```

#### POST `/api/users/update-permissions`
**Purpose**: Update user permissions
**Authentication**: Required
**Requirements**:
- `allow_notifications` (boolean)
- `allow_photos` (string)
- `allow_location` (string)
**Response**:
```json
{
  "success": true,
  "message": "User permissions updated successfully"
}
```

#### POST `/api/users/set-username`
**Purpose**: Set or update username
**Authentication**: Required
**Requirements**:
- `action` (string) - 'save' or 'skip'
- `username` (string, conditional)
**Response**:
```json
{
  "success": true,
  "message": "User name updated successfully"
}
```

#### PUT `/api/users/profile-picture`
**Purpose**: Upload/update profile picture
**Authentication**: Required
**Requirements**:
- Form data with `profilePicture` file
- `destination` field for file upload
**Response**:
```json
{
  "success": true,
  "message": "Profile picture updated successfully"
}
```

#### PUT `/api/users/profile-about`
**Purpose**: Update user's about section
**Authentication**: Required
**Requirements**:
- `aboutMe` (string)
**Response**:
```json
{
  "success": true,
  "message": "About section updated successfully"
}
```

#### POST `/api/users/update-notifications`
**Purpose**: Update notification settings
**Authentication**: Required
**Requirements**:
- Notification preferences
**Response**:
```json
{
  "success": true,
  "message": "Notification settings updated successfully"
}
```

#### GET `/api/users/user-data`
**Purpose**: Get current user's data
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {user_data}
}
```

#### GET `/api/users/user-notification-status`
**Purpose**: Get user's notification status
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {notification_status}
}
```

#### POST `/api/users/change-password`
**Purpose**: Change user password
**Authentication**: Required
**Requirements**:
- `oldPassword` (string)
- `newPassword` (string)
**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### POST `/api/users/set-two-factor-authentication`
**Purpose**: Enable/disable 2FA
**Authentication**: Required
**Requirements**:
- `isEnabled` (boolean)
**Response**:
```json
{
  "success": true,
  "message": "Two-factor authentication updated successfully"
}
```

#### POST `/api/users/verify-two-factor-authentication`
**Purpose**: Verify 2FA token
**Authentication**: Required
**Requirements**:
- `otp` (string)
**Response**:
```json
{
  "success": true,
  "message": "Two-factor authentication verified successfully"
}
```

#### DELETE `/api/users/delete-account`
**Purpose**: Delete user account
**Authentication**: Required
**Requirements**:
- `password` (string)
**Response**:
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

#### POST `/api/users/set-user-event-categories`
**Purpose**: Set user's preferred event categories
**Authentication**: Required
**Requirements**:
- `event_category_ids` (array of strings, 3-5 items)
**Response**:
```json
{
  "success": true,
  "message": "Event categories set successfully"
}
```

#### GET `/api/users/get-user-event-categories`
**Purpose**: Get user's event categories
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [event_categories]
}
```

#### GET `/api/users/get-user-by-id/:userId`
**Purpose**: Get user data by ID
**Authentication**: Required
**Parameters**:
- `userId` (string, required)
**Response**:
```json
{
  "success": true,
  "data": {user_data}
}
```

### OTP Routes

#### POST `/api/otp/send-otp-email-verification`
**Purpose**: Send OTP for email verification
**Requirements**:
- `email` (string, required)
**Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### POST `/api/otp/verify-email`
**Purpose**: Verify email with OTP
**Requirements**:
- `email` (string)
- `otp` (string, 4 digits)
**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### POST `/api/otp/create-user-beta-code`
**Purpose**: Create beta code for user
**Requirements**:
- `email` (string)
**Response**:
```json
{
  "success": true,
  "message": "User beta code created successfully",
  "data": null
}
```

### Customer Support Routes

#### POST `/api/customer-support/send-support-request`
**Purpose**: Send customer support request
**Authentication**: Required
**Requirements**:
- `supportType` (string)
- `supportMessage` (string, 10-500 chars)
**Response**:
```json
{
  "success": true,
  "message": "Support request sent successfully"
}
```

### Guidelines Routes

#### POST `/api/guidelines/create-update-guideline`
**Purpose**: Create or update user guidelines
**Authentication**: Required
**Requirements**:
- `guideline` (string)
- `how_to` (string)
- `popular` (string)
**Response**:
```json
{
  "success": true,
  "message": "User guideline added successfully.",
  "data": {guideline_data}
}
```

#### GET `/api/guidelines/get-guidelines`
**Purpose**: Get user guidelines
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {guidelines}
}
```

### Terms & Conditions Routes

#### POST `/api/terms-conditions/create-update-terms-conditions`
**Purpose**: Create or update terms and conditions
**Authentication**: Required
**Requirements**:
- `terms_cond` (string)
**Response**:
```json
{
  "success": true,
  "message": "Terms and Conditions created successfully",
  "data": {terms_data}
}
```

#### GET `/api/terms-conditions/get-terms-conditions`
**Purpose**: Get terms and conditions
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {terms_conditions}
}
```

### Event Category Routes

#### POST `/api/event-category/create-event-category`
**Purpose**: Create new event category
**Authentication**: Required
**Requirements**:
- `name` (string)
- SVG icon file upload (`eventCategoryIcon`)
**Response**:
```json
{
  "message": "Event category created successfully!",
  "eventCategory": {category_data}
}
```

#### GET `/api/event-category/get-event-categories`
**Purpose**: Get all event categories
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Event categories fetched successfully",
  "data": [categories]
}
```

#### POST `/api/event-category/create-icon-img`
**Purpose**: Create icon image for category
**Authentication**: Required
**Requirements**:
- Image file upload (`icon_img_url`)
- `destination` field
**Response**:
```json
{
  "success": true,
  "message": "Icon image created successfully.",
  "icon_img_url": "full_url"
}
```

### Landing Page Routes

#### POST `/api/landing-page/create-landing-page-links`
**Purpose**: Create landing page social links
**Authentication**: Required
**Requirements**:
- `android_app_link` (string)
- `ios_app_link` (string)
- `youtube_link` (string)
- `facebook_link` (string)
- `instagram_link` (string)
- `twitter_link` (string)
- `pinterest_link` (string)
**Response**:
```json
{
  "success": true,
  "message": "Landing page links added successfully.",
  "data": {links_data}
}
```

#### GET `/api/landing-page/get-landing-page-links`
**Purpose**: Get landing page links
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {links}
}
```

#### POST `/api/landing-page/create-about-us`
**Purpose**: Create/update about us content
**Authentication**: Required
**Requirements**:
- `about_us` (string)
**Response**:
```json
{
  "success": true,
  "message": "About Us content added successfully.",
  "data": {about_data}
}
```

#### GET `/api/landing-page/get-about-us`
**Purpose**: Get about us content
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {about_content}
}
```

#### POST `/api/landing-page/create-landing-page-details`
**Purpose**: Create landing page details
**Authentication**: Required
**Requirements**:
- `title` (string)
- `subtitle` (string)
- `description` (string)
- `bottom_text` (string)
- Background image file (`backgroundImage`)
**Response**:
```json
{
  "success": true,
  "message": "Landing page details created successfully.",
  "data": {details_data}
}
```

#### GET `/api/landing-page/get-landing-page-details/:id`
**Purpose**: Get landing page details by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "data": {details}
}
```

#### GET `/api/landing-page/get-all-landing-page-details`
**Purpose**: Get all landing page details
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [details_array]
}
```

#### PUT `/api/landing-page/update-landing-page-details/:id`
**Purpose**: Update landing page details
**Authentication**: Required
**Parameters**:
- `id` (string)
**Requirements**:
- `title` (string)
- `subtitle` (string)
- `description` (string)
- `bottom_text` (string)
- Background image file (`backgroundImage`)
**Response**:
```json
{
  "success": true,
  "message": "Landing page details updated successfully"
}
```

### Event Routes

#### POST `/api/events/create-event`
**Purpose**: Create new event
**Authentication**: Required
**Requirements**:
- Event image file (`event_image`)
- `destination` field
- `category_id` (string)
- `event_name` (string)
- `subtitle` (string)
- `description` (string)
- `event_start_in` (string)
- `event_date` (string)
- `event_start_time` (string)
- `event_end_time` (string)
- `street_address` (string)
- `home_number` (string)
- `district` (string)
- `postal_zip_code` (string)
- `state` (string)
- `age_range_min` (string)
- `age_range_max` (string)
- `payment_type` (string)
- `price` (string)
**Response**:
```json
{
  "success": true,
  "message": "Event created successfully.",
  "event": {event_data}
}
```

#### GET `/api/events/get-all-events`
**Purpose**: Get all events
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [events]
}
```

#### GET `/api/events/get-event-by-user-id/:userId`
**Purpose**: Get events by user ID
**Authentication**: Required
**Parameters**:
- `userId` (string)
**Response**:
```json
{
  "success": true,
  "data": [events]
}
```

#### GET `/api/events/get-event-by-category-id/:categoryId`
**Purpose**: Get events by category ID
**Authentication**: Required
**Parameters**:
- `categoryId` (string)
**Response**:
```json
{
  "success": true,
  "data": [events]
}
```

#### GET `/api/events/get-event-by-id/:eventId`
**Purpose**: Get event by ID
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Response**:
```json
{
  "success": true,
  "data": {event}
}
```

#### PUT `/api/events/update-event-by-id/:eventId`
**Purpose**: Update event by ID
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Requirements**:
- Event image file (`event_image`)
- Updated event data
**Response**:
```json
{
  "success": true,
  "message": "Event updated successfully"
}
```

### Blog Routes

#### POST `/api/blogs/create-blog`
**Purpose**: Create new blog post
**Authentication**: Required
**Requirements**:
- Blog image file (`blog_img_url`)
- `destination` field
- `event_category_id` (string)
- `blog_name` (string)
- `banner_img_url` (string)
- `blog_content` (string)
**Response**:
```json
{
  "success": true,
  "message": "Blog created successfully.",
  "blog": {blog_data}
}
```

#### GET `/api/blogs/get-all-blogs`
**Purpose**: Get all blogs
**Response**:
```json
{
  "success": true,
  "data": [blogs]
}
```

#### GET `/api/blogs/get-blog-by-user-id/:userId`
**Purpose**: Get blogs by user ID
**Parameters**:
- `userId` (string)
**Response**:
```json
{
  "success": true,
  "data": [blogs]
}
```

#### GET `/api/blogs/get-blog-by-category-id/:categoryId`
**Purpose**: Get blogs by category ID
**Parameters**:
- `categoryId` (string)
**Response**:
```json
{
  "success": true,
  "data": [blogs]
}
```

#### GET `/api/blogs/get-blog-by-id/:blogId`
**Purpose**: Get blog by ID
**Parameters**:
- `blogId` (string)
**Response**:
```json
{
  "success": true,
  "data": {blog}
}
```

#### PUT `/api/blogs/update-blog-by-id/:blogId`
**Purpose**: Update blog by ID
**Authentication**: Required
**Parameters**:
- `blogId` (string)
**Requirements**:
- Blog image file (`blog_img_url`)
- Updated blog data
**Response**:
```json
{
  "success": true,
  "message": "Blog updated successfully"
}
```

#### POST `/api/blogs/create-banner`
**Purpose**: Create banner image
**Authentication**: Required
**Requirements**:
- Banner image file (`banner_img_url`)
- `destination` field
**Response**:
```json
{
  "success": true,
  "message": "Banner image created successfully"
}
```

#### PUT `/api/blogs/update-banner/:blogId`
**Purpose**: Update blog banner
**Authentication**: Required
**Parameters**:
- `blogId` (string)
**Requirements**:
- Banner image file (`banner_img_url`)
**Response**:
```json
{
  "success": true,
  "message": "Banner updated successfully"
}
```

#### POST `/api/blogs/like-blog/:blogId`
**Purpose**: Like a blog post
**Authentication**: Required
**Parameters**:
- `blogId` (string)
**Response**:
```json
{
  "success": true,
  "message": "Blog liked successfully"
}
```

#### POST `/api/blogs/unlike-blog/:blogId`
**Purpose**: Unlike a blog post
**Authentication**: Required
**Parameters**:
- `blogId` (string)
**Response**:
```json
{
  "success": true,
  "message": "Blog unliked successfully"
}
```

#### GET `/api/blogs/get-blog-like-count/:blogId`
**Purpose**: Get blog like count
**Parameters**:
- `blogId` (string)
**Response**:
```json
{
  "success": true,
  "data": {like_count}
}
```

#### GET `/api/blogs/get-blog-comments/:blogId`
**Purpose**: Get blog comments
**Parameters**:
- `blogId` (string)
**Response**:
```json
{
  "success": true,
  "data": [comments]
}
```

#### POST `/api/blogs/comment-blog/:blogId`
**Purpose**: Comment on blog
**Authentication**: Required
**Parameters**:
- `blogId` (string)
**Requirements**:
- `comment` (string)
- `reply_to` (string, optional)
**Response**:
```json
{
  "success": true,
  "message": "Comment added successfully"
}
```

### Subscription Data Routes

#### POST `/api/subscriptions/create-subscription-data`
**Purpose**: Create subscription plan
**Authentication**: Required
**Requirements**:
- SVG icon file (`eventCategoryIcon`)
- `title` (string)
- `description` (string)
- `price` (number)
- `validity_period` (string)
**Response**:
```json
{
  "message": "Subscription created successfully!",
  "subscription": {subscription_data}
}
```

#### GET `/api/subscriptions/get-all-subscription-data`
**Purpose**: Get all subscription plans
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [subscriptions]
}
```

#### GET `/api/subscriptions/get-subscription-data-by-id/:id`
**Purpose**: Get subscription by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "data": {subscription}
}
```

#### PUT `/api/subscriptions/update-subscription-data-by-id/:id`
**Purpose**: Update subscription by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Requirements**:
- SVG icon file (`eventCategoryIcon`)
- Updated subscription data
**Response**:
```json
{
  "success": true,
  "message": "Subscription updated successfully"
}
```

#### POST `/api/subscriptions/create-user-subscription`
**Purpose**: Create user subscription
**Authentication**: Required
**Requirements**:
- `subscription_id` (string)
- `stripe_payment_intent_id` (string)
**Response**:
```json
{
  "success": true,
  "message": "User Subscription created successfully!",
  "subscription": {subscription_data}
}
```

#### GET `/api/subscriptions/get-all-user-subscriptions`
**Purpose**: Get all user subscriptions
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [user_subscriptions]
}
```

#### POST `/api/subscriptions/activate-user-subscription/:subscriptionId`
**Purpose**: Activate user subscription
**Authentication**: Required
**Parameters**:
- `subscriptionId` (string)
**Response**:
```json
{
  "success": true,
  "message": "Subscription activated successfully!",
  "subscription": {subscription_data}
}
```

#### POST `/api/subscriptions/deactivate-user-subscription/:subscriptionId`
**Purpose**: Deactivate user subscription
**Authentication**: Required
**Parameters**:
- `subscriptionId` (string)
**Response**:
```json
{
  "success": true,
  "message": "Subscription deactivated successfully!",
  "subscription": {subscription_data}
}
```

#### GET `/api/subscriptions/get-all-user-subscriptions-and-unsubscribes`
**Purpose**: Get all user subscriptions and unsubscribes
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {subscriptions_data}
}
```

### Guest Ticket Routes

#### POST `/api/guest-tickets/create-guest-ticket`
**Purpose**: Create guest ticket
**Authentication**: Required
**Requirements**:
- SVG icon file (`eventCategoryIcon`)
- `title` (string)
- `description` (string)
- `price` (number)
**Response**:
```json
{
  "message": "Guest ticket created successfully!",
  "guestTicket": {ticket_data}
}
```

#### GET `/api/guest-tickets/get-all-guest-tickets`
**Purpose**: Get all guest tickets
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "guestTickets": [tickets]
}
```

#### GET `/api/guest-tickets/get-guest-ticket-by-id/:id`
**Purpose**: Get guest ticket by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "guestTicket": {ticket_data}
}
```

#### PUT `/api/guest-tickets/update-guest-ticket-by-id/:id`
**Purpose**: Update guest ticket by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Requirements**:
- SVG icon file (`eventCategoryIcon`)
- Updated ticket data
**Response**:
```json
{
  "success": true,
  "message": "Guest ticket updated successfully"
}
```

### Advert Routes

#### POST `/api/adverts/create-advert-img`
**Purpose**: Create advert image
**Authentication**: Required
**Requirements**:
- Advert image file (`advert_image`)
- `destination` field
**Response**:
```json
{
  "success": true,
  "message": "advert image created successfully.",
  "advert_img_url": "full_url"
}
```

#### POST `/api/adverts/create-advert`
**Purpose**: Create advertisement
**Authentication**: Required
**Requirements**:
- `category_id` (string)
- `advert_image_type` (string: "static" or "carousel")
- `advert_image_url_1` (string)
- `advert_image_url_2` (string, optional)
- `advert_image_url_3` (string, optional)
- `call_to_action` (string)
- `call_to_action_link` (string)
- `second_call_to_action` (string)
- `second_call_to_action_link` (string)
- `campaign_name` (string)
- `title` (string)
- `description` (string)
- `audience_min_age` (number)
- `audience_max_age` (number)
- `gender` (array)
- `daily_budget` (number)
- `advert_duration` (number)
- `save_template` (boolean)
**Response**:
```json
{
  "success": true,
  "message": "Advert created successfully.",
  "advert": {advert_data}
}
```

#### GET `/api/adverts/get-saved-adverts-by-user-id`
**Purpose**: Get saved adverts by user ID
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [adverts]
}
```

#### GET `/api/adverts/get-all-adverts`
**Purpose**: Get all advertisements
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [adverts]
}
```

#### GET `/api/adverts/get-advert-by-id/:advertId`
**Purpose**: Get advert by ID
**Authentication**: Required
**Parameters**:
- `advertId` (string)
**Response**:
```json
{
  "success": true,
  "data": {advert}
}
```

#### GET `/api/adverts/get-adverts-by-category-id/:categoryId`
**Purpose**: Get adverts by category ID
**Authentication**: Required
**Parameters**:
- `categoryId` (string)
**Response**:
```json
{
  "success": true,
  "data": [adverts]
}
```

#### GET `/api/adverts/get-adverts-by-user-id`
**Purpose**: Get adverts by user ID
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [adverts]
}
```

#### PUT `/api/adverts/update-advert-by-id/:advertId`
**Purpose**: Update advert by ID
**Authentication**: Required
**Parameters**:
- `advertId` (string)
**Requirements**: Updated advert data
**Response**:
```json
{
  "success": true,
  "message": "Advert updated successfully"
}
```

#### Advert Language Routes

#### POST `/api/adverts/create-advert-language`
**Purpose**: Create advert language option
**Authentication**: Required
**Requirements**:
- `name` (string)
**Response**:
```json
{
  "success": true,
  "message": "Advert language created successfully.",
  "data": {language_data}
}
```

#### GET `/api/adverts/get-all-advert-languages`
**Purpose**: Get all advert languages
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [languages]
}
```

#### GET `/api/adverts/get-advert-language-by-id/:languageId`
**Purpose**: Get advert language by ID
**Authentication**: Required
**Parameters**:
- `languageId` (string)
**Response**:
```json
{
  "success": true,
  "data": {language}
}
```

#### PUT `/api/adverts/update-advert-language-by-id/:languageId`
**Purpose**: Update advert language by ID
**Authentication**: Required
**Parameters**:
- `languageId` (string)
**Requirements**: Updated language data
**Response**:
```json
{
  "success": true,
  "data": {updated_language}
}
```

#### Advert Region Routes

#### POST `/api/adverts/create-advert-region`
**Purpose**: Create advert region
**Authentication**: Required
**Requirements**:
- `name` (string)
**Response**:
```json
{
  "success": true,
  "message": "Advert region created successfully.",
  "data": {region_data}
}
```

#### GET `/api/adverts/get-all-advert-regions`
**Purpose**: Get all advert regions
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [regions]
}
```

#### GET `/api/adverts/get-advert-region-by-id/:regionId`
**Purpose**: Get advert region by ID
**Authentication**: Required
**Parameters**:
- `regionId` (string)
**Response**:
```json
{
  "success": true,
  "data": {region}
}
```

#### PUT `/api/adverts/update-advert-region-by-id/:regionId`
**Purpose**: Update advert region by ID
**Authentication**: Required
**Parameters**:
- `regionId` (string)
**Requirements**: Updated region data
**Response**:
```json
{
  "success": true,
  "data": {updated_region}
}
```

#### Advert Daily Budget Routes

#### POST `/api/adverts/create-advert-daily-budget`
**Purpose**: Create advert daily budget option
**Authentication**: Required
**Requirements**: Budget data
**Response**:
```json
{
  "success": true,
  "message": "Advert daily budget created successfully.",
  "data": {budget_data}
}
```

#### GET `/api/adverts/get-all-advert-daily-budgets`
**Purpose**: Get all advert daily budgets
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [budgets]
}
```

#### GET `/api/adverts/get-advert-daily-budget-by-id/:budgetId`
**Purpose**: Get advert daily budget by ID
**Authentication**: Required
**Parameters**:
- `budgetId` (string)
**Response**:
```json
{
  "success": true,
  "data": {budget}
}
```

#### PUT `/api/adverts/update-advert-daily-budget-by-id/:budgetId`
**Purpose**: Update advert daily budget by ID
**Authentication**: Required
**Parameters**:
- `budgetId` (string)
**Requirements**: Updated budget data
**Response**:
```json
{
  "success": true,
  "data": {updated_budget}
}
```

#### Advert Call To Action Routes

#### POST `/api/adverts/create-advert-call-to-action`
**Purpose**: Create advert call-to-action
**Authentication**: Required
**Requirements**:
- `name` (string)
**Response**:
```json
{
  "success": true,
  "message": "Advert call to action created successfully.",
  "data": {cta_data}
}
```

#### GET `/api/adverts/get-all-advert-call-to-actions`
**Purpose**: Get all advert call-to-actions
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [ctas]
}
```

#### GET `/api/adverts/get-advert-call-to-action-by-id/:id`
**Purpose**: Get advert call-to-action by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "data": {cta}
}
```

#### PUT `/api/adverts/update-advert-call-to-action-by-id/:id`
**Purpose**: Update advert call-to-action by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Requirements**: Updated CTA data
**Response**:
```json
{
  "success": true,
  "data": {updated_cta}
}
```

#### Advert Placement Price Routes

#### POST `/api/adverts/create-advert-placement-price`
**Purpose**: Create advert placement price
**Authentication**: Required
**Requirements**: Placement price data
**Response**:
```json
{
  "success": true,
  "message": "Advert placement price created successfully.",
  "data": {price_data}
}
```

#### GET `/api/adverts/get-all-advert-placement-prices`
**Purpose**: Get all advert placement prices
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [prices]
}
```

#### GET `/api/adverts/get-advert-placement-price-by-id/:id`
**Purpose**: Get advert placement price by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "data": {price}
}
```

#### PUT `/api/adverts/update-advert-placement-price-by-id/:id`
**Purpose**: Update advert placement price by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Requirements**: Updated price data
**Response**:
```json
{
  "success": true,
  "data": {updated_price}
}
```

### Chat Routes

#### GET `/api/chat/messages/:eventId`
**Purpose**: Get all messages for a specific event
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Response**:
```json
{
  "success": true,
  "data": [messages]
}
```

#### POST `/api/chat/messages`
**Purpose**: Send a new message to an event's chat
**Authentication**: Required
**Requirements**:
- `eventId` (string)
- `content` (string)
**Response**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {message_data}
}
```

### Payment Routes

#### POST `/api/payments/orders/create`
**Purpose**: Create PayPal order
**Authentication**: Required
**Requirements**: Order data
**Response**:
```json
{
  "success": true,
  "orderID": "paypal_order_id"
}
```

#### POST `/api/payments/orders/capture`
**Purpose**: Capture PayPal payment
**Authentication**: Required
**Requirements**: Order capture data
**Response**:
```json
{
  "success": true,
  "message": "Payment captured successfully"
}
```

#### POST `/api/payments/cards/save`
**Purpose**: Save payment card
**Authentication**: Required
**Requirements**:
- `paypal_token_id` (string)
- `card_brand` (string)
- `last4` (string)
**Response**:
```json
{
  "success": true,
  "message": "Card saved successfully.",
  "data": {card_data}
}
```

#### GET `/api/payments/cards`
**Purpose**: Get user's saved cards
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [saved_cards]
}
```

### Passkey Routes

#### POST `/api/passkeys/register/start`
**Purpose**: Start passkey registration
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Passkey registration started successfully",
  "data": {registration_options}
}
```

#### POST `/api/passkeys/register/finish`
**Purpose**: Finish passkey registration
**Authentication**: Required
**Requirements**: Registration response data
**Response**:
```json
{
  "success": true,
  "message": "Passkey registered successfully"
}
```

#### POST `/api/passkeys/authenticate/start`
**Purpose**: Start passkey authentication
**Response**:
```json
{
  "success": true,
  "message": "Passkey authentication started successfully",
  "data": {authentication_options}
}
```

#### POST `/api/passkeys/authenticate/finish`
**Purpose**: Finish passkey authentication
**Requirements**: Authentication response data
**Response**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {user_data}
}
```

### Stripe Routes

#### POST `/api/stripe/create-payment-intent`
**Purpose**: Create Stripe payment intent
**Authentication**: Required
**Requirements**: Payment data
**Response**:
```json
{
  "success": true,
  "client_secret": "stripe_client_secret"
}
```

#### POST `/api/stripe/verify-payment`
**Purpose**: Verify Stripe payment status
**Authentication**: Required
**Requirements**: Payment verification data
**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Notification Routes

#### GET `/api/notifications/get-unread-notifications-count`
**Purpose**: Get unread notifications count
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {unread_count}
}
```

#### GET `/api/notifications/get-created-hobbies-notifications`
**Purpose**: Get created hobbies notifications
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [notifications]
}
```

#### GET `/api/notifications/get-follower-event-notifications`
**Purpose**: Get follower event notifications
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [notifications]
}
```

#### GET `/api/notifications/get-match-hobbies-notifications`
**Purpose**: Get match hobbies notifications
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [notifications]
}
```

### Product Routes

#### POST `/api/products/create-product`
**Purpose**: Create new product
**Authentication**: Required
**Requirements**:
- `name` (string)
- `description` (string)
- `price` (number)
- `type` (string)
**Response**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {product_data}
}
```

#### GET `/api/products/get-all-products`
**Purpose**: Get all products
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [products]
}
```

#### GET `/api/products/get-product/:id`
**Purpose**: Get product by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "data": {product}
}
```

#### PUT `/api/products/update-product/:id`
**Purpose**: Update product by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Requirements**: Updated product data
**Response**:
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

#### DELETE `/api/products/delete-product/:id`
**Purpose**: Delete product by ID
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### GET `/api/products/get-products-by-type/:type`
**Purpose**: Get products by type
**Authentication**: Required
**Parameters**:
- `type` (string)
**Response**:
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [products]
}
```

#### GET `/api/products/get-product-types`
**Purpose**: Get all product types
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [product_types]
}
```

### User Cart Routes

#### POST `/api/cart/add-item`
**Purpose**: Add item to cart
**Authentication**: Required
**Requirements**:
- `product_id` (string)
- `quantity` (number)
**Response**:
```json
{
  "success": true,
  "message": "Item added to cart successfully"
}
```

#### GET `/api/cart/get-user-cart`
**Purpose**: Get user's cart
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [cart_items]
}
```

#### DELETE `/api/cart/remove-item/:id`
**Purpose**: Remove item from cart
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

### Purchase History Routes

#### POST `/api/purchase-history/add`
**Purpose**: Add purchase to history
**Authentication**: Required
**Requirements**: Purchase data
**Response**:
```json
{
  "success": true,
  "message": "Purchase added to history successfully"
}
```

#### GET `/api/purchase-history/user`
**Purpose**: Get user's purchase history
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [purchases]
}
```

#### GET `/api/purchase-history/all`
**Purpose**: Get all purchase history
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [all_purchases]
}
```

### User Event Routes

#### POST `/api/user-events/create-user-event`
**Purpose**: Create user event participation
**Authentication**: Required
**Requirements**:
- `event_id` (string)
**Response**:
```json
{
  "success": true,
  "message": "User event created successfully"
}
```

#### PUT `/api/user-events/accept-user-event/:userEventId`
**Purpose**: Accept user event participation
**Authentication**: Required
**Parameters**:
- `userEventId` (string)
**Response**:
```json
{
  "success": true,
  "message": "User event accepted successfully"
}
```

#### PUT `/api/user-events/cancel-user-event/:id`
**Purpose**: Cancel user event participation
**Authentication**: Required
**Parameters**:
- `id` (string)
**Response**:
```json
{
  "success": true,
  "message": "User event cancelled successfully"
}
```

#### GET `/api/user-events/get-all-user-events-by-event-id/:eventId`
**Purpose**: Get all user events by event ID
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Response**:
```json
{
  "success": true,
  "data": [user_events]
}
```

#### GET `/api/user-events/get-all-user-events`
**Purpose**: Get all user events
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [user_events]
}
```

#### GET `/api/user-events/get-pending-user-events-by-user-id`
**Purpose**: Get pending user events by user ID
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [pending_events]
}
```

#### GET `/api/user-events/get-confirmed-user-events-by-user-id`
**Purpose**: Get confirmed user events by user ID
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [confirmed_events]
}
```

#### GET `/api/user-events/get-cancelled-user-events-by-user-id`
**Purpose**: Get cancelled user events by user ID
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [cancelled_events]
}
```

### Event Host Rating Routes

#### POST `/api/event-host-ratings/create-event-host-rating`
**Purpose**: Create event host rating
**Authentication**: Required
**Requirements**:
- `event_id` (string)
- `host_id` (string)
- `rating` (number)
- `comment` (string, optional)
**Response**:
```json
{
  "success": true,
  "message": "Rating created successfully"
}
```

#### GET `/api/event-host-ratings/get-event-average-rating/:eventId`
**Purpose**: Get event average rating
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Response**:
```json
{
  "success": true,
  "data": {average_rating}
}
```

#### GET `/api/event-host-ratings/get-event-ratings/:eventId`
**Purpose**: Get event ratings
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Response**:
```json
{
  "success": true,
  "data": [ratings]
}
```

#### GET `/api/event-host-ratings/get-user-given-ratings/:userId`
**Purpose**: Get ratings given by user
**Authentication**: Required
**Parameters**:
- `userId` (string)
**Response**:
```json
{
  "success": true,
  "data": [given_ratings]
}
```

#### GET `/api/event-host-ratings/get-host-received-ratings/:hostId`
**Purpose**: Get ratings received by host
**Authentication**: Required
**Parameters**:
- `hostId` (string)
**Response**:
```json
{
  "success": true,
  "data": [received_ratings]
}
```

#### GET `/api/event-host-ratings/get-host-ratings/:hostId`
**Purpose**: Get host ratings
**Authentication**: Required
**Parameters**:
- `hostId` (string)
**Response**:
```json
{
  "success": true,
  "data": [host_ratings]
}
```

### Event Report Routes

#### GET `/api/event-reports/get-reasons`
**Purpose**: Get event report reasons
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Event report reasons fetched successfully",
  "data": [reasons]
}
```

#### POST `/api/event-reports/create-report`
**Purpose**: Create event report
**Authentication**: Required
**Requirements**:
- `event_id` (string)
- `reason` (string)
- `comments` (string)
**Response**:
```json
{
  "success": true,
  "message": "Event report created successfully",
  "data": {report_data}
}
```

#### GET `/api/event-reports/get-all`
**Purpose**: Get all event reports
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Event reports fetched successfully",
  "data": [reports]
}
```

#### GET `/api/event-reports/get-by-event/:eventId`
**Purpose**: Get event reports by event ID
**Authentication**: Required
**Parameters**:
- `eventId` (string)
**Response**:
```json
{
  "success": true,
  "data": [reports]
}
```

#### GET `/api/event-reports/get-by-user/:userId`
**Purpose**: Get event reports by user ID
**Authentication**: Required
**Parameters**:
- `userId` (string)
**Response**:
```json
{
  "success": true,
  "data": [reports]
}
```

### Following/Follower Routes

#### POST `/api/following-follower/follow`
**Purpose**: Follow a user
**Authentication**: Required
**Requirements**:
- `following_id` (string)
**Response**:
```json
{
  "success": true,
  "message": "User followed successfully",
  "data": {follow_data}
}
```

#### POST `/api/following-follower/unfollow`
**Purpose**: Unfollow a user
**Authentication**: Required
**Requirements**:
- `following_id` (string)
**Response**:
```json
{
  "success": true,
  "message": "User unfollowed successfully"
}
```

#### GET `/api/following-follower/get-followers`
**Purpose**: Get user's followers
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [followers]
}
```

#### GET `/api/following-follower/get-following`
**Purpose**: Get users that current user is following
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": [following]
}
```

#### GET `/api/following-follower/get-followers-following-count`
**Purpose**: Get followers and following count
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "data": {
    "followers_count": number,
    "following_count": number
  }
}
```

## Error Responses

All endpoints return error responses in this format:
```json
{
  "success": false,
  "message": "Error message description"
}
```

## Base URL

All routes are prefixed with `/api/` and the service runs on the configured port (default: 5001).

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:
- Database connection strings
- JWT secret keys
- PayPal/Stripe API keys
- Email service credentials
- File upload configurations
- Other service-specific configurations

## Development

1. Install dependencies: `npm install`
2. Set up environment variables
3. Build the project: `npm run build`
4. Start development server: `npm run dev`
5. For production: `npm start`

## Contributing

Please follow the established patterns when adding new endpoints:
- Use appropriate HTTP methods
- Include proper authentication where needed
- Follow the existing response format
- Add proper error handling
- Update this documentation for new endpoints