const Settings = require('../models').Settings;

module.exports.updateSettingsPush = (req, res) => {
  Settings.findOne({
    where: {
      user_id: req.session.id,
    },
  }).then((result) => {
    if (result.push) {
      Settings.update(
        { push: 0 },
        {
          where: {
            user_id: req.session.id,
          },
        }).then(() => res.status(200).send({ message: 'Push notification: off' }));
    } else {
      Settings.update(
        { push: 1 },
        {
          where: {
            user_id: req.session.id,
          },
        }).then(() => res.status(200).send({ message: 'Push notification: on' }));
    }
  }).catch(() => res.status(404).send({ message: 'Not found' }));
};

module.exports.updateSettingsMail = (req, res) => {
  Settings.findOne({
    where: {
      user_id: req.session.id,
    },
  }).then((result) => {
    if (result.mail) {
      Settings.update(
        { mail: 0 },
        {
          where: {
            user_id: req.session.id,
          },
        }).then(() => res.status(200).send({ message: 'Mail notification: off' }));
    } else {
      Settings.update(
        { mail: 1 },
        {
          where: {
            user_id: req.session.id,
          },
        }).then(() => res.status(200).send({ message: 'Mail notification: on' }));
    }
  }).catch(() => res.status(400).send({ message: 'Not found' }));
};

module.exports.getSettings = (req, res) => {
  Settings.findOne({
    attributes: ['mail', 'push'],
    where: {
      user_id: req.session.id,
    },
    raw: true,
  }).then((result) => {
    res.status(200).send(result);
  }).catch(() => res.status(500).send({ message: 'Database Error' }));
};
