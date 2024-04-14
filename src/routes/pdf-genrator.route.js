import PdfGenratorController from "../controllers/pdf-generator.controller.js";
import express from "express";


const router = express.Router();

router.post("/create-pdf",PdfGenratorController.generate);
router.get("/fetch-pdf", PdfGenratorController.fetch);

export default router;