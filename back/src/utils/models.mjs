import User from '../models/User.mjs';
import Address from '../models/Address.mjs';
import Alert from '../models/Alert.mjs';
import Preference from '../models/Preference.mjs';
import PasswordRecovery from '../models/PasswordRecovery.mjs';
import Category from '../models/Category.mjs';
import Product from '../models/Product.mjs';
import IdMapping from '../models/IdMapping.mjs';

const Models = {
  user: User,
  address: Address,
  alert: Alert,
  preference: Preference,
  passwordRecovery: PasswordRecovery,
  category: Category,
  product: Product,
  idMapping: IdMapping
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