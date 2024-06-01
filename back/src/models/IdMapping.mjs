import { Schema, Types, model } from 'mongoose';

const idMappingSchema = new Schema({
  postgresId: { type: String, unique: true, required: true },
  _id: { type: Schema.Types.ObjectId, required: true, unique: true }
});

const IdMapping = model('IdMapping', idMappingSchema);

export default IdMapping;
