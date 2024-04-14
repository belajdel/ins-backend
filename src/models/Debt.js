const Debt = (sequelize, DataTypes) => {
    const Debt = sequelize.define("debt", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            state: {
                type:DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            paidAmount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            remainingAmount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
        },
        {
            tableName: "debts"
        }
    );
    return Debt;
}

export default Debt;