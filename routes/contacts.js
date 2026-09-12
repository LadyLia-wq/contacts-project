const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all contacts
/* #swagger.tags = ['Contacts']
   #swagger.summary = 'Get all contacts' */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single contact by id
/* #swagger.tags = ['Contacts']
   #swagger.summary = 'Get a single contact by id' */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const contactId = new ObjectId(req.params.id);
    const contact = await db.collection('contacts').findOne({ _id: contactId });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
