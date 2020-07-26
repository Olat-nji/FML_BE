const UserService = require("./../services/UserService");
const response = require("./../utils/response");
const googleService = require("./../services/auth/google");

class UserContoller {
  async getActive(req, res) {
    const data = await UserService.getActive(req.user);
    res.status(201).send(response("Active user", data));
  }

  async register(req, res) {
    const data = await UserService.register(req, req.body);
    res.status(201).send(response("Account created successfully. Activation link has been sent to user email", data));
  }
  async login(req, res) {
    const data = await UserService.login(req.body);
    res.status(200).send(response("User signed in", data));
  }

  async getMany(req, res) {
    const data = await UserService.getMany();
    res.status(200).send(response("All users", data));
  }

  async getById(req, res) {
    const data = await UserService.getById(req.params.userId);
    res.status(200).send(response("User", data));
  }

  async update(req, res) {
    const data = await UserService.update(req.params.userId, req.body);
    res.status(200).send(response("User updated", data));
  }

  async delete(req, res) {
    const data = await UserService.deleteOne(req.params.userId);
    res.status(200).send(response("User deleted", data));
  }

  async google(req, res) {
    let data = await googleService(req);
    res.status(200).send(response("Google login successful", data));
  }

  async verification(req, res) {
    const data = await UserService.verification(req.query);
    res.redirect(301, `https://www.fundmylaptop.com//email-verification`);
  }

  async resendVerificationMail(req, res) {
    const data = await UserService.sendVerificationMail(req.params.userId);
    res.status(200).send(response("Verification mail sent"));
  }

  async addUserToMailSubcription(req, res) {
    const mail = req.body.email;
    const data = await UserService.subscribeUser(mail);
    res.status(201).send(response("Email subscription Successful", data));
  }

  // controller for admin/user to delete their acct
  async deleteUserAcct(req, res) {
    const data = await UserService.deleteUserAcct(req);
    res.status(201).send(response("user account has been deleted successfully", data));
  }




}
module.exports = new UserContoller();
