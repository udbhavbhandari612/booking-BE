import express from "express";
import env from "dotenv";
import mongodb from "./startup/mongodb.js";
import routes from "./startup/routes.js";
import adminRoutes from "./startup/adminRoutes.js";
import { logger, log } from "./startup/logger.js";
import createTransporter from "./helpers/mailTransporter.js";

const server = express();

logger();
env.config();
createTransporter();

mongodb();
routes(server);
adminRoutes(server);
const port = process.env.PORT || 4000;
server.listen(port, () => log(`Server started on port ${port}...`));
