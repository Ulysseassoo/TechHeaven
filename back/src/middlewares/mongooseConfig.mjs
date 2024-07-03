import mongoose from 'mongoose';

function removeMongoId(doc, ret, options) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

// Apply middleware
mongoose.plugin(schema => {
  schema.set('toJSON', {
    transform: removeMongoId
  });
  schema.set('toObject', {
    transform: removeMongoId
  });
});

export default mongoose;
