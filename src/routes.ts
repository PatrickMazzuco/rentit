import { apiPrefix } from "@config/dotenv";
import express, { Router } from "express";

import CategoryModule from "./modules/cars";

const router: Router = express.Router();

router.use(apiPrefix, router);

router.use("/categories", CategoryModule.routes);

export default router;
