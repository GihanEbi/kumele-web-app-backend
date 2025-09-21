export class NotificationConstants {
  static notificationTypes = {
    matchHobbies: "MATCH_HOBBIES",
    createHobbies: "CREATE_HOBBIES",
    otherNotifications: "OTHER_NOTIFICATIONS",
    chatNotifications: "CHAT_NOTIFICATIONS",
  };

  static notificationTypesList = [
    { label: "Match Hobby(ies)", value: "MATCH_HOBBIES" },
    { label: "Create Hobby(ies)", value: "CREATE_HOBBIES" },
    { label: "Other Notifications", value: "OTHER_NOTIFICATIONS" },
    { label: "Chat Notifications", value: "CHAT_NOTIFICATIONS" },
  ];

  static userNotificationStatus = {
    unread: "UNREAD",
    read: "READ",
  };
}
