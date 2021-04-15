const { default: axios } = require('axios');

module.exports = async () => {
  try {
    const res = await axios.get('https://naturfreunde-backend.herokuapp.com/vorstands');
    return res.data;
  } catch (error) {
    console.error(error);
  }
};