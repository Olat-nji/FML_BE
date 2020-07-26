class encryptPaymentService {
       encrypt(key, text) {
          text = JSON.stringify(text);
          var forge = require("node-forge");
          var cipher = forge.cipher.createCipher(
            "3DES-ECB",
            forge.util.createBuffer(key)
          );
          cipher.start({ iv: " " });
          cipher.update(forge.util.createBuffer(text, "utf-8"));
          cipher.finish();
          var encrypted = cipher.output;
          return forge.util.encode64(encrypted.getBytes());
        }
}
module.exports =new  encryptPaymentService()
