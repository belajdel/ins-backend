import Role from "../helpers/Role.js";
import db from "../models/index.js";

const Bureau = db.bureau;
import UserController from "./user.controller.js";
import userController from "./user.controller.js";
import {response} from "express";
import axios from "axios";
import {Op} from "sequelize";

class BureauController {
    async create  (req, res){
        try {
            //console.log("hey")
            const {
                name,
                address,
                phone,
                gain_precentage_oblig,
                gain_precentage_travel,
                gain_precentage_third,
                gain_precentage_sante
            } = req.body;

            const {username, password} = req.body.director;
            const director_phone = req.body.director.phone;
            const director_address = req.body.director.address;
            const bureau = await Bureau.create({
                name,
                address,
                phone,
                gain_precentage_oblig,
                gain_precentage_travel,
                gain_precentage_third,
                gain_precentage_sante
            });

            await axios.post(`http://localhost:3000/api/user/add`, {
                username: username,
                password: password,
                role: Role.Director,
                phone: director_phone,
                address: director_address,
                bureauId: bureau.id
            }, {headers: {Authorization: req.headers.authorization}, withCredentials: true}).then(response => {
                Bureau.update({directorId: response.data.id}, {where: {id: bureau.id}})
                res.status(200).json(bureau);
            })

        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getAll(req, res) {
        try {
            const bureaux = await Bureau.findAll();
            res.status(200).json(bureaux);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async search(req, res){
        try{
            const {query} = req.params;
            const columns = Object.keys(Bureau.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: { [Op.like]: `%${query}%` },
            }));
            const bureaux = await Bureau.findAll({where: {[Op.or]: searchConditions}});
            res.status(200).json(bureaux);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getOne(req, res) {
        try {
            const id = req.params.id
            const bureau = await Bureau.findOne({where: {id}, include: [{model: db.user, as: "director"}]});
            res.status(200).json(bureau);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const bureau = await Bureau.update(req.body, {where: {id}});
            res.status(200).json(bureau);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id
            const bureau = await Bureau.destroy({where: {id}});
            res.status(200).json(bureau);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

export default new BureauController;