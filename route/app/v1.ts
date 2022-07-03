import * as express from "express";
const router = express.Router();

import UserController from "../../controllers/app/user.controller";
import HomeController from "../../controllers/app/home.controller";
import ServiceController from "../../controllers/app/service.controller";
import MsgServiceController from "../../controllers/app/msgservice.controller";
import {
  verifyTokenIsCompleteUserIsReg,
  verifyToken,
  verifyTokenIsCompleteUser,
} from "../../middlewares/app/userAuth";
import { okRes } from "../../helpers/tools";
import { OrderController } from "../../controllers/app/order.controller";

// Auth
router.post(
  "/register",
  ...verifyTokenIsCompleteUser,
  UserController.createNewUser
);
router.get("/verfiyuser", ...verifyTokenIsCompleteUserIsReg, (req, res) => {
  return okRes(res, "ok");
});

// HOME CONTROLLER products
router.get("/categories", HomeController.getCategories);
router.get("/skills", HomeController.getSkills);

// router.get("/methods", HomeController.getMethods);
// router.get("/invoices", ...verifyTokenIsCompleteUserIsReg, HomeController.getInvoices);
// router.post("/uploadImg", HomeController.uploadImg);

// USER CONTROLLER
// router.post("/register", UserController.register);
// // router.post("/otp", UserController.checkOTP);
// router.post("/login", UserController.login);
// router.post("/forgotPassword", UserController.forgotPassword);
// router.post("/newPassword", UserController.newPassword);

router.get("/user/:user", UserController.getUser);
router.post(
  "/editUser",
  ...verifyTokenIsCompleteUserIsReg,
  UserController.editUser
);

router.post(
  "/portfilo",
  ...verifyTokenIsCompleteUserIsReg,
  UserController.createPortfiloItem
);
router.put(
  "/portfilo/:portfiloId",
  ...verifyTokenIsCompleteUserIsReg,
  UserController.editPortfiloItem
);
router.delete(
  "/portfilo/:portfiloId",
  ...verifyTokenIsCompleteUserIsReg,
  UserController.deletePortfiloItem
);

router.get("/portfilo/:portfiloId", UserController.getPortfiloItemById);
router.get("/user/portfilo/:userId", UserController.getPortfiloItemByUserId);

router.get("/skills/:userId", UserController.getSkillsFromUserId);
router.post(
  "/skills",
  ...verifyTokenIsCompleteUserIsReg,
  UserController.addListOfSkills
);
router.delete(
  "/skills",
  ...verifyTokenIsCompleteUserIsReg,
  UserController.deleteListOfSkills
);

// router.get("/portfilo/:portfiloId", UserController.getPortfiloItemById);
// router.get("/user/portfilo/:userId", UserController.getPortfiloItemByUserId);

// Service CONTROLLER
router.get("/service", ServiceController.getServicesByQuery);
router.get("/service/:id", ServiceController.getServiceById);

router.post(
  "/service",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.createService
);
router.put(
  "/service/:id",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.editService
);

router.post(
  "/package/service/:id",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.addPackage
);
router.put(
  "/package/:id",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.editPackage
);
router.delete(
  "/package/:id",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.deletePackage
);
router.delete(
  "/service/:id",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.deleteService
);


//Order service


router.post(
  "/service/order/:serviceId",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.orderService
);
router.get(
  "/service/order/freelancer/:serviceId",
  ...verifyTokenIsCompleteUserIsReg,
  ServiceController.getorderServiceAsFreelancer
);

//Order 

router.post(
  "/order/done/:orderId",
  ...verifyTokenIsCompleteUserIsReg,
  OrderController.doneOrder
);

router.post(
  "/order/cancel/:orderId",
  ...verifyTokenIsCompleteUserIsReg,
  OrderController.cancelOrder
);
router.post(
  "/order/msg/:orderId",
  ...verifyTokenIsCompleteUserIsReg,
  OrderController.sentMsg
);

router.post(
  "/order/rate/:orderId",
  ...verifyTokenIsCompleteUserIsReg,
  OrderController.rate
);


router.get(
  "/order/msg/:orderId",
  ...verifyTokenIsCompleteUserIsReg,
  OrderController.getMsg
);

router.get(
  "/order",
  ...verifyTokenIsCompleteUserIsReg,
  OrderController.getOrders
);




// Service Msg
router.post(
  "/servicemsg/:boxId",
  ...verifyTokenIsCompleteUserIsReg,
  MsgServiceController.sendMsg
);
router.post(
  "/servicebox/:serviceId",
  ...verifyTokenIsCompleteUserIsReg,
  MsgServiceController.createBox
);

router.get(
  "/servicebox/consumer/:serviceId",
  ...verifyTokenIsCompleteUserIsReg,
  MsgServiceController.getBoxsByConsumerIdAndServiceId
);
router.get(
  "/servicebox/freelancer/:serviceId",
  ...verifyTokenIsCompleteUserIsReg,
  MsgServiceController.getBoxsByServiceIdAndFreeLancerId
);
router.get(
  "/servicebox",
  ...verifyTokenIsCompleteUserIsReg,
  MsgServiceController.getBoxsByUserId
);

router.get(
  "/servicemsg/:boxId",
  ...verifyTokenIsCompleteUserIsReg,
  MsgServiceController.getMsgByBoxId
);

// router.post("/invoice", ...verifyTokenIsCompleteUserIsReg, UserController.makeInvoice);
// router.get("/zc/redirect", UserController.zcRedirect);
export default router;
