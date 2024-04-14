import express from 'express';
import SantePersonneController from '../controllers/santePersonne.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

//router.use(verifyJWT);
router.post('/add', SantePersonneController.create);
router.get('/getall', SantePersonneController.getAll);
router.get("/getallbybureau/:id", SantePersonneController.getAllByBureau);
router.get("/getallbyuser/:id", SantePersonneController.getAllByUser);
router.get("/search/:query", SantePersonneController.search);
router.post("/rapport", SantePersonneController.rapport);
router.get('/pdf/:id', SantePersonneController.generatePdf);
router.get('/getone/:id', SantePersonneController.getOne);
router.put('/update/:id', SantePersonneController.update);
router.delete('/delete/:id', SantePersonneController.delete);

export default router;