import User from '../models/User.mjs';
import Address from '../models/Address.mjs';
import Alert from '../models/Alert.mjs';
import Preference from '../models/Preference.mjs';
import PasswordRecovery from '../models/PasswordRecovery.mjs';
import Category from '../models/Category.mjs';
import Product from '../models/Product.mjs';
import IdMapping from '../models/IdMapping.mjs';
import Order from '../models/Order.mjs';
import OrderDetail from '../models/OrderDetail.mjs';
import Promotion from '../models/Promotion.mjs';
import Payment from '../models/Payment.mjs';
import ProductHasCategory from '../models/ProductHasCategory.mjs';
import ProductHasPromotion from '../models/ProductHasPromotion.mjs';
import Delivery from '../models/Delivery.mjs';
import Cart from '../models/Cart.mjs';
import CartHasProduct from '../models/CartHasProduct.mjs';

const Models = {
  user: User,
  address: Address,
  alert: Alert,
  preference: Preference,
  passwordRecovery: PasswordRecovery,
  category: Category,
  product: Product,
  idMapping: IdMapping,
  order: Order,
  orderDetail: OrderDetail,
  payment: Payment,
  productHasCategory: ProductHasCategory,
  productHasPromotion: ProductHasPromotion,
  promotion: Promotion,
  delivery: Delivery,
  cart: Cart,
  cartHasProduct: CartHasProduct,
};

/**
 * 
 * @param {string} model 
 */
export const getModel = async (model) => {
  if (!Models[model]) {
    throw new Error(`Model ${model} does not exist.`);
  }

  const Model = Models[model];
  return Model;
}