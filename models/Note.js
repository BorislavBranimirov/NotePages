const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    body: { type: String, required: true }
},
    { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);