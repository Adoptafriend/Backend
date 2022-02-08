/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import db from "../config/db.js";

export default async (Model, testData, testUpdateData) => {
  return describe(Model, () => {
    beforeAll(async () => {
      await db.sync({ force: true });
    });

    test("can create one", async () => {
      const instance = await Model.create(testData[0]);
      expect(instance instanceof Model);
      expect(instance.id).toBe(1);
      for (const key in testData[0]) {
        expect(instance[key]).toBe(testData[0][key]);
      }
    });

    test("can find by id", async () => {
      const instance = await Model.findByPk(1);
      expect(instance instanceof Model);
      expect(instance.id).toBe(1);
      for (const key in testData[0]) {
        expect(instance[key]).toBe(testData[0][key]);
      }
    });

    test("can add multiple", async () => {
      const instance = await Model.create(testData[1]);
      expect(instance instanceof Model);
      expect(instance.id).toBe(2);
      for (const key in testData[1]) {
        expect(instance[key]).toBe(testData[1][key]);
      }
    });

    test("can list all", async () => {
      const instances = await Model.findAll();
      expect(instances.length).toBe(2);
      expect(instances[0] instanceof Model);
      expect(instances[0].id).toBe(1);
      for (const key in testData[0]) {
        expect(instances[0][key]).toBe(testData[0][key]);
      }
      expect(instances[1] instanceof Model);
      expect(instances[1].id).toBe(2);
      for (const key in testData[1]) {
        expect(instances[1][key]).toBe(testData[1][key]);
      }
    });

    test("can update", async () => {
      const instances = await Model.findAll();
      const updatedInstance = await instances[0].update(testUpdateData[0]);
      for (const key in testUpdateData[0]) {
        expect(updatedInstance[key]).toBe(testUpdateData[0][key]);
      }
      const instance = await Model.findByPk(instances[0].id);
      for (const key in testUpdateData[0]) {
        expect(instance[key]).toBe(testUpdateData[0][key]);
      }
    });

    test("can delete", async () => {
      const instances = await Model.findAll();
      expect(instances.length).toBe(2);
      expect(instances[0].id).toBe(1);
      expect(instances[1].id).toBe(2);
      await instances[0].destroy();
      const instancesAfter = await Model.findAll();
      expect(instancesAfter.length).toBe(1);
      expect(instancesAfter[0].id).toBe(2);
    });
  });
};
