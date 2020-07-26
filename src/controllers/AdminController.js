const AdminService = require('../services/AdminService')
const response = require('../utils/response')
const CustomError = require('../utils/CustomError')

class AdminController {
  async dashboard(req, res) {
    const dashboardInfo = await AdminService.dashboard()
    res.status(200).send(response('Dashboard data Fatched', dashboardInfo))
  }

 
}

module.exports = new AdminController()
