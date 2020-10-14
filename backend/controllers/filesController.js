const path = require('path');
const fs = require('fs');
const makedir = require('make-dir');
const rmdir = require('rmdir');
const archiver = require('archiver');

const Files = require('../models').Files;
const Permissions = require('../models').Permissions;

module.exports.createFolder = (req, res) => {
  Files.findOne({
    where: {
      user_id: req.session.id,
      idParent: req.session.folder,
      name: req.body.name,
    },
  }).then((result) => {
    if (result) {
      res.status(200).send({ message: 'Folder already exists' });
    } else {
      Files.findOne({
        where: {
          id: req.session.folder,
          user_id: req.session.id,
        },
      }).then((folder) => {
        if (req.session.folder) {
          const location = path.join(folder.path, req.body.name.toString());

          makedir(location);

          let privacy = 0;

          if (folder.idParent !== 0) {
            privacy = folder.isPublic;
          }

          Files.create({
            user_id: req.session.id,
            idParent: req.session.folder,
            name: req.body.name,
            isPublic: privacy,
            isFolder: 1,
            path: location,
          }).then(() => res.status(201).send({ message: 'Folder created' }));
        }
      }).catch(() => res.status(500).send({ message: 'Error' }));
    }
  }).catch(() => res.status(500).send({ meesage: 'Error' }));
};

