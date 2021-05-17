const express = require('express');

const listsController = require('../controllers/lists');

const router = express.Router();

router.post('/activateList/:userId/:listId', listsController.activateList)
router.put('/archiveList', listsController.archiveList)
router.post('/deactivateList/:userId/:listId', listsController.deactivateList)
router.delete('/deleteList/:listId/:userId', listsController.deleteList);
router.put('/editList', listsController.putList)
router.get('/getLists/:userId/:arr', listsController.getLists);
router.post('/postList', listsController.postList);

module.exports = router;