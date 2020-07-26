const axios = require('axios');

class Axios {
    static async getCall(url, data) {
        const get = await axios({
            method: 'get',
            url,
        });

        return get;
    }

    static async postCall(url,data) {
      return await axios.post(url,data).then( (response) => {
            return response
       }).catch((error) => {
           console.log(error);
       })
    }
}

module.exports = Axios;