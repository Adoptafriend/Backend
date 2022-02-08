/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Sequelize } from "sequelize";
import db from "./db.js";
import seed from "../../bin/seed.js";
import Warehouse from "../warehouse/warehouse.model.js";
// import StorageLocation from "../warehouse/locations/storage-location.model.js";
// import Employee from "../employee/employee.model.js";
import Address from "../shared/address/address.model.js";

describe(Warehouse, () => {
  beforeAll(async () => {
    await seed(true);
    // await db.sync();
  });

  afterAll(async () => {
    db.close();
  });

  test("can create one", async () => {
    const warehouses = await Warehouse.findAll({
      attributes: {
        include: [
          [
            db.literal(
              `(SELECT COUNT(id) FROM employee WHERE employee.worksite_id = warehouse.id)`
            ),
            "employeeCount",
          ],
        ],
      },
      include: [
        {
          model: Address,
        },
      ],
    });
    expect(warehouses.length).toBe(5);
    expect(warehouses[3].id).toBe(4);
    expect(warehouses[3].employeeCount).toBe(3);
    expect(warehouses[3].address.streetAddress1).toBe("919 S Weatherred Dr");
    // expect(warehouses[3]).toBe(1);
  });

  // test("has storageLocations added when created", async () => {
  //   const instances = await Warehouse.findAll();
  //   const storageLocations = await instances[0].getStorageLocations();
  //   expect(storageLocations.length).toBe(48);
  //   expect(storageLocations[0] instanceof StorageLocation).toBe(true);
  // });

  // test("has aisles", async () => {
  //   const instances = await Warehouse.findAll();
  //   const { aisles } = instances[0];
  //   expect(aisles).toEqual(["01", "02"]);
  // });

  // test("has bays", async () => {
  //   const instances = await Warehouse.findAll();
  //   const { bays } = instances[0];
  //   expect(bays).toEqual(["A", "B"]);
  // });
});
