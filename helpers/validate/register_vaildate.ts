import Validator from "../validation.helper";



export const registerUserVaildate = {
    name :  {
      presence: true,
      type : "string",
      length: { maximum: 100, minimum: 2 },
    },
    picture : {
      presence : false,
    },
    bio : {
      presence: true,
      type : "string",
    }, 
    city: {
      presence: true,
      type : "string",
    },
    ...Validator.skillsArray(false)

  }