const express = require('express');
const router = express.Router();

const { verifyAccessToken } = require('../controllers/authController');
const { Note } = require('../models');

router.route('/')
    .get(verifyAccessToken, async (req, res, next) => {
        const regex = new RegExp(req.query.search, 'i');
        let orderObj = { createdAt: 1 };
        let limit = parseInt(req.query.limit, 10) || 25;
        let page = parseInt(req.query.page, 10) || 1;
        switch (req.query.order) {
            case 'name-asc':
                orderObj = { title: 1 };
                break;
            case 'name-desc':
                orderObj = { title: -1 };
                break;
            case 'date-asc':
                orderObj = { createdAt: 1 };
                break;
            case 'date-desc':
                orderObj = { createdAt: -1 };
                break;
        }
        try {
            const notes = await Note.find({
                authorId: res.locals.user.id, title: regex
            })
                .sort(orderObj)
                .skip((page - 1) * limit)
                .limit(limit);
            const count = await Note.countDocuments({ authorId: res.locals.user.id, title: regex });

            return res.json({count, page, limit, notes});
        } catch (err) {
            return res.status(500).json({ err: 'An error occurred while searching for notes' });
        }
    })
    .post(verifyAccessToken, async (req, res, next) => {
        // both title and body need to be provided
        if (!req.body.title || !req.body.body) {
            return res.status(422).json({ err: 'No title or body provided' });
        }

        try {
            // construct new note record
            const newNote = new Note({
                authorId: res.locals.user.id,
                title: req.body.title,
                body: req.body.body
            })

            const note = await newNote.save();
            return res.json({
                success: true,
                id: note._id
            });
        } catch (err) {
            return res.status(500).json({ err: 'An error occurred while creating note' });
        }
    });

router.route('/:id')
    .get(verifyAccessToken, async (req, res, next) => {
        try {
            const note = await Note.findById(req.params.id);
            if (note) {
                if (note.authorId.toString() !== res.locals.user.id) {
                    return res.status(401).json({ err: 'Unauthorized to view this note' });
                }
            }

            return res.json(note);
        } catch (err) {
            return res.status(500).json({ err: 'An error occurred while searching for note' });
        }
    })
    .patch(verifyAccessToken, async (req, res, next) => {
        // either a title or a body needs to be provided
        if (!req.body.title && !req.body.body) {
            return res.status(422).json({ err: 'Either a title or a body needs to be provided' });
        }

        try {
            const note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(404).json({ err: 'Note not found' });
            }

            if (note.authorId.toString() !== res.locals.user.id) {
                return res.status(401).json({ err: 'Unauthorized to edit this note' });
            }

            // if title and body are the same or if one is the same and the other is not provided
            // don't update the record
            if ((req.body.title === note.title && !req.body.body) ||
                (req.body.body === note.body && !req.body.title) ||
                (req.body.body === note.body && req.body.title === note.title)) {
                return res.status(422).json({ err: 'No changes from original note were provided' });
            }

            note.title = req.body.title || note.title;
            note.body = req.body.body || note.body;

            const patchedNote = await note.save();
            return res.json({
                success: true,
                id: patchedNote._id
            });
        } catch (err) {
            return res.status(500).json({ err: 'An error occurred while updating note' });
        }
    })
    .delete(verifyAccessToken, async (req, res, next) => {
        try {
            const note = await Note.findByIdAndDelete(req.params.id);
            if (!note) {
                return res.status(404).json({ err: 'Note not found' });
            }
            if (note.authorId.toString() !== res.locals.user.id) {
                return res.status(401).json({ err: 'Unauthorized to delete this note' });
            }

            return res.json({ success: true });
        } catch (err) {
            return res.status(500).json({ err: 'An error occurred while deleting note' });
        }
    });

module.exports = router;