let model = require('../models');
//const session = require('client-sessions');

module.exports.createDatabase = (req, res) => {
  model.sequelize.sync({force: true})
      .then(() => res.status(200).send({message: 'Created Tables'}))
      .catch((err) => res.status(500).send(err.message))

};