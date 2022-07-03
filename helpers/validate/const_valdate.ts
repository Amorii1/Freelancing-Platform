export class VaildateConst {
  static cost = {
    numericality: { divisibleBy: 1000, greaterThan: 4999 , },
  };
  static duration = {
    type: "number",
    numericality: { greaterThan: 0 },
  };

  static title= {
    type: "string",
    length: { maximum: 500, minimum: 50 },
  } ;

  static descriptionPackage= {
    type: "string",
    length: { maximum: 500, minimum: 10 },
  } ;

static  description =  {
    type: "string",
    length: { maximum: 4000, minimum: 200 },
  };
}
