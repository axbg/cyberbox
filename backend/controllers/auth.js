const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const mkdir = require('make-dir');

const Users = require('../models').Users;
const Files = require('../models').Files;
const Notes = require('../models').Notes;
const Settings = require('../models').Settings;

module.exports.gLogin = (req, res) => {
  axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.token)
      .then((response) => {
        Users.findOne({
          attributes: ['id', 'token', 'name', 'email'],
          where: {
            email: response.data.email,
          },
        }).then((result) => {
          if (result) {
            if (req.session.id) {
              res.status(200).send({message: 'You are already logged in'});
            } else {
              req.session.id = result.id;
              req.session.token = result.token;
              req.session.email = result.email;
              req.session.friend_folder = 0;
              req.session.friend_note = 0;

              Files.findOne({
                where: {
                  name: req.session.email,
                  user_id: req.session.id,
                  idParent: 0,
                  isFolder: 1,
                },
                raw: true,
              }).then((output) => {
                req.session.folder = output.id;
              }).catch(() => res.status(500).send({message: 'Server error'}));

              Notes.findOne({
                where: {
                  title: req.session.email,
                  user_id: req.session.id,
                  idParent: 0,
                  isFolder: 1,
                },
                raw: true,
              }).then((output) => {
                req.session.note = output.id;
                res.status(200).send({message: 'You were logged in'});
              }).catch(() => res.status(500).send({message: 'Server error'}));
            }
          } else {
            tokenizer = crypto.randomBytes(64).toString('hex');

            Users.create({
              email: response.data.email,
              name: response.data.given_name,
              token: tokenizer,
              isAdmin: 0,
            }).then((result) => {
              Settings.create({
                user_id: result.id,
                push: 1,
                mail: 0,
              });

              const location = path.join(__dirname, '..', '..', '..', 'files', response.data.email.toString());
              mkdir(location);
              Files.create({
                user_id: result.id,
                idParent: 0,
                name: response.data.email,
                isPublic: 1,
                isFolder: 1,
                path: location,
              });

              const locationNotes = path.join(__dirname, '..', '..', '..', 'notes', response.data.email.toString());
              mkdir(locationNotes);
              Notes.create({
                user_id: result.id,
                idParent: 0,
                title: response.data.email,
                isPublic: 0,
                isFolder: 1,
                path: locationNotes,
              });
            }).then(() => {
              res.status(205).send({message: 'Account created'});
            });
          }
        });
      }).catch(() => res.status(500).send({message: 'Server error'}));
};

module.exports.Logout = (req, res) => {
  req.session.destroy();
  res.status(200).send({message: 'You were logged out'});
};
