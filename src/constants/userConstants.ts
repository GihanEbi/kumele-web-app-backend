// export user constants
export class UserConstants {
  static gender = {
    MALE: "male",
    FEMALE: "female",
    NON_BINARY: "Non-binary",
  };
  static language = {
    ENGLISH: "English",
    FRENCH: "French",
    SPANISH: "Spanish",
    GERMAN: "German",
    CHINESE: "Chinese",
    ARABIC: "Arabic",
  };
  static allowPhotosPermission = {
    NON: "non",
    ALL: "all",
    SELECTED: "selected",
  };
  static allowLocationPermission = {
    NON: "non",
    ONCE: "once",
    WHILE_USING: "while_using",
  };
  static setUserNameAction = {
    SAVE: "save",
    SKIP: "skip",
  };
}
