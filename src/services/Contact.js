const CustomError = require('./../utils/CustomError');
const Contact = require('./../models/Contact')
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// POST route from contact form
exports.createContact = async (data) => {
    const { name, email, title, comment} = data;
    // save input fields
    const details = {
      name,
      email,
      title,
      comment
    }
    const contact = new Contact(details);
    let result = await contact.save();
    if(result._id) {
        return null
    }else{
        throw new CustomError("Something went wrong! Try again");
    }
 };
 exports.getAll = async (id) => {
    let result = await Contact.find({});
    let data = [];
    result.forEach(contact => {    
    contact = _.pick(contact, [
      '_id',
      'name',
      'email',
      'title',
      'comment',
    ]);
    data.push(contact);
    })
    const token = await jwt.sign(
     id ,
        process.env.JWT_SECRET,
        { expiresIn: `2d` })
    
    data.token = token;

    return data
 };
