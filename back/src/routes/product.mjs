import express from "express";
import { validationResult } from "express-validator";
import { shouldBeAdmin } from "../middlewares/authentication.mjs";
import { productValidator } from "../validator/productValidator.mjs";
import { db } from "../utils/db.server.mjs";
import Product from "../models/Product.mjs";

const router = express.Router();

router.post("/products", productValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).send({
        status: 401,
        message: errors
          .formatWith(({ msg, path }) => {
            return {
              msg,
              path,
            };
          })
          .array(),
      });
    }

    const {
      name,
      description,
      price,
      quantity,
      brand,
      promotion,
      promotion_type,
    } = req.body;

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        brand,
        quantity,
        promotion,
        promotion_type,
      },
    });

    return res.status(201).json({ status: 201, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Erreur lors de la création du produit",
        error: error.message,
      });
  }
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search !== undefined && search !== "") {
      const searchQuery = new RegExp(search, "i");
      query.$or = [{ type: { $regex: searchQuery } }];
    }

    const products = await Product.findToClient(query, page, limit);

    const count = await Product.countDocuments(query);

    return res.status(200).json({
      status: 200,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count,
      data: products,
    });
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: error.message || error,
    });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Produit non trouvé" });
    }

    return res.status(200).json({ status: 200, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Erreur lors de la récupération du produit",
        error: error.message,
      });
  }
});

router.put("/products/:id", productValidator, async (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    price,
    brand,
    quantity,
    promotion,
    promotion_type,
  } = req.body;

  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res
        .status(400)
        .json({ status: 400, message: "Produit inexistant." });
    }

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        brand,
        quantity,
        promotion,
        promotion_type,
      },
    });

    return res.status(200).json({ status: 200, data: updatedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Erreur lors de la mise à jour du produit",
        error: error.message,
      });
  }
});

router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.product.delete({
      where: {
        id,
      },
    });

    return res
      .status(200)
      .json({ status: 200, message: "Produit supprimé avec succès" });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Erreur lors de la suppression du produit",
        error: error.message,
      });
  }
});

export default router;
