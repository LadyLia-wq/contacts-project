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

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

const getMissingFields = (body) =>
  REQUIRED_FIELDS.filter((field) => !body[field]);

// POST a new contact
/* #swagger.tags = ['Contacts']
   #swagger.summary = 'Create a new contact' */
router.post('/', async (req, res) => {
  try {
    const missingFields = getMissingFields(req.body);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    const db = getDb();
    const result = await db.collection('contacts').insertOne({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday,
    });

    res.status(201).json({ _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (partially update) a contact by id
/* #swagger.tags = ['Contacts']
   #swagger.summary = 'Update part of a contact by id' */
router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    for (const field of REQUIRED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: `No valid fields provided. Allowed fields: ${REQUIRED_FIELDS.join(', ')}` });
    }

    const db = getDb();
    const contactId = new ObjectId(req.params.id);
    const result = await db.collection('contacts').updateOne(
      { _id: contactId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a contact by id
/* #swagger.tags = ['Contacts']
   #swagger.summary = 'Delete a contact by id' */
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const contactId = new ObjectId(req.params.id);
    const result = await db.collection('contacts').deleteOne({ _id: contactId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
