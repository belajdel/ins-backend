import db from "../models/index.js";
import {Op} from "sequelize";
import {PdfGenerator} from "../helpers/pdfGenerator.js";
const SantePersonne = db.santePersonne;

class SantePersonneController{
    async create(req, res){
        try{
            const sante = await SantePersonne.create(req.body);
            res.status(201).json(sante);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async getAll(req, res){
        try{
            const santes = await SantePersonne.findAll();
            res.status(200).json(santes);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getAllByBureau(req, res) {
        try {
            const bureauId = req.params.id;
            const assurances = await SantePersonne.findAll({
                include: [{
                    model: db.user,
                    as: "user",
                    where: {bureauId},
                    include: [{model: db.bureau, as: "bureau"}]
                },]
            })
            res.status(200).json(assurances);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getAllByUser(req, res) {
        try {
            const userId = req.params.id;
            const assurances = await SantePersonne.findAll({where:{userId}})
            res.status(200).json(assurances);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async rapport(req,res){
        try{
            const searchColumns=[]
            Object.keys(req.body).forEach((key)=> {
                if(req.body[key]!=null && key!=="startDate" && key!=="endDate" && key!=="bureauId"){
                    searchColumns.push({[key]:req.body[key]},)
                }
            })
            if(req.body.startDate!=null && req.body.endDate!=null){
                searchColumns.push({startDate: {[Op.between]: [req.body.startDate, req.body.endDate]}},)
            }
            let searchConditions={};
            if(req.body.bureauId!=null){
                searchConditions={bureauId:req.body.bureauId}
            }
            if(searchColumns.length===0 && Object.keys(searchConditions).length===0){
                res.status(200).json([])
            }
            else{
                const assurances = await SantePersonne.findAll({
                    where: {[Op.and]: searchColumns},
                    include: [{
                        model: db.user,
                        as: "user",
                        where: [searchConditions],
                        include: [{model: db.bureau, as: "bureau"}]
                    },]
                });
                res.status(200).json(assurances);
            }
        }catch(err){
            res.status(500).json(err);
        }
    }

    async search(req, res){
        try{
            const {query} = req.params;
            const columns = Object.keys(SantePersonne.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const assurancesPerssone = await SantePersonne.findAll({where: {[Op.or]: searchConditions}});
            res.status(200).json(assurancesPerssone);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getOne(req, res){
        try{
            const id=req.params.id
            const sante = await SantePersonne.findOne({where: {id}});
            res.status(200).json(sante);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async update(req, res){
        try{
            const id = req.params.id;
            const sante = await SantePersonne.update(req.body, {where: {id}});
            res.status(200).json(sante);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async delete(req, res){
        try{
            const id=req.params.id
            const sante = await SantePersonne.destroy({where: {id}});
            res.status(200).json(sante);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async generatePdf(req, res){
        try{
            const id=req.params.id
            const sante = await SantePersonne.findOne({where: {id:id},include: [{
                    model: db.user,
                    as: "user",
                    include: [{model: db.bureau, as: "bureau"}]
                },]});
            const data = {
                id: sante.dataValues.id,
                bureau: sante.dataValues.user.dataValues.bureau.dataValues.name,
                today:new Date().toLocaleDateString().split('/').reverse().join('-'),
                startDate: sante.dataValues.startDate,
                endDate: sante.dataValues.endDate,
                name: sante.dataValues.name,
                address: sante.dataValues.address,
                numero_tele: sante.dataValues.numero_tele,
                job: sante.dataValues.job,
                numero_passport: sante.dataValues.numero_passport,
                initiale: sante.dataValues.initiale,
                taxe1: sante.dataValues.taxe1,
                taxe2: sante.dataValues.taxe2,
                taxe3: sante.dataValues.taxe3,
                taxe4: sante.dataValues.taxe4,
                total: sante.dataValues.total,
            }
            const generator = new PdfGenerator()
            const pdf = await generator.execute("./src/views/assurance-sante-personne.html", data)
            res.contentType("application/pdf");
            res.send(pdf)
        }catch(err){
            res.status(500).json(err);
        }
    }
}

export default new SantePersonneController;