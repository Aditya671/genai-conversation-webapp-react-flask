
// API Error Message to show if an error occurs (any type erro)
export const errorMessage = "Something went wrong. Please try again later";
// Success Message
export const successMessage = "Api call completed";
// API Endpoint failure Message
export const apiNotWorkingMessage = 'Api seems to be not responding, Please Contact the Administrator'

// Ongoing Month Number (Integer Whole-Number)
export const currentMonthNumber = Number(new Date().getMonth()) === 0 ? 1 : Number(new Date().getMonth() + 1)
export const currentYear = Number(new Date().getFullYear())