import db from "../models/index.js";
import {Op} from "sequelize";
import {PdfGenerator} from "../helpers/pdfGenerator.js";
const ThirdInsurance = db.thirdInsurance;

class ThirdInsuranceController {
    async create(req, res){
        try{
            const third_insurance = await ThirdInsurance.create(req.body);
            res.status(200).json(third_insurance);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async getAll(req, res){
        try{
            const third_insurances = await ThirdInsurance.findAll();
            res.status(200).json(third_insurances);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getAllByBureau(req, res) {
        try {
            const bureauId = req.params.id;
            const assurances = await ThirdInsurance.findAll({
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
            const assurances = await ThirdInsurance.findAll({where:{userId}})
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
                const assurances = await ThirdInsurance.findAll({
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
            const columns = Object.keys(ThirdInsurance.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const thirdInsurances = await ThirdInsurance.findAll({where: {[Op.or]: searchConditions}});
            res.status(200).json(thirdInsurances);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getOne(req, res){
        try{
            const id=req.params.id
            const third_insurance = await ThirdInsurance.findOne({where: {id}});
            res.status(200).json(third_insurance);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async update(req, res){
        try{
            const id = req.params.id;
            const third_insurance = await ThirdInsurance.update(req.body, {where: {id}});
            res.status(200).json(third_insurance);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async delete(req, res){
        try{
            const id=req.params.id
            const third_insurance = await ThirdInsurance.destroy({where: {id}});
            res.status(200).json(third_insurance);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async generatePdf(req, res){
        try{
            const id=req.params.id
            const thirdInsurance = await ThirdInsurance.findOne({where: {id:id},include: [{
                    model: db.user,
                    as: "user",
                    include: [{model: db.bureau, as: "bureau"}]
                },]});
            const data = {
                id: thirdInsurance.dataValues.id,
                bureau: thirdInsurance.dataValues.user.dataValues.bureau.dataValues.name,
                today:new Date().toLocaleDateString().split('/').reverse().join('-'),
                startDate: thirdInsurance.dataValues.startDate,
                endDate: thirdInsurance.dataValues.endDate,
                name: thirdInsurance.dataValues.name,
                address: thirdInsurance.dataValues.address,
                phone_number: thirdInsurance.dataValues.phone_number,
                driver_name: thirdInsurance.dataValues.driver_name,
                driver_address: thirdInsurance.dataValues.driver_address,
                type_car: thirdInsurance.dataValues.type_car,
                numero_serie: thirdInsurance.dataValues.numero_serie,
                numero_structure: thirdInsurance.dataValues.numero_structure,
                numero_moteur: thirdInsurance.dataValues.numero_moteur,
                Charge: thirdInsurance.dataValues.Charge,
                nb_passager: thirdInsurance.dataValues.nb_passager,
                annee_de_fabrication: thirdInsurance.dataValues.annee_de_fabrication,
                couleur: thirdInsurance.dataValues.couleur,
                Pays_de_fabrication: thirdInsurance.dataValues.Pays_de_fabrication,
                Orga_de_delivr: thirdInsurance.dataValues.Orga_de_delivr,
                endurance: thirdInsurance.dataValues.endurance,
                initial: thirdInsurance.dataValues.initial,
                alltaxes: thirdInsurance.dataValues.taxe1,
                total: thirdInsurance.dataValues.total,
            }
            const generator = new PdfGenerator()
            const pdf = await generator.execute("./src/views/assurance-troisieme-personne.html", data)
            res.contentType("application/pdf");
            res.send(pdf)
        }catch(err){
            res.status(500).json(err);
        }
    }
}

export default new ThirdInsuranceController;