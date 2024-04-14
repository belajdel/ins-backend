import {Sequelize, DataTypes} from 'sequelize'
import User from './User.js'
import AssuranceObligatoire from "./AssuranceObligatoire.js";
import Travel from "./Travel.js";
import Bureau from "./Bureau.js";
import Debt from "./Debt.js";
import SantePersonne from "./SantePersonne.js";
import SanteGroupe from "./SanteGroupe.js";
import ThirdInstance from "./ThirdInsurance.js";

const env = process.env.NODE_ENV;
import Config from "../config/config.js";

let config= Config["development"];
if(env === "production"){
    config= Config[process.env.NODE_ENV];
}
else if(env === "test"){
    config= Config["test"];
}
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,

    /* pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    } */
})


const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.user = User(sequelize, DataTypes)
db.assuranceOblig = AssuranceObligatoire(sequelize, DataTypes)
db.travel = Travel(sequelize, DataTypes)
db.bureau = Bureau(sequelize, DataTypes)
db.santeGroupe = SanteGroupe(sequelize, DataTypes)
db.santePersonne = SantePersonne(sequelize, DataTypes)
db.debt = Debt(sequelize, DataTypes)
db.thirdInsurance=ThirdInstance(sequelize, DataTypes)

//un directeur a plusieurs utilisateurs et un administrateur a plusieurs directeurs
db.user.hasMany(db.user, {
    foreignKey: "hypervisorId",
});
db.user.belongsTo(db.user, {
    foreignKey: "hypervisorId",
});

//un bureau a plusieurs utilisateurs
db.bureau.hasMany(db.user, {
    foreignKey: "bureauId",
    as: "bureau-users"
});
db.user.belongsTo(db.bureau, {
    foreignKey: "bureauId",
    as: "bureau"
});

//un voyage est crée par un seul utilisateur
db.user.hasMany(db.travel, {
    foreignKey: "userId",
    as: "user-travels"
});
db.travel.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un assurance de type personne est crée par un seul utilisateur
db.user.hasMany(db.santePersonne, {
    foreignKey: "userId",
    as: "user-assurances-personne"
});
db.santePersonne.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un assurance de type groupe est crée par un seul utilisateur
db.user.hasMany(db.santeGroupe, {
    foreignKey: "userId",
    as: "user-assurances-group"
});
db.santeGroupe.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

//un bureau a un seul directeur
db.user.hasOne(db.bureau, {
    foreignKey: "directorId",
    as: "bureau-director"
});
db.bureau.belongsTo(db.user, {
    foreignKey: "directorId",
    as: "director"
});

//assurance obligatoire est crée par un utilisateur et un
db.user.hasMany(db.assuranceOblig, {
    foreignKey: "userId",
    as: "user-assurances-obligatoire"
});
db.assuranceOblig.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});


//un bureau a plusieurs debts
db.bureau.hasMany(db.debt, {
    foreignKey: "bureauId",
    as: "bureau-debts"
});
//un debt est crée par un seul bureau
db.debt.belongsTo(db.bureau, {
    foreignKey: "bureauId",
    as: "debt-bureau"
});

//un voyage est crée par un seul utilisateur
db.user.hasMany(db.thirdInsurance, {
    foreignKey: "userId",
    as: "user-third-insurances"
});
db.thirdInsurance.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});


//exporting the module
export default db