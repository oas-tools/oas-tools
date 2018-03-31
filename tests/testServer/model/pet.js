let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//book schema definition
let PetSchema = new Schema(
  {
    id: { type: Number, required: true },
    tag: { type: String, required: false },
    name: { type: String, required: true },
  },
  {
    versionKey: false
  }
);

PetSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('pet', PetSchema);
