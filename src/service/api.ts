
// baseUrl
const BASE_URL = "https://rent-a-buddy-server-1.onrender.com/api";

// service
// chatpage
// chatSidebar

// https://rent-a-buddy-server-1.onrender.com/api

// https://studyforge.onrender.com/api/v1
// "http://localhost:4000/api/v1"
// https://study-forge.onrender.com
// "https://study-hub-2.onrender.com/api/v1"

// auth
export const authEndPoints = {
    SIGNUP: BASE_URL + "/auth/signup",
    LOGIN: BASE_URL + "/auth/login",
    SEND_OTP: BASE_URL + "/auth/sendotp",
    CHANGE_PASSWORD: BASE_URL + "/auth/changePassword",
    RESET_PASSWORD_TOKEN: BASE_URL + "/auth/resetPasswordToken",
    RESET_PASSWORD: BASE_URL + "/auth/resetPassword",
    GET_USER_DETAILS: BASE_URL + "/auth/getUser",
}

// Event
export const eventEndPoints = {
    GET_INFINTE_EVENTS_FILTERS: BASE_URL + "/event/infinteEventsWithFilter",
    CREATE_EVENT: BASE_URL + "/event/createEvent",
    CREATE_SERVICE: BASE_URL + "/event/createService",
    EVENT_SUMMARY: BASE_URL + "/event/getEventSummary",
    PUBLISH_EVENT: BASE_URL + "/event/published",
    EVENT_SUMMARY_OF_USER: BASE_URL + "/event/getEventSummaryOfUser",
    EDIT_EVENT: BASE_URL + "/event/editEvent",
    EVENT_BY_ID: BASE_URL + "/event/getEventById",
    ALL_EVENTS: BASE_URL + "/event/availableEvents",
    MARK_AS_ACTIVE_INACTIVE: BASE_URL + "/event/markAsActiveInactive",
}

// category
export const categoryEndPoints = {
    FETCH_ALL_CATEGORY: BASE_URL + "/category/getAllCategory",
    FETCH_CATEGORY_SUBCATEGORY: BASE_URL + "/category/fetchCategorySubCategory",
}

// payment
export const paymentEndPoints = {
    CREATE_ORDER: BASE_URL + "/payment/createOrder",
    VERIFY_PAYMENT: BASE_URL + "/payment/verifyPayments",
    SEND_MONEY: BASE_URL + "/payment/sendMoney",
    GET_USER_WALLET: BASE_URL + "/payment/getUserWallet"
}

// extra
export const extraEndPoints = {
    SEARCH_COURSE: BASE_URL + "/course/searchCourse",
    VIEWS: BASE_URL + "/course/totalViews",
    NOTIFICATION: BASE_URL + "/course/notifications",
    MARK_AS_READ: BASE_URL + "/course/markAsReadNot",
    ALL_NOTIFICATION: BASE_URL + "/course/allNotifications",
    SEARCH_RESULT: BASE_URL + "/course/searchResult"
}

// rating
export const ratingEndPoints = {
    CREATE_RATING: BASE_URL + "/course/createRating",
    AVG_RATING: BASE_URL + "/course/getAverageRating"
}

// profile
export const profileEndpoints = {
    GET_USER_DETAILS_BY_ID: BASE_URL + "/user/userDetailsById",
    UPLOAD_PROFILE_PICTURE: BASE_URL + "/user/updateProfilePicture",
    UPDATE_PROFILE: BASE_URL + "/user/updateProfile",
}


// chat
export const chatEndPoints = {
    CREATE_CHAT: BASE_URL + "/course/createChat",
    FETCH_CHAT: BASE_URL + "/chat/fetchChat",
    FETCH_MESSAGE: BASE_URL + "/chat/fetchAllMessages",
    FETCH_OTHER_USER: BASE_URL + "/chat/fetchOtherUser",
    FETCH_ORDERS_CHAT: BASE_URL + "/chat/fetchOrdersOfChat",
    VERIFY_OTP: BASE_URL + "/chat/verifyOtp",
}
