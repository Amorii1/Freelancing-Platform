import { isEmpty } from "validate.js";
import validate = require("validate.js");
import { constVal } from "./const_val";
import { VaildateConst } from "./validate/const_valdate";
/**
 *
 */
export default class Validator {
  //import each element without *

  /**
   *
   * @param must
   */

  static editUser = (must = false) => ({
    newName: {
      presence: must,
      format: {
        pattern: "[a-z0-9]+",
        flags: "i",
        message: "can only contain a-z and 0-9",
      },
      type: "string",
    },
  });

  static editNumber = (must = false) => ({
    newPhone: {
      presence: must,
      type: "string",
      length: { maximum: 15, minimum: 10 },
    },
  });

  /**
   *
   * @param must: boolean
   */
  //   static makeInvoice = (must = true) => ({
  //     address: {
  //       presence: must,
  //       type: "string",
  //     },
  //     method: {
  //       presence: must,
  //       type: "string",
  //       inclusion: {
  //         within: {
  //           zc: "zc",
  //           ah: "ah",
  //           cd: "cd",
  //         },
  //         message: "^%{value} is not valid",
  //       },
  //     },
  //     long: {
  //       presence: must,
  //       type: "string",
  //     },
  //     lat: {
  //       presence: must,
  //       type: "string",
  //     },
  //     products: {
  //       presence: must,
  //       type: "array",
  //     },
  //   });

  /**
   *
   * @param must: boolean
   */
  static oneProduct = (must = true) => ({
    id: {
      presence: must,
      type: "number",
    },
    quantity: {
      presence: must,
      type: "number",
    },
  });

  /**
   *
   * @param must
   */
  //   static zcMethod=(must=true)=>({
  //     walletNumber: {
  //       presence: must,
  //       type: "string",
  //       length: { maximum: 15, minimum: 10 },
  //     },
  //     pin:{
  //       presence:must,
  //       type:"number",
  //     },
  //     otp: {
  //       presence: must,
  //       type: "number",
  //     }

  //   })

  /**
   *
   * @param must
   */

  static newService = (must = true) => ({
    title: {
      presence: must,
      ...VaildateConst.title,
    },
    description: {
      presence: must,
      ...VaildateConst.description,
    },
    duration: {
      presence: must,
      type: "number",
    },
    cost: {
      presence: must,
      ...VaildateConst.cost,
    },
    categoryId: {
      presence: must,
      type: "number",
    },
    images: {
      type: "array",
      array: {
        presence: true,
        url: true,
      },
    },
    packages: {
      presence: false,
      type: "array",
      arrayObj: {
        // presence: true,
        description: {
          presence: must,
          ...VaildateConst.descriptionPackage,
        },
        moreCost: {
          presence: must,
          numericality: { divisibleBy: 1000, greaterThan: 5000 },
        },
        moreDuration: {
          presence: false,
          type: "number",
        },
      },
    },
  });

  /**
   *
   * @param must
   */
  static editService = (must = false) => ({
    description: {
      presence: must,
      ...VaildateConst.description,
    },
    title: {
      presence: must,
      type: "string",
      length: { maximum: 500, minimum: 15 },
    },
    duration: {
      presence: must,
      type: "number",
    },
    cost: {
      presence: must,
      ...VaildateConst.cost,
    },
    categoryId: {
      presence: must,
      type: "number",
    },
    images: {
      presence: false,
      array: {
        presence: false,
        url: true,
      },
    },
    isReciving: {
      presence: false,
      type: "boolean",
    },
  });

  /**
   *
   * @param must
   */
  static newPackage = (must = true) => ({
    packages: {
      presence: must,
      type: "array",
      arrayObj: {
        description: {
          presence: must,
          ...VaildateConst.descriptionPackage,
        },
        moreCost: {
          presence: must,
          ...VaildateConst.cost,
        },
        moreDuration: {
          presence: false,
          ...VaildateConst.duration,
        },
      },
    },
  });

  /**
   *
   * @param must
   */
  static editPackage = (must = true) => ({
    description: {
      presence: false,
      type: "string",
      ...VaildateConst.title,
    },
    moreCost: {
      presence: false,
      ...VaildateConst.cost,
    },
    moreDuration: {
      presence: false,
      ...VaildateConst.duration,
    },
  });

  /**
   *
   * @param must
   */
  static newPortfiloItem = (must = true) => ({
    title: {
      presence: must,
      ...VaildateConst.title,
    },
    description: {
      presence: must,
      ...VaildateConst.description,
    },

    images: {
      type: "array",
      array: {
        presence: true,
        url: true,
      },
    },
    link: {
      presence: false,
      url: true,
    },
  });

  /**
   *
   * @param must
   */
  static skillsArray = (must = true) => ({
    skills: {
      type: "array",
      presence: must,
      array: {
        presence: true,
        type: "string",
      },
    },
  });

  /**
   *
   * @param must
   */

  static editPortfiloItem = (must = false) => ({
    title: {
      presence: must,
      ...VaildateConst.title,
    },
    description: {
      presence: must,
      ...VaildateConst.description,
    },

    images: {
      presence: false,
      array: {
        presence: false,
        url: true,
      },
    },

    link: {
      presence: false,
      url: true,
    },
  });

  /**
   *
   */

  static queryService = (must = false) => ({
    text: {
      presence: must,
      type: "string",
      length: { maximum: 500, minimum: 5 },
    },
    costfrom: {
      presence: must,
      numericality: {
        maximum: constVal.maxcost - constVal.mincost,
        minimum: constVal.mincost,
      },
    },
    costto: {
      presence: must,

      numericality: {
        maximum: constVal.maxcost,
        minimum: constVal.mincost * 2,
      },
    },
    rate: {
      presence: must,
      numericality: true,
    },
    categoryid: {
      presence: must,
      numericality: true,
    },
    subcategoryids: {
      presence: must,
      array: {
        presence: true,
        numericality: true,
      },
    },
  });

  static newOrder = (must = false) => ({
    cost: {
      presence: must,
      numericality: true,
    },
    duration: {
      presence: must,
      numericality: true,
    },
  });
}

/**
 *
 * @param arrayItems
 * @param itemConstraints
 */

validate.validators.array = (arrayItems, itemConstraints) => {
  if (isEmpty(arrayItems)) return null;
  const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
    const error = validate({ data: item }, { data: itemConstraints });

    if (error) errors[item] = error["data"];
    return errors;
  }, {});

  return isEmpty(arrayItemErrors) ? null : arrayItemErrors;
};

validate.validators.arrayObj = (arrayItems, itemConstraints) => {
  if (!arrayItems) return null; 
  const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
    const error = validate(item, itemConstraints);
    if (error) errors[index] =  error;
    return errors;
  }, {});
  return isEmpty(arrayItemErrors) ? null : arrayItemErrors;
};


