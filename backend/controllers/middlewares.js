const Users = require('../models').Users;
const Files = require('../models').Files;
const Permissions = require('../models').Permissions;
const Notes = require('../models').Notes;

module.exports.ForceAdmin = (req, res, next) => {
  if (req.body.password === 'parolaparola') {
    next();
  } else {
    res.status(403).send({message: 'Forbidden'});
  }
};

module.exports.LogInCheck = (req, res, next) => {
  Users.findOne({
    where: {
      id: req.session.id,
      token: req.session.token,
    },
  }).then((result) => {
    if (result) {
      next();
    } else {
      res.status(403).send({message: 'Forbidden'});
    }
  });
};

module.exports.isFolder = (req, res, next) => {
  if (req.params.folder_id) {
    Files.findOne({
      where: {
        id: req.params.folder_id,
        isFolder: 1,
      },
      raw: true,
    }).then((result) => {
      if (result) {
        if (result.isFolder) {
          next();
        }
      } else {
        res.status(400).send({message: 'Is not a folder'});
      }
    });
  } else {
    Files.findOne({
      where: {
        id: req.session.folder,
        isFolder: 1,
      },
      raw: true,
    }).then((result) => {
      if (result) {
        if (result.isFolder) {
          next();
        }
      } else {
        res.status(400).send({message: 'Is not a folder'});
      }
    });
  }
};

module.exports.PermissionChecker = (req, res, next) => {
  Permissions.findOne({
    where: {
      owner_id: req.params.owner_id,
      friend_id: req.session.id,
    },
  }).then((access) => {
    if (access) {
      next();
    } else {
      res.status(403).send({message: 'You don\'t have permissions to view this user\'s public folders'});
    }
  });
};

module.exports.isNoteFolder = (req, res, next) => {
  if (req.params.folder_id.toString() === '0') {
    next();
  }


  Notes.findOne({
    where: {
      id: req.params.folder_id,
      isFolder: 1,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      if (result.isFolder) {
        next();
      }
    } else {
      res.status(400).send({message: 'Is not a folder'});
    }
  });
};
