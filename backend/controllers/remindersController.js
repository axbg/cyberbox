const Reminders = require('../models').Reminders;

module.exports.createReminder = (req, res) => {
  Reminders.findOne({
    where: {
      title: req.body.title,
      expiration: req.body.expiration,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      res.status(302).send({message: 'Reminder already set'});
    } else {
      Reminders.create({
        title: req.body.title,
        expiration: req.body.expiration,
        isDone: 0,
        user_id: req.session.id,
      }).catch(() => res.status(500).send({message: 'Server Error!'}));

      res.status(201).send({message: 'Reminder set'});
    }
  });
};


module.exports.getUndoneReminders = (req, res) => {
  Reminders.findAll({
    attributes: ['id', 'title', 'expiration', 'isDone'],
    where: {
      isDone: 0,
      user_id: req.session.id,
    },

    raw: true,
  }).then((result) => {
    if (result.length) {
      res.status(200).send(result);
    } else {
      res.status(201).send({message: 'Nothing to show'});
    }
  });
};


module.exports.getDoneReminders = (req, res) => {
  Reminders.findAll({
    attributes: ['id', 'title', 'expiration', 'isDone'],
    where: {
      isDone: 1,
      user_id: req.session.id,
    },
    raw: true,
  }).then((result) => {
    if (result.length) {
      res.status(200).send(result);
    } else {
      res.status(201).send({message: 'Nothing to show'});
    }
  }).catch(() => res.status(500).send({message: 'Database Error'}));
};


module.exports.getAllReminders = (req, res) => {
  Reminders.findAll({
    attributes: ['id', 'title', 'expiration', 'isDone'],
    where: {
      user_id: req.session.id,
    },
    raw: true,
  }).then((result) => {
    if (result.length) {
      res.status(200).send(result);
    } else {
      res.status(200).send({message: 'Nothing to show'});
    }
  }).catch(() => res.status(500).send({message: 'Database Error'}));
};


module.exports.makeDone = (req, res) => {
  Reminders.findOne({
    where: {
      user_id: req.session.id,
      id: req.body.reminder_id,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      Reminders.update(
          {isDone: 1},
          {
            where: {
              user_id: req.session.id,
              id: req.body.reminder_id,
            },
          },
      ).catch(() => res.status(500).send({message: 'Error'}));

      res.status(200).send({message: 'Reminder is done'});
    } else {
      res.status(404).send({message: 'Reminder was not found'});
    }
  }).catch(() => res.status(500).send({message: 'Server error'}));
};

module.exports.makeUndone = (req, res) => {
  Reminders.findOne({
    where: {
      user_id: req.session.id,
      id: req.body.reminder_id,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      Reminders.update(
          {isDone: 0},
          {
            where: {
              user_id: req.session.id,
              id: req.body.reminder_id,
            },
          },
      ).catch(() => res.status(500).send({message: 'Error'}));

      res.status(200).send({message: 'Reminder set as undone'});
    } else {
      res.status(404).send({message: 'Reminder was not found'});
    }
  }).catch(() => res.status(500).send({message: 'Server error'}));
};


module.exports.deleteReminder = (req, res) => {
  Reminders.findOne({
    where: {
      title: req.body.title,
      expiration: req.body.expiration,
      user_id: req.session.id,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      Reminders.destroy({
        where: {
          title: req.body.title,
          expiration: req.body.expiration,
        },
      }).catch(() => res.status(500).send({message: 'Reminder was not deleted'}));

      res.status(200).send({message: 'Reminder was deleted'});
    } else {
      res.status(404).send({message: 'Reminder was not found'});
    }
  });
};
