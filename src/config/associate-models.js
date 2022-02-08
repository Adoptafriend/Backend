import Pallet from "../warehouse/shared/pallet.model.js";
import Box from "../warehouse/shared/box.model.js";
import Warehouse from "../warehouse/warehouse.model.js";
import StorageLocation from "../warehouse/locations/storage-location.model.js";
import Employee from "../employee/employee.model.js";
import Role from "../employee/role.model.js";
import User from "../auth/user.model.js";
import Address from "../shared/address/address.model.js";
import Activity from "../warehouse/activity/activity.model.js";

async function associateModels() {
  Address.hasOne(Warehouse);
  Warehouse.belongsTo(Address);
  Address.hasMany(Employee);
  Employee.belongsTo(Address);
  Warehouse.hasMany(StorageLocation);
  StorageLocation.belongsTo(Warehouse);
  StorageLocation.hasOne(Pallet);
  Pallet.belongsTo(StorageLocation);
  Pallet.hasMany(Box);
  Box.belongsTo(Pallet);
  Role.hasMany(Employee);
  Employee.belongsTo(Role);
  // Employee.belongsToMany(Role, {
  //   through: "employee_role",
  // });
  // Role.belongsToMany(Employee, {
  //   through: "employee_role",
  // });
  Employee.hasOne(User);
  User.belongsTo(Employee);
  Warehouse.hasMany(Employee, {
    as: "assignedEmployees",
    foreignKey: "worksiteId",
  });
  Employee.belongsTo(Warehouse, {
    as: "worksite",
    foreignKey: "worksiteId",
  });
  Pallet.hasMany(Activity, {
    foreignKey: "activeId",
    constraints: false,
    scope: {
      activeType: "pallet",
    },
  });
  Activity.belongsTo(Pallet, { foreignKey: "activeId", constraints: false });
  Box.hasMany(Activity, {
    foreignKey: "activeId",
    constraints: false,
    scope: {
      activeType: "box",
    },
  });
  Activity.belongsTo(Box, { foreignKey: "activeId", constraints: false });
  Warehouse.hasMany(Activity);
  Activity.belongsTo(Warehouse);
  User.hasMany(Activity);
  Activity.belongsTo(User);
  Activity.addHook("afterFind", (findResult) => {
    // eslint-disable-next-line no-param-reassign
    if (!Array.isArray(findResult)) findResult = [findResult];
    // eslint-disable-next-line no-restricted-syntax
    for (const instance of findResult) {
      if (instance.activeType === "pallet" && instance.pallet !== undefined) {
        instance.active = instance.pallet;
      } else if (
        instance.commentableType === "box" &&
        instance.box !== undefined
      ) {
        instance.active = instance.box;
      }
      delete instance.pallet;
      delete instance.dataValues.pallet;
      delete instance.box;
      delete instance.dataValues.box;
    }
  });
  // Pallet.addHook("afterCreate", (pallet) => {
  Pallet.addHook("beforeDestroy", (pallet) => {
    pallet.addActivity({ activeType: "remove" });
  });
}

export default associateModels;
