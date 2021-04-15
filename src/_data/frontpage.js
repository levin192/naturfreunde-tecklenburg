const { default: axios } = require('axios');

module.exports = async () => {
  try {
    const res = await axios.get('https://naturfreunde-backend.herokuapp.com/frontpage');
    // let jsonData = JSON.stringify(res.data)
    // console.log(jsonData)
    return res.data;

  } catch (error) {
    console.error(error);
  }
};