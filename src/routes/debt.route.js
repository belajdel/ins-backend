import DebtController from "../controllers/debt.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

//router.use(verifyJWT);
router.post("/add", DebtController.create);
router.get("/getall", DebtController.getAll);
router.post("/searchpaiddebtsbetween", DebtController.searchPaidDebtsBetween);
router.get("/search/:query", DebtController.search);
router.get("/getone/:id", DebtController.getOne);
router.put("/update/:id", DebtController.update);
router.delete("/delete/:id", DebtController.delete);

export default router