const { Schema, model } = require('mongoose');

const voteSchema = new Schema({
  voterId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  vote: {
    type: String,
    required: true,
  },
});

const pollSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  choices: {
    type: [String],
    default: [],
  },
  votes: {
    type: [voteSchema],
    default: [],
  },
});

module.exports = model('Poll', pollSchema);
