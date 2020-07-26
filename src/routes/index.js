
const router = require('express').Router()
const userRoute = require('./userRoute')
const campaignRoute = require('./campaignRoute')
const authRoute = require('./authRoute')
const searchRoute = require('./searchRoute')
const faqRouter = require('./faqRoute')
const paymentRoute = require('./paymentRoute')
const recommendationRoute = require('./recommendationRoute')
const contactRouter = require('./contact')
const adminRouter = require('./adminRoute')
const testimonialRoute = require("./testimonialRoute");
const blogRoute = require('./blog');

router.use('/admin', adminRouter)
router.get('/test', (req, res) => res.send('Yeah it works!'))
router.use('/users', userRoute)
router.use('/auth', authRoute)
router.use('/search', searchRoute)
router.use('/campaigns', campaignRoute)
router.use('/payment', paymentRoute)
router.use('/recommendation', recommendationRoute)
router.use('/contact', contactRouter)
router.use('/faqs', faqRouter)
router.use("/testimonial", testimonialRoute)
router.use('/blog', blogRoute);

module.exports = router
