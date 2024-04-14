import BureauController from "../controllers/bureau.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

//router.use(verifyJWT);
router.post("/add"/*,Authorize([Role.Admin])*/, BureauController.create);
router.get("/getall",Authorize([Role.Admin,Role.Director,Role.User,Role.Finance]), BureauController.getAll);
router.get("/search/:query", BureauController.search);
router.get("/getone/:id"/*,Authorize([Role.Admin,Role.Director,Role.User])*/, BureauController.getOne);
router.put("/update/:id",Authorize([Role.Admin]), BureauController.update);
router.delete("/delete/:id",Authorize([Role.Admin]), BureauController.delete);


export default router;