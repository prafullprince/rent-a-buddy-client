// baseUrl
const BASE_URL = "http://localhost:4000/api";

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
    RESET_PASSWORD: BASE_URL + "/auth/resetPassword"
}

// Event
export const eventEndPoints = {
    GET_INFINTE_EVENTS_FILTERS: BASE_URL + "/event/infinteEventsWithFilter",
    CREATE_EVENT: BASE_URL + "/event/createEvent",
    CREATE_SERVICE: BASE_URL + "/event/createService",
}

// category
export const categoryEndPoints = {
    FETCH_ALL_CATEGORY: BASE_URL + "/category/getAllCategory",
    FETCH_CATEGORY_SUBCATEGORY: BASE_URL + "/category/fetchCategorySubCategory",
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
    GET_USER_DETAILS: BASE_URL + "/auth/getUserDetails",
    PROFILE_PIC: BASE_URL + "/auth/uploadPic",
    GET_USER_BY_ID: BASE_URL + "/auth/getUserDetailsByUserId",
    CONNECTION: BASE_URL + "/auth/follow",
    GET_OTHER_COURSES: BASE_URL + "/auth/getUserCourses",
    GET_LOGGED_USER_COURSES: BASE_URL + "/auth/getLoggedUserCourses"
}


// chat
export const chatEndPoints = {
    CREATE_CHAT: BASE_URL + "/course/createChat",
    FETCH_CHAT: BASE_URL + "/course/fetchChat"
}
