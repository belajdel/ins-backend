import AssuranceObligatoireController from "../controllers/asssuranceObligatoire.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

//router.use(verifyJWT);

router.post("/add", AssuranceObligatoireController.create);
router.get("/getall", AssuranceObligatoireController.getAll);
router.get("/getallbybureau/:id", AssuranceObligatoireController.getAllByBureau);
router.get("/getallbyuser/:id", AssuranceObligatoireController.getAllByUser);
router.get("/search/:query", AssuranceObligatoireController.search);
router.post("/rapport", AssuranceObligatoireController.rapport);
router.get("/getone/:id", AssuranceObligatoireController.getOne);
router.put("/update/:id", AssuranceObligatoireController.update);
router.delete("/delete/:id", AssuranceObligatoireController.delete);

export default router;