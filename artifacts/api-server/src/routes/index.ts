import { Router, type IRouter } from "express";
import healthRouter from "./health";
import accountRouter from "./account";
import transactionsRouter from "./transactions";
import featuresRouter from "./features";

const router: IRouter = Router();

router.use(healthRouter);
router.use(accountRouter);
router.use(transactionsRouter);
router.use(featuresRouter);

export default router;
