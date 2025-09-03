export const AUTH_BASE = "/api/v1/auth";
export const ONBOARDING_BASE = "/api/v1/onboarding";
export const APPOINTMENTS_BASE = "/api/v1/appointments";
export const COMPANY = "/company";
export const CART = "/cart";
export const SERVICES = "/subscriptionPlan";
export const DASHBOARD_BASE = "/api/v1/dashboard";
export const NOTIFICATIONS_BASE = "/api/v1/notifications";
export const USERS_BASE = "/api/v1/users";
export const DENTIST_ENDPOINT = {
  // Auth_BASE
  LOGIN: `${AUTH_BASE}/login`,
  REGISTER: `${AUTH_BASE}/register`,
  SIGN_IN: `${AUTH_BASE}/sign-in`,
  FORGET_PASSWORD: `${AUTH_BASE}/forgot-password`,
  VERIFY_OTP: `${AUTH_BASE}/verify-otp`,
  RESET_PASSWORD: `${AUTH_BASE}/reset-password`,
  UPDATE_PROFILE: "user/profile",
  CHANGE_PASSWORD: "/user/change-password",

  // Onboarding
  CLINIC: `${ONBOARDING_BASE}/clinic`,
  BANK_ACCOUNT: `${ONBOARDING_BASE}/bank-account`,
  AVAILABILITY: `${ONBOARDING_BASE}/availability-timings`,
  GET_SUBSCRIPTION_PLANS: `${ONBOARDING_BASE}/subscription-plans/get-all`,
  SELECT_SUBSCRIPTION_PLAN: `${ONBOARDING_BASE}/subscription-plans/select`,
  TERMS_AND_CONDITIONS: `${ONBOARDING_BASE}/terms-agreement`,
  DOCUMENT_UPLOAD: `${ONBOARDING_BASE}/upload-documents`,
  PROFILE_FINALIZATION: `${ONBOARDING_BASE}/profile-finalization`,

  // Appointments
  TODAY_APPOINTMENTS: `${APPOINTMENTS_BASE}/today`,
  CONFIRM_APPOINTMENT: `${APPOINTMENTS_BASE}/confirmation`,
  UPDATE_APPOINTMENT_AVAILABILITY: `${APPOINTMENTS_BASE}/set-availability`,

  // Dashboard
  GET_DASHBOARD: `${DASHBOARD_BASE}/`,

  // User Subscription
  USER_SUBSCRIPTION: `${APPOINTMENTS_BASE}/user-subscription`,

  // Authenticate User routes endpoint
  ACTIVITY: `/activity`,
  COMPANY_SETUP: `${COMPANY}/set-up`,
  UPDATE_COMPANYDATA: '/company',
  DOCUMENT: '/document',
  REQUIRED_DOCUMENT: '/document/required-documents',
  SUMMARY: `${COMPANY}/summary`,
  FORMATION: `${COMPANY}/formation-status`,
  COMPANY_DETAILS: `${COMPANY}/details`,

  //CART
  GET_CART: `${CART}`,
  ADD_CART: `${CART}/add`,
  REMOVE_FROM_CART: `${CART}/remove`,

  //Services 
  GET_SERVICES: `${SERVICES}`,
  GET_VISA_FEE: `${SERVICES}/calculate-fee`,
  //Initital Plans
  GET_PLANS: `${SERVICES}/get-plans`,

  //Orders Get Service and subscription
  PURCHASED_SERVICES: "/order",
  DISTINCT_SERVICES: "/order/distinct",
  PAYMENT_CHECKOUT: "/payment/create-checkout-session",
  
  //Notification
  GET_NOTIFICATIONS: `${NOTIFICATIONS_BASE}/get-all`,
  MARK_READ_NOTIFICATION: `${NOTIFICATIONS_BASE}/mark-read/`,
  MARK_ALL_READ_NOTIFICATION: `${NOTIFICATIONS_BASE}/mark-all-read`,

  //User
  GET_DENTIST_PROFILE: `${USERS_BASE}/dentist-profile`
};

const ADMIN_BASE = "/admin"
export const ADMIN_ENDPOINT = {
  GET_USERS: `${ADMIN_BASE}/get-users`,
  GET_USER_INFO: `${ADMIN_BASE}/user-info`,
  GET_SERVICES: `${ADMIN_BASE}/get-services`,
  ADD_SERVICES: `${ADMIN_BASE}/add-service`,
  SERVICE: `${ADMIN_BASE}/service`,
  //Documents
  APPROVE_DOCUMENT: `${ADMIN_BASE}/approve-document`,
  REJECT_DOCUMENT: `${ADMIN_BASE}/reject-document`,
  UPLOAD_DOCUMENT: `${ADMIN_BASE}/upload-document`,
  //Assign CompanyName
  ASSIGN_COMPANY_NAME: `${ADMIN_BASE}/assign-company-name`,
  CHECK_COMPANY_NAME: `${ADMIN_BASE}/check-company-name`
}
