// export event constants
export class EventConstants {
  static eventPaymentTypes = {
    FREE: "free",
    CARD_PAYMENT: "card_payment",
    CASH_ON_ENTRY: "cash_on_entry",
  };

  // user event status
  static userEventStatus = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    CHECKED_IN: "CHECKED_IN",
  };

  // event report reasons
  static eventReportReasons = {
    racist : "RACIST",
    scam : "SCAM",
    physical_assault : "PHYSICAL_ASSAULT",
    other : "OTHER"
  };

  // event report reasons
  static eventReportReasonsList = [
    { label: "Racist", value: "RACIST" },
    { label: "Scam", value: "SCAM" },
    { label: "Physical Assault", value: "PHYSICAL_ASSAULT" },
    { label: "Other", value: "OTHER" },
  ];
}
