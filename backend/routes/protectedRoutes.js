const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { updateHandles, getHandles ,getRatings ,bookmark,unbookmark ,syncRatings , addFriend , getFriends , removeFriend} = require('../controllers/userController');

router.use(authMiddleware);

router.get('/profile',authMiddleware, getHandles);            // GET /api/user/profile
router.put('/update-handles',authMiddleware, updateHandles);  // PUT /api/user/update-handles
router.put('/ratings', authMiddleware, syncRatings);
router.get('/ratingsdb', authMiddleware, getRatings);
router.post('/bookmark', authMiddleware , bookmark);
router.post('/unbookmark', authMiddleware , unbookmark);
router.post('/add-friend', authMiddleware, addFriend);
router.get('/friends', authMiddleware, getFriends);
router.put('/remove-friend', authMiddleware, removeFriend);


module.exports = router;
