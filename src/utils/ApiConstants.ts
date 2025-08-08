export const AUTH_BASE = "/auth";
export const COMPANY = "/company"
export const CART = "/cart"
export const SERVICES = "/subscriptionPlan"
export const USER_ENDPOINT = {
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
  CLINIC: `${AUTH_BASE}/clinic`,
  BANK_ACCOUNT: `${AUTH_BASE}/bank-account`,
  AVAILABILITY: `${AUTH_BASE}/availability`,
  SUBSCRIPTION: `${AUTH_BASE}/subscription`,
  TERMS_AND_CONDITIONS: `${AUTH_BASE}/terms-and-conditions`,
  PROFILE_FINALIZATION: `${AUTH_BASE}/profile-finalization`,

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
  GET_NOTIFICATION: "/notification",
  READ_NOTIFICATION: "/notification/mark-read"
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
