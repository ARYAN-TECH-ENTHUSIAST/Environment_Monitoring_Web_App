const mongoose = require('mongoose');

const pollutionReadingSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    sox: { type: Number, required: true },
    nox: { type: Number, required: true },
    co: { type: Number, required: true },
    pm: { type: Number, required: true },
    vocs: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PollutionReading', pollutionReadingSchema);
