export default async (Model, options = {}) => {
  return {
    async listAll(req, res) {
      const instances = await Model.findAll();
      res.json(instances);
    },

    async byId(req, res) {
      const instance = await Model.findByPk(req.params.id, {
        include: { all: true, nested: true },
      });
      res.json(instance);
    },

    async create(req, res) {
      const instance = await Model.create(req.body);
      res.json(instance);
    },

    async update(req, res) {
      const instance = await Model.findByPk(req.params.id);
      await instance.update(req.body);
      res.json(instance);
    },

    async remove(req, res) {
      const instance = await Model.findByPk(req.params.id);
      await instance.destroy();
      res.status(204).json(req.params.id);
    },
  };
};