module.exports.getFiles = (req, res) => {
  Files.findAll({
    attributes: ['id', 'name', 'isFolder'],
    where: {
      user_id: req.session.id,
      idParent: req.params.folder_id,
    },
    order: [
      ['isFolder', 'DESC'],
      ['name', 'ASC'],
    ],
    raw: true,
  }).then((result) => {
    if (result) {
      if (result.length) {
        req.session.folder = req.params.folder_id;
        res.status(200).send(result);
      } else {
        req.session.folder = req.params.folder_id;
        res.status(204).send({ message: 'Empty folder' });
      }
    } else {
      res.status(403).send({ message: 'You don\'t own this folder' });
    }
  }).catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.getCurrentFolder = (req, res) => {
  Files.findAll({
    attributes: ['id', 'name', 'isFolder'],
    where: {
      user_id: req.session.id,
      idParent: req.session.folder,
    },
    order: [
      ['isFolder', 'DESC'],
      ['name', 'ASC'],
    ],
    raw: true,
  }).then((result) => {
    if (result) {
      if (result.length) {
        res.status(200).send(result);
      } else {
        res.status(204).send({ message: 'Empty folder' });
      }
    } else {
      res.status(403).send({ message: 'You don\'t own this folder' });
    }
  }).catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.changeAccess = (req, res) => {
  Files.findOne({
    where: {
      id: req.body.file_id,
      user_id: req.session.id,
      isFolder: 1,
    },
  }).then((result) => {
    if (result) {
      Files.findOne({
        where: {
          id: result.idParent,
          idParent: 0,
          isFolder: 1,
          user_id: req.session.id,
        },
        raw: true,
      }).then((primary) => {
        if (primary) {
          async function f() {
            let i = 1;
            let parents = [req.body.file_id];
            const folders = [req.body.file_id];

            while (i) {
              currentId = parents[0];

              const promise = Files.findAll({
                where: {
                  idParent: currentId,
                  isFolder: 1,
                },
                raw: true,
              }).then((foldersFound) => {
                return foldersFound;
              });

              const foldersFound = await promise;

              for (const j = 0; j < foldersFound.length; j++) {
                i++;
                parents.push(foldersFound[j]['id']);
                folders.push(foldersFound[j]['id']);
              }

              i--;

              parents = parents.filter(((item) => item !== currentId));

              for (const x = 0; x < parents.length - 1; x++) {
                parents[x] = parents[x + 1];
              }
            }

            if (result.isPublic) {
              for (const j = folders.length - 1; j >= 0; j--) {
                Files.update({
                  isPublic: 0,
                },
                  {
                    where: {
                      idParent: folders[j],
                      user_id: req.session.id,
                    },
                  }).catch(() => res.status(500).send({ message: 'Error' }));
              }

              Files.update({
                isPublic: 0,
              },
                {
                  where: {
                    user_id: req.session.id,
                    id: req.body.file_id,
                  },
                }).catch(() => res.status(500).send({ message: 'Error' }));

              res.status(201).send({ message: 'Folder is now private' });
            } else {
              for (const j = folders.length - 1; j >= 0; j--) {
                Files.update({
                  isPublic: 1,
                },
                  {
                    where: {
                      idParent: folders[j],
                      user_id: req.session.id,
                    },
                  }).catch(() => res.status(500).send({ message: 'Error' }));
              }

              Files.update({
                isPublic: 1,
              },
                {
                  where: {
                    user_id: req.session.id,
                    id: req.body.file_id,
                  },
                }).catch(() => res.status(500).send({ message: 'Error' }));

              res.status(200).send({ message: 'Folder is now public' });
            }
          }

          f();
        } else {
          res.status(400).send({ message: 'Only primary folders have accessors' });
        }
      }).catch(() => res.status(400).send({ message: 'Temporary error' }));
    } else {
      res.status(404).send({ message: 'No folders found' });
    }
  }).catch(() => res.status(400).send({ message: 'No folders found' }));
};

module.exports.navigateBack = (req, res) => {
  Files.findOne({
    where: {
      id: req.session.folder,
      user_id: req.session.id,
    },
    raw: true,
  }).then((output) => {
    if (output.idParent !== 0) {
      Files.findAll({
        attributes: ['id', 'name', 'isFolder'],
        where: {
          user_id: req.session.id,
          idParent: output.idParent,
        },
        order: [
          ['isFolder', 'DESC'],
          ['name', 'ASC'],
        ],
        raw: true,
      }).then((result) => {
        if (result.length) {
          req.session.folder = output.idParent;
          res.status(200).send(result);
        }
      }).catch(() => res.status(500).send({ message: 'Error' }));
    } else {
      res.status(203).send({ message: 'This is your root folder' });
    }
  }).catch(() => res.status(400).send({ message: 'Bad request' }));
};

module.exports.uploadFiles = (req, res) => {
  if (req.files) {
    Files.findOne({
      where: {
        isFolder: 1,
        user_id: req.session.id,
        id: req.session.folder,
      },
      raw: true,
    }).then((parent) => {
      const errText = [];
      let size = 0;

      for (const i = 0; i < req.files.length; i++) {
        const currentFile = req.files[i];

        size += req.files[i].size;

        Files.findOne({
          where: {
            name: currentFile.originalname,
            idParent: req.session.folder,
            user_id: req.session.id,
            isFolder: 0,
          },
        }).then((result) => {
          if (result) {
            errText.push('File ' + currentFile.originalname + ' already exists');
          }
        });
      }

      if (size < 250000000) {
        Files.findOne({
          where: {
            user_id: req.session.id,
            id: req.session.folder,
          },
        }).then((result) => {
          for (const i = 0; i < req.files.length; i++) {
            const currentFile = req.files[i];
            const location = path.join(parent.path, currentFile.originalname);

            try {
              Files.findOne({
                where: {
                  name: currentFile.originalname,
                  idParent: req.session.folder,
                  user_id: req.session.id,
                  isFolder: 0,
                },
              }).then((number) => {
                if (!number) {
                  const file = fs.createWriteStream(location);
                  file.write(currentFile.buffer);
                  file.end();

                  Files.create({
                    user_id: req.session.id,
                    isPublic: result.isPublic,
                    idParent: req.session.folder,
                    name: currentFile.originalname,
                    isFolder: 0,
                    path: location,
                  });

                  req.files = null;
                  currentFile = null;
                  file = null;
                  global.gc();
                } else {
                  req.files = null;
                  currentFile = null;
                  global.gc();
                }
              });
            } catch (err) {
              err = 1;
              req.files = null;
              currentFile = null;
              global.gc();
            }
          }
          if (errText.length) {
            req.files = null;
            res.status(200).send({ message: errText });
            global.gc();
          } else {
            res.status(201).send({ message: 'good' });
            global.gc();
          }
        });
      } else {
        res.status(204).send({ message: 'Files are too big. Current upload limit is 150MB' });
      }
    });
  } else {
    res.status(400).send({ message: 'Upload buffer is empty' });
  }
};

module.exports.parentFolders = (req, res) => {
  Files.findOne({
    where: {
      idParent: 0,
      user_id: req.session.id,
    },
    raw: true,
  }).then((resp) => {
    Files.findAll({
      attributes: ['id', 'name', 'isPublic'],
      where: {
        user_id: req.session.id,
        idParent: resp.id,
        isFolder: 1,
      },
      order: [
        ['isFolder', 'DESC'],
        ['name', 'ASC'],
      ],
    }).then((result) => {
      if (result.length) {
        res.status(200).send(result);
      } else {
        res.status(203).send({ message: 'You have 0 folders' });
      }
    });// .catch(() => res.status(400).send({message: "Bad Request"}));
  });
};

module.exports.publicParentFolders = (req, res) => {
  Files.findAll({
    where: {
      user_id: req.params.owner_id,
      idParent: 0,
      isFolder: 1,
      isPublic: 1,
    },
    order: [
      ['isFolder', 'DESC'],
      ['name', 'ASC'],
    ],
  }).then((result) => {
    if (result.length) {
      res.status(200).send(result);
    } else {
      res.status(200).send({ message: 'Current user have 0 public folders' });
    }
  }).catch(() => res.status(400).send({ message: 'Bad Request' }));
};

module.exports.deleteFiles = (req, res) => {
  Files.findOne({
    where: {
      user_id: req.session.id,
      id: req.body.file_id,
    },
  }).then((result) => {
    if (result && result.idParent !== 0 && req.body.file_id !== req.session.folder) {
      const err = 0;

      if (result.isFolder) {
        async function f() {
          const i = 1;
          const path = result.path;
          const parents = [req.body.file_id];
          const folders = [req.body.file_id];

          while (i) {
            currentId = parents[0];
            const promise = Files.findAll({
              where: {
                idParent: currentId,
                isFolder: 1,
              },
              raw: true,
            }).then((foldersFound) => {
              return foldersFound;
            });

            const foldersFound = await promise;

            for (const j = 0; j < foldersFound.length; j++) {
              i++;
              parents.push(foldersFound[j]['id']);
              folders.push(foldersFound[j]['id']);
            }

            i--;

            parents = parents.filter(((item) => item !== currentId));

            for (const x = 0; x < parents.length - 1; x++) {
              parents[x] = parents[x + 1];
            }
          }

          for (const j = folders.length - 1; j >= 0; j--) {
            Files.destroy({
              where: {
                idParent: folders[j],
              },
            });
          }

          rmdir(path, () => {
            err = 1;
          });
        }

        f();
      } else {
        fs.unlink(result.path, () => {
          err = 1;
        });
      }

      Files.destroy({
        where: {
          user_id: req.session.id,
          id: req.body.file_id,
        },
      }).catch(() => {
        err = 1;
      });

      if (err) {
        res.status(500).send({ message: 'An error occured. Try Again' });
      } else {
        res.status(200).send({ message: 'Files deconsted' });
      }
    } else {
      res.status(400).send({ message: 'Cannot deconste this now' });
    }
  });
};

module.exports.downloadFiles = (req, res) => {
  Files.findOne({
    where: {
      user_id: req.session.id,
      id: req.params.file_id,
    },
    raw: true,
  }).then((result) => {
    if (result) {
      if (result.isFolder) {
        const location = result.path + '/';

        const archive = archiver('zip');

        archive.on('error', function () {
          res.status(200).send({ message: 'An error occured' });
        });

        archive.on('finish', function (err) {

        });

        archive.pipe(res);

        res.attachment(result.name + '.zip');

        archive.directory(location, result.name);

        archive.finalize();
      } else {
        if (fs.existsSync(result.path)) {
          res.download(result.path, result.name);
        } else {
          res.status(404).send({ message: 'File was not found' });
        }
      }
    } else {
      res.status(404).send({ message: 'No file found' });
    }
  }).catch(() => res.status(400).send({ message: 'File cannot be downloaded right now' }));
};

module.exports.getFriendFiles = (req, res) => {
  Permissions.findOne({
    where: {
      owner_id: req.params.owner_id,
      friend_id: req.session.id,
    },
  }).then((permission) => {
    if (permission) {
      Files.findAll({
        attributes: ['id', 'name', 'isFolder'],
        where: {
          user_id: req.params.owner_id,
          idParent: req.params.folder_id,
          isPublic: 1,
        },
        order: [
          ['isFolder', 'DESC'],
          ['name', 'ASC'],
        ],
      }).then((pub) => {
        if (pub.length) {
          req.session.friend_folder = req.params.folder_id;
          res.status(200).send(pub);
        } else {
          req.session.friend_folder = req.params.folder_id;
          res.status(201).send({ message: 'No file here' });
        }
      });
    } else {
      res.status(403).send({ message: 'This user didn\'t gave you permission' });
    }
  });
};

module.exports.getFriendFilesRoot = (req, res) => {
  Permissions.findOne({
    where: {
      owner_id: req.params.owner_id,
      friend_id: req.session.id,
    },
  }).then((permission) => {
    if (permission) {
      Files.findOne({
        where: {
          user_id: req.params.owner_id,
          isFolder: 1,
          idParent: 0,
        },
      }).then((result) => {
        Files.findAll({
          attributes: ['id', 'name', 'isFolder'],
          where: {
            user_id: req.params.owner_id,
            idParent: result.id,
            isPublic: 1,
          },
          order: [
            ['isFolder', 'DESC'],
            ['name', 'ASC'],
          ],
        }).then((pub) => {
          if (pub.length) {
            req.session.friend_folder = result.id;
            res.status(200).send(pub);
          } else {
            req.session.friend_folder = result.id;
            res.status(201).send({ message: 'No file here' });
          }
        });
      });
    } else {
      res.status(403).send({ message: 'This user didn\'t gave you permission' });
    }
  });
};

module.exports.navigateBackFriend = (req, res) => {
  Permissions.findOne({
    where: {
      owner_id: req.params.owner_id,
      friend_id: req.session.id,
    },
  }).then((permission) => {
    if (permission) {
      Files.findOne({
        where: {
          id: req.session.friend_folder,
          user_id: req.params.owner_id,
        },
        raw: true,
      }).then((output) => {
        if (output.idParent) {
          Files.findAll({
            attributes: ['id', 'name', 'isFolder'],
            where: {
              user_id: req.params.owner_id,
              idParent: output.idParent,
              isPublic: 1,
            },
            order: [
              ['isFolder', 'DESC'],
              ['name', 'ASC'],
            ],
            raw: true,
          }).then((pub) => {
            req.session.friend_folder = output.idParent;
            res.status(200).send(pub);
          });
        } else {
          res.status(203).send({ message: 'This is the root folder' });
        }
      });
    } else {
      res.status(403).send({ message: 'You don\'t have permission' });
    }
  });
};

module.exports.downloadFilesFriend = (req, res) => {
  Permissions.findOne({
    where: {
      owner_id: req.params.owner_id,
      friend_id: req.session.id,
    },
  }).then((permission) => {
    if (permission) {
      Files.findOne({
        where: {
          user_id: req.params.owner_id,
          id: req.params.file_id,
        },
        raw: true,
      }).then((result) => {
        if (result) {
          if (result.isFolder) {
            const location = result.path + '/';

            const archive = archiver('zip');

            archive.on('error', function () {
              res.status(200).send({ message: 'An error occured' });
            });

            archive.on('finish', function (err) {

            });

            archive.pipe(res);

            res.attachment(result.name + '.zip');

            archive.directory(location, result.name);

            archive.finalize();
          } else {
            if (fs.existsSync(result.path)) {
              res.download(result.path, result.name);
            } else {
              res.status(404).send({ message: 'File was not found' });
            }
          }
        } else {
          res.status(404).send({ message: 'No file found' });
        }
      }).catch(() => res.status(400).send({ message: 'File cannot be downloaded right now' }));
    } else {
      res.status(403).send({ message: 'You don\'t have permission to download this file' });
    }
  }).catch(() => res.status(400).send({ message: 'Error at permissions' }));
};

module.exports.renameFile = (req, res) => {
  Files.findOne({
    where: {
      user_id: req.session.id,
      id: req.body.file_id,
      idParent: {
        $not: 0,
      },
    },
  }).then((result) => {
    if (result) {
      const oldPath = result.path;
      const newPath = result.path.substring(0, result.path.lastIndexOf('/') + 1) + req.body.name;

      Files.findAll({
        where: {
          user_id: req.session.id,
          idParent: result.idParent,
          name: req.body.name,
        },
      }).then((found) => {
        if (found.length) {
          res.status(203).send({ message: 'A file with this name already exists!' });
        } else {
          fs.rename(oldPath, newPath, (err) => { });

          Files.update({
            name: req.body.name,
            path: newPath,
          },
            {
              where: {
                id: req.body.file_id,
                user_id: req.session.id,
              },

            }).then((resp) => {
              Files.findAll({
                where: {
                  user_id: req.session.id,
                  path: {
                    $like: oldPath + '/%',
                  },
                },
                raw: true,
              }).then((children) => {
                for (const i = 0; i < children.length; i++) {
                  const newChildPath = children[i].path.replace(oldPath, newPath);

                  Files.update({
                    path: newChildPath,
                  },
                    {
                      where: {
                        id: children[i].id,
                        user_id: req.session.id,
                      },

                    });
                }
              });
              res.status(200).send({ message: 'Name change was successful' });
            });
        }
      });
    } else {
      res.status(404).send({ message: 'File was not found' });
    }
  }).catch(() => res.status(500).send({ message: 'Server error occurred' }));
};
