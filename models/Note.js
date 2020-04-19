const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
},
    { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);