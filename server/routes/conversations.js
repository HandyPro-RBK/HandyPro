const express = require("express");
const router = express.Router();
const {getMessages,getConversation,getAllConversations} = require("../controllers/conversations");


router.get ('/:id',getConversation)
router.get('/:id/messages',getMessages)
router.get('/:userId/Allconversations',getAllConversations)



module.exports = router; 