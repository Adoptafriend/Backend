import express from "express";
import controllerFactory from "./controller.factory.js";

export default async (Model, options = {}) => {
  const router = express.Router();
  const controller = await controllerFactory(Model, options);

  const base = "";
  const param = "/:id";
  router.route(base).get(controller.listAll).post(controller.create);

  const routeParam = `${base}${param}`;
  router
    .route(routeParam)
    .get(controller.byId)
    .put(controller.update)
    .patch(controller.update)
    .delete(controller.remove);

  return router;
};
