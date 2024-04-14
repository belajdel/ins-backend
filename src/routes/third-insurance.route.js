import ThirdInsurance from "../controllers/third-insurance.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

//router.use(verifyJWT);
router.post("/add",Authorize([Role.Admin,Role.Director,Role.User]), ThirdInsurance.create);
router.get("/getall",Authorize([Role.Admin,Role.Director,Role.User]), ThirdInsurance.getAll);
router.get("/getallbybureau/:id", ThirdInsurance.getAllByBureau);
router.get("/getallbyuser/:id", ThirdInsurance.getAllByUser);
router.post("/rapport", ThirdInsurance.rapport);
router.get("/search/:query", ThirdInsurance.search);
router.get("/pdf/:id", ThirdInsurance.generatePdf);
router.get("/getone/:id",Authorize([Role.Admin,Role.Director,Role.User]), ThirdInsurance.getOne);
router.put("/update/:id",Authorize([Role.Admin,Role.Director,Role.User]), ThirdInsurance.update);
router.delete("/delete/:id",Authorize([Role.Admin,Role.Director,Role.User]), ThirdInsurance.delete);


export default router;