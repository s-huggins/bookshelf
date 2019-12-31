const mongoose = require('mongoose');

const { Schema } = mongoose;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

const counter = mongoose.model('Counter', counterSchema);

/* eslint-disable func-names, no-param-reassign */
const autoIncrementModelID = async function(modelName, doc, next) {
  try {
    const modelCounter = await counter.findByIdAndUpdate(
      modelName, // The ID to search for in counters model
      { $inc: { seq: 1 } }, // Increment model counter
      { new: true, upsert: true }
    );
    doc.id = modelCounter.seq;
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = autoIncrementModelID;
