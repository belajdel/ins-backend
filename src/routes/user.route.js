import UserController from "../controllers/user.controller.js";
import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import Authorize from "../middleware/Authorize.js";
import Role from "../helpers/Role.js";

const router = express.Router();

//router.use(verifyJWT);
router.post("/add"/*,Authorize([Role.Admin,Role.Director])*/ , UserController.create);
router.get("/getall"/*,Authorize([Role.Admin])*/, UserController.getAll);
router.get("/getallbybureau/:id"/*,Authorize([Role.Admin,Role.Director])*/, UserController.getAllByBureau);
router.get("/search/:query", UserController.search);
router.post("/search-by-bureau/:query", UserController.searchByBureau);
router.get("/getone/:id", UserController.getOne);
router.put("/update/:id", UserController.update);
router.delete("/delete/:id", UserController.delete);

export default router;