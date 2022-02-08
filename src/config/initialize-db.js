import db from "./db.js";
import associateModels from "./associate-models.js";

async function initializeDb() {
  await associateModels();
  await db.sync();
}

export default initializeDb;
