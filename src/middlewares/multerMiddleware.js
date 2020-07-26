const upload = require("../config/multerConfig")

async function addPathToBody(req, res, next) {
     if (req.files)
          req.body["photoURLs"] = req.files.map(file => file.path)
     
     if (req.file) 
          req.body["photoURL"] = req.file.path

     next();
}

module.exports = (field) => {
     return [upload.single(field), addPathToBody]
}
