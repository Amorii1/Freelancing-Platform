import { VaildateConst } from "./const_valdate";

const newOrder = {
  packagesId: {
    presence: false,
    array: {
      presence: true,
      numericality: true,
    },
  },
};

const newRate = {
  comment :  {
    presence: true,
    type : "string",
    length: { maximum: 500, minimum: 10 },
  },
  rate : {
    numericality: {  greaterThan: 0 , lessThan : 6  },

  }
}
export { newOrder  , newRate};
