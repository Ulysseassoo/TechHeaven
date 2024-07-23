import User from '../models/User.mjs';
import Alert from '../models/Alert.mjs';
import Product from '../models/Product.mjs';
import Order from '../models/Order.mjs';
import Promotion from '../models/Promotion.mjs';
import Payment from '../models/Payment.mjs';
import Cart from '../models/Cart.mjs';

const Models = {
  User,
  Alert,
  Product,
  Order,
  Payment,
  Promotion,
  Cart,
};

const SubModels = {
  Address: {
    main: User,
    sub: "addresses",
    sub_key: "user_id"
  },
  PasswordRecovery: {
    main: User,
    sub: "passwordRecovery",
    sub_key: "user_id"
  },
  Preference: {
    main: User,
    sub: "preferences",
    sub_key: "user_id"
  },
  Category: {
    main: Product,
    sub: "categories",
    sub_key: "product_id"
  },
  OrderDetail: {
    main: Order,
    sub: "orderDetails",
    sub_key: "order_id"
  },
  ProductHasCategory: {
    main: Product,
    sub: "productHasCategories",
    sub_key: "product_id"
  },
  ProductHasPromotion: {
    main: Product,
    sub: "productHasPromotions",
    sub_key: "product_id"
  },
  Delivery: {
    main: Order,
    sub: "delivery",
    sub_key: "order_id"
  },
  CartHasProducts: {
    main: Cart,
    sub: "carts_has_products",
    sub_key: "cart_id"
  },
  Payment: {
    main: Order,
    sub: "payment",
    sub_key: "order_id"
  },
  Prefrence: {
    main: User,
    sub: "preferences",
    sub_key: "user_id"
  }
}

/**
 * Get the model or submodel based on the provided name.
 * @param {string} model The name of the model or submodel to retrieve.
 * @returns The model or submodel if found.
 * @throws {Error} If neither model nor submodel is found.
 */
export const getModel = async (model) => {
  if(!Models[model] && !SubModels[model]) {
    throw new Error(`Model ${model} not found.`);
  }

  if (Models[model]) {
    return Models[model];
  }

  if (SubModels[model]) {
    return SubModels[model];
  }

}