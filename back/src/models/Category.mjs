import { Schema, Types, model } from 'mongoose';

const categorySchema = new Schema({
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

categorySchema.method('toClient', function () {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;

    return obj;
});

categorySchema.statics.findToClient = async function (query) {
    const categories = await this.find(query);
    return categories.map(category => category.toClient());
};

const Category = model('Category', categorySchema);

export default Category;
