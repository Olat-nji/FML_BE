const router = require('express').Router()
const CamCtrl = require('./../controllers/CampaignController')
const auth = require('./../middlewares/auth')
const multer = require('../middlewares/multerMiddleware')('photoURL')
const { validateEmail } = require('../middlewares/validation')

router.get('/unfundedCampaigns', CamCtrl.fetchAllUnfundedCam)
router.get('/campaign/:id', CamCtrl.getCam)
router.get('/fetchSixFeaturedCams', CamCtrl.fetchSixFeaturedCams)
router.get('/oldUnFundedThreeCams', CamCtrl.oldUnFundedThreeCams)
router.get('/listRequests', auth(), CamCtrl.fetchUserReq)
router.get('/listCampaigns', auth(), CamCtrl.fetchUserCam)
router.post(
  '/createRequest',
  CamCtrl.authenticate,
  auth(),
  multer[0],
  multer[1],
  CamCtrl.createRequest
)
router.get('/userOverview', auth(), CamCtrl.fetchUserOverview)
router.get('/fundeeOverview', auth(), CamCtrl.fundeeOverview)

module.exports = router
