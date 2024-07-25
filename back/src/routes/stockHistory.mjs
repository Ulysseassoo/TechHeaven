import express from "express";
import { shouldBeStoreKeeper } from "../middlewares/authentication.mjs";
import {
  getStockEvolutionFromStartToEnd,
  getTopSixSoldProducts
} from "../utils/stats.mjs";

const router = express.Router();

// -------------------------------- ROUTER --------------------------------------

router.get("/stock-history/stats", shouldBeStoreKeeper, async (req, res) => {
  try {
    const stockProductsEvolution = await getStockEvolutionFromStartToEnd();
    const topSixProductsInStock = await getTopSixSoldProducts();
    return res.status(200).json({
      status: 200,
      data: {
        stockProductsEvolution,
        topSixProductsInStock
      },
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

export default router;
