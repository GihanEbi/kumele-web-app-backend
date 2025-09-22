export class NotificationConstants {
  static notificationTypes = {
    matchHobbies: "MATCH_HOBBIES",
    createHobbies: "CREATE_HOBBIES",
    followersEventCreation: "FOLLOWERS_EVENT_CREATION",
    eventCancel: "EVENT_CANCEL",
    blogComments: "BLOG_COMMENTS",
    userStatus: "USER_STATUS",
    birthday: "BIRTHDAY",
    application: "APPLICATION",
    eventReminders: "EVENT_REMINDERS",
    chatNotifications: "CHAT_NOTIFICATIONS",
  };

  static notificationTypesList = [
    { label: "Match Hobby(ies)", value: "MATCH_HOBBIES" },
    { label: "Create Hobby(ies)", value: "CREATE_HOBBIES" },
    { label: "Followers Event Creation", value: "FOLLOWERS_EVENT_CREATION" },
    { label: "Event Cancel", value: "EVENT_CANCEL" },
    { label: "Blog Comments", value: "BLOG_COMMENTS" },
    { label: "User Status", value: "USER_STATUS" },
    { label: "Birthday", value: "BIRTHDAY" },
    { label: "Application", value: "APPLICATION" },
    { label: "Event Reminders", value: "EVENT_REMINDERS" },
    { label: "Chat Notifications", value: "CHAT_NOTIFICATIONS" },
  ];

  static userNotificationStatus = {
    unread: "UNREAD",
    read: "READ",
  };
}
