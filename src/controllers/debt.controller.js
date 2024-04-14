import db from "../models/index.js";
import {Op, Sequelize} from "sequelize";

const Debt = db.debt;

class DebtController {
    async create(req, res) {
        try {
            const debt = await Debt.create(req.body);
            res.status(200).json(debt);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getAll(req, res) {
        try {
            const debts = await Debt.findAll();
            res.status(200).json(debts);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async search(req, res) {
        try {
            const {query} = req.params;
            const columns = Object.keys(Debt.rawAttributes);
            const searchConditions = columns.map((column) => ({
                [column]: {[Op.like]: `%${query}%`},
            }));
            const debts = await Debt.findAll({where: {[Op.between]: searchConditions}});
            res.status(200).json(debts);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async searchPaidDebtsBetween(req, res) {
        try {
            const {startDate, endDate} = req.body;

            const sum = await Debt.sum('paidAmount',{
                where: {
                    [Op.and]: [
                        {startDate: {[Op.between]: [startDate, endDate]}},
                        {endDate: {[Op.between]: [startDate, endDate]}},
                        {state:1}
                    ]
                }
            });
            res.status(200).json(sum);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getOne(req, res) {
        try {
            const id = req.params.id;
            const debt = await Debt.findOne({where: {id}});
            res.status(200).json(debt);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const debt = await Debt.update(req.body, {where: {id}});
            res.status(200).json(debt);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const debt = await Debt.destroy({where: {id}});
            res.status(200).json(debt);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

export default new DebtController;