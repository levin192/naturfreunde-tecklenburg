const { default: axios } = require('axios');

module.exports = async () => {
  try {
    const res = await axios.get('https://naturfreunde-backend.herokuapp.com/Kooperationspartners');
    return res.data;

  } catch (error) {
    console.error(error);
  }
};