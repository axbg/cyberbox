const rmdir = require('rmdir');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const Users = require('../models').Users;
const Settings = require('../models').Settings;
const Files = require('../models').Files;
const Notes = require('../models').Notes;
const Reminders = require('../models').Reminders;
const Permissions = require('../models').Permissions;

module.exports.Welcome = (req, res) => {
  Users.findOne({
    where: {
      email: req.session.email,
    },
  }).then((response) => {
    const info = [];

    info['name'] = response.name;

    Files.count({
      where: {
        user_id: response.id,
        isFolder: 0,
      },
    }).then((files) => {
      info['files'] = files;


      Notes.count({
        where: {
          user_id: response.id,
          isFolder: 0,
        },
      }).then((notes) => {
        info['notes'] = notes;


        Reminders.count({
          where: {
            user_id: response.id,
            isDone: 0,
          },
        }).then((reminders) => {
          info['reminders'] = reminders;

          res.status(200).send({name: info['name'], files: info['files'], notes: info['notes'], reminders: info['reminders']});
        });
      });
    });
  });
};


module.exports.deleteUser = (req, res) => {
  Users.findOne({
    where: {
      email: req.body.email,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      Users.destroy({
        where: {
          email: req.body.email,
        },
      }).then((result) => {
        Settings.destroy({
          where: {
            user_id: result.id,
          },
        });


        Files.destroy({
          where: {
            user_id: result.id,
          },
        });

        rmdir(location, () => {
          req.status(200).send('Notes Folder has been removed');
        });

        Notes.destroy({
          where: {
            user_id: result.id,
          },
        });
        rmdir(locationNotes, () => {
          req.status(200).send('Notes Folder has been removed');
        });

        Reminders.destroy({
          where: {
            user_id: result.id,
          },
        });

        Permissions.destroy({
          where: {
            user_id: result.id,
          },
        });
      }).catch(() => res.status(500).send({message: 'User cannot be deleted'}));

      res.status(200).send({message: 'User was deleted'});
    } else {
      res.status(404).send({message: 'User was not found'});
    }
  });
};

module.exports.getUsers = (req, res) => {
  Users.findAll({
    attributes: ['id', 'name', 'email', 'isAdmin'],
    raw: true,
  }).then((result) => {
    res.status(200).send(result);
  }).catch(() => res.status(500).send({message: 'Database Error'}));
};


module.exports.getOneUser = (req, res) => {
  Users.findOne({
    attributes: ['id', 'name', 'email'],
    where: {
      email: req.params.email,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({message: 'User not found!'});
    }
  });
};


cron.schedule('0 0 6 * * *', function() {
  Reminders.findAll({
    where: {
      isDone: 0,
    },
  }).then((result) => {
    for (let i = 0; i < result.length; i++) {
      const data = result[i].expiration;
      const day = data.substring(8, 10);
      const month = data.substring(6, 7);
      const dataNow = new Date();
      const dayNow = dataNow.getDate();
      const monthNow = dataNow.getMonth() + 1;

      if (day == dayNow && month == monthNow) {
        Users.findOne({
          where: {
            id: result[i].user_id,
          },
        }).then((sender) => {
          Settings.findOne({
            where: {
              user_id: sender.id,
            },
          }).then((permission) => {
            if (permission.dataValues.mail === true) {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'your@mail.com',
                  pass: 'yourpassword',
                },
              });

              const mailOptions = {
                from: 'cyberbox',
                to: sender.email,
                subject: 'You have a reminder set for today',
                text: result[i].title,
              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }
          });
        });
      }
    }
  });
});
