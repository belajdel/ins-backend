import db from "../models/index.js";
import {Op} from "sequelize";
import User from "../models/User.js";
const AssuranceObligatoire = db.assuranceOblig;

class AssuranceObligatoireController{
    async create(req, res){
        try{
            const assurance = await AssuranceObligatoire.create(req.body);
            res.status(200).json(assurance);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async getAll(req, res){
        try{
            const assurances = await AssuranceObligatoire.findAll();
            res.status(200).json(assurances);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getAllByBureau(req, res) {
        try {
            const bureauId = req.params.id;
            const assurances = await AssuranceObligatoire.findAll({
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
            const assurances = await AssuranceObligatoire.findAll({where:{userId}})
            res.status(200).json(assurances);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async search(req, res){
        try{
            const {query} = req.params;
            const columns = Object.keys(AssuranceObligatoire.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const assurances = await AssuranceObligatoire.findAll({where: {[Op.or]: searchConditions}});
            res.status(200).json(assurances);
        }catch(err){
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
                const assurances = await AssuranceObligatoire.findAll({
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
    async getOne(req, res){
        try{
            const id=req.params.id
            const assurance = await AssuranceObligatoire.findOne({where: {id}});
            res.status(200).json(assurance);
        }catch(err){
            res.status(500).json(err);
        }
    }


    async update(req, res){
        try{
            const id = req.params.id;
            const assurance = await AssuranceObligatoire.update(req.body, {where: {id}});
            res.status(200).json(assurance);
        }catch(err){
            res.status(500).json(err);
        }
    }
    async delete(req, res){
        try{
            const id=req.params.id
            const assurance = await AssuranceObligatoire.destroy({where: {id}});
            res.status(200).json(assurance);
        }catch(err){
            res.status(500).json(err);
        }
    }
}

export default new AssuranceObligatoireController;