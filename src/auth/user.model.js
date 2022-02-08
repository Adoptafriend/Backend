import pkg from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const { DataTypes, Model } = pkg;

class User extends Model {
  async isValidPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "user",
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        // eslint-disable-next-line no-param-reassign
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        // eslint-disable-next-line no-param-reassign
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

export default User;
