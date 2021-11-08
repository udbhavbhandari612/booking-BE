import express from "express";
import env from "dotenv";
import mongodb from "./startup/mongodb.js";
import routes from "./startup/routes.js";
import { logger, log } from "./startup/logger.js";

const server = express();

logger();
env.config();

mongodb();
routes(server);

const port = process.env.PORT || 4000;
server.listen(port, () => log(`Server started on port ${port}...`));
