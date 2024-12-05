const express = require('express');
const router = express.Router();
const { createInvitationCode, getInvitationCodeById, getInvitationCodeByUserId } = require('../controllers/invitation-code-controller');

// POST route to create a new invitation code
router.post('/create-invitation-code', createInvitationCode);
router.get('/invitation-code-by-id/:id', getInvitationCodeById);
router.get('/invitation-code-by-user-id/:user_id', getInvitationCodeByUserId);

module.exports = router;
