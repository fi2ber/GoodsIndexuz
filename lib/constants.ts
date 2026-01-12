export const INQUIRY_STATUSES = {
  NEW: "new",
  CONTACTED: "contacted",
  CLOSED: "closed",
} as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[keyof typeof INQUIRY_STATUSES];

export const USER_ROLES = {
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

