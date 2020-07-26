const router = require('express').Router();
const BlogCtrl = require('../controllers/Blog')
const auth = require('../middlewares/auth')

router.post('/', auth(), BlogCtrl.createBlog);
router.get('/', BlogCtrl.getBlogs);
router.get('/:id', BlogCtrl.getBlog);
router.post('/:id/comment', auth(), BlogCtrl.createBlogComment);
// router.get('/:id/comments', BlogCtrl.getBlogComments);

module.exports = router;
