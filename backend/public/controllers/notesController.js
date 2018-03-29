let Notes = require('../models').Notes;
let Permissions = require('../models').Permissions;


module.exports.createNote = (req, res) =>{

	Notes.findOne({
		where: {
			title: req.body.title,
			idParent: req.session.note,
			user_id: req.session.id
		},
		raw: true
	}).then((result) => {
		if(result){
			res.status(204).send({message: "Note already exist"});
		}
		else
		{
				Notes.create({
				title: req.body.title,
				content: req.body.content,
				isPublic: 0,
				isFolder: 0,
				user_id: req.session.id,
				idParent: req.session.note
			}).then(() => {
                    res.status(201).send({message: "Note created"});
				}).catch(() => res.status(500).send({message: "Server Error!"}));
		}
	});
};

module.exports.createNoteFolder = (req, res) => {

	Notes.findOne({
		where: {
            user_id: req.session.id,
            idParent: 0
        }
		}).then((result) => {
			if(result.id == req.session.note){

					Notes.findOne({
						where:{
							title: req.body.title,
							isFolder: 1,
							user_id: req.session.id,
							idParent: result.id
						}
					}).then((tester) => {

						if(tester){
							res.status(400).send({message: "This folder already exists"});
						} else {
                            Notes.create({
                                title: req.body.title,
                                isPublic: 0,
                                isFolder: 1,
                                user_id: req.session.id,
                                idParent: req.session.note
                            }).then(() => {
                                res.status(201).send({message: "Folder created"});
                            }).catch(() => res.status(500).send({message: "Server Error!"}));
						}
					});
				}
				else{
					res.status(403).send({message: "Folders can be created only in the root folder"});
				}
			})
};

module.exports.deleteNote = (req,res) => {

	if(req.body.note_id != req.session.note){

	Notes.findOne({
		where:{
			user_id: req.session.id,
			id: req.body.note_id,
			idParent: {
				not: 0
			}
		}
	}).then((result) => {

		if(result){

			if(result.isFolder){

                Notes.destroy({
                    where:{
                        idParent: req.body.note_id,
                        user_id: req.session.id
                    }

                });

                Notes.destroy({
                    where:{
                        id: req.body.note_id,
                        user_id: req.session.id
                    }

                }).then(() => {
                    res.status(200).send({message: "Folder was deleted"});
                }).catch(() => res.status(500).send({message: "Folder was not deleted"}));


			} else {

                Notes.destroy({
                    where:{
                        id: req.body.note_id,
                        user_id: req.session.id
                    }

                }).then(() => {
                    res.status(200).send({message: "Note was deleted"});
                }).catch(() => res.status(500).send({message: "Note was not deleted"}));
			}

		} else {


		}
	}).catch(() => res.status(400).send({message: "Server Error"}));
	} else {
		res.status(403).send({message: "You must close the folder before deleting it"});
    }
};

module.exports.getNotes = (req, res) => {

	Notes.findAll({
        attributes: ['id', 'title'],
		where:{
			user_id: req.session.id,
			isFolder: 0,
		},
		raw: true
	}).then((result) => {

        if(result.length) {
            res.status(200).send(result);
        }
        else{
            res.status(200).send({message: "Nothing to show"});
        }

	}).catch(() => res.status(500).send({message: "Database Error"}));

};

module.exports.getNote = (req, res) => {

	Notes.findOne({
		attributes: ['id', 'title', 'content'],
		where: {
            user_id: req.session.id,
            id: req.params.note_id,
			isFolder: 0
        },
		raw: true,
		}).then((result) => {
			if(result){
				res.status(200).send(result);
			} else {
				res.status(404).send({message: "Note not found"});
			}
		})
};

module.exports.getRoot = (req, res) => {

	Notes.findOne({
		where:{
			user_id:req.session.id,
			idParent: 0
		},
		raw: true
	}).then((result) => {

		req.session.note = result.id;
	Notes.findAll({
		attributes: ['id', 'title', 'isFolder', 'isPublic'],
		where: {
			user_id : req.session.id,
			isFolder: 1,
			idParent: result.id
		},
		raw:true,
	}).then((obtain) => {

		if(obtain.length){
			res.status(200).send(obtain);
		} else {
			res.status(204).send({message: "Nothing here"});
		}

	})

	}).catch(() => res.status(500).send({message: "db Error"}));

};

module.exports.getFolder = (req, res) => {

	Notes.findAll({
		attributes: ['id', 'title', 'isFolder'],
		where:{
			user_id:req.session.id,
			idParent: req.params.folder_id,
		},
		raw: true
	}).then((result) => {
        req.session.note = req.params.folder_id;
		if(result.length){

			res.status(200).send(result);
		}
		else {

			res.status(204).send({message: "This folder is empty"});
		}
	}).catch(() => res.status(500).send({message: "Server Error"}));
};

module.exports.getCurrent = (req, res) => {

    Notes.findAll({
        attributes: ['id', 'title', 'isFolder'],
        where:{
            user_id: req.session.id,
            idParent: req.session.note,
        },
        raw: true
    }).then((result) => {
        if(result.length){
            res.status(200).send(result);
        }
        else {
            res.status(204).send({message: "This folder is empty"});
        }
    }).catch(() => res.status(500).send({message: "Server Error"}));

};

module.exports.editNotes = (req, res) => {

	Notes.findOne({
		where:{
			user_id: req.session.id,
			id: req.body.note_id,
		}
	}).then((result) => {

		if(result){

			if(req.body.title && req.body.title.trim().length) {

				Notes.findOne({
                    where:{
                        user_id: req.session.id,
						title: req.body.title
                    },
					raw:true
				}).then((existing) => {

					if(existing && (existing.title != req.body.title)){
						res.status(204).send({message: "A note with this title exists here"});
					}
					else {
                        Notes.update({
                                title: req.body.title,
                                content: req.body.content
                            },
                            {
                                where: {
                                    id: req.body.note_id,
                                    user_id: req.session.id
                                }
                            }
                        ).then(() => res.status(200).send({message: "Note updated"}));
                    }
				})
            } else {
                Notes.update({
                        content: req.body.content
                    },
                    {
                        where: {
                            id: req.body.note_id,
                            user_id: req.session.id
                        }

                    }).then(() => res.status(200).send({message: "Note updated"}));
            }
		} else {
			res.status(404).send({message: "Note not found"});
		}
	}).catch(() => res.status(500).send({message: "Server error"}));
};

module.exports.changeAccess = (req, res) => {

	Notes.findOne({
		where:{
			user_id: req.session.id,
			id: req.params.note_id,
			isFolder: 1,
			idParent: {
				not: 0
			}
		}
		}).then((result) => {

			if(result){
			console.log(result.isPublic);
				if(result.isPublic){

					Notes.update({
						isPublic: 0
					}, {
						where: {
							user_id: req.session.id,
							idParent: req.params.note_id
						}
					});

                    Notes.update({
                        isPublic: 0
                    }, {
                        where: {
                            user_id: req.session.id,
                            id: req.params.note_id
                        }
                    }).then(() => {
                    	res.status(201).send({message: "Folder is now private"});
					})

				} else {
                    Notes.update({
                        isPublic: 1
                    }, {
                        where: {
                            user_id: req.session.id,
                            idParent: req.params.note_id
                        }
                    });

                    Notes.update({
                        isPublic: 1
                    }, {
                        where: {
                            user_id: req.session.id,
                            id: req.params.note_id
                        }
                    }).then(() => {
                        res.status(200).send({message: "Folder is now public"});
                    });
				}
			} else {
				res.status(400).send("Bad Request");
			}
		})
};


module.exports.getFriendRoot = (req, res) =>{

	Permissions.findOne({
		where:{
			owner_id: req.params.owner_id,
			friend_id: req.session.id
		},
		raw:true
	}).then((permission) => {

		if(permission) {

                Notes.findOne({
                    where: {
                        user_id: req.params.owner_id,
                        isFolder: 1,
                        idParent: 0,
                    },
                    raw: true,
                }).then((root) => {

                    if (root) {

                        req.session.friend_note = root.id;

                        Notes.findAll({
							attributes: ['id', 'title', 'isFolder'],
                            where: {
                                isPublic: 1,
                                idParent: req.session.friend_note,
                                user_id: req.params.owner_id,
                            }
                        }).then((folders) => {
                            if (folders.length) {
                                res.status(200).send(folders);
                            } else {
                                res.status(201).send({message: "This user has no public folders"});
                            }
                        })

                    } else {
                        res.status(400).send({message: "You don't have access"});
                    }
                })
            }
	}).catch(() => res.status(400).send({message: "No permission"}));

};

module.exports.getNotesFolder = (req, res) => {

	Permissions.findOne({
		where:{
			owner_id: req.params.owner_id,
			friend_id: req.session.id
		}
	}).then((permission)=> {

		if(permission){
			console.log(req.params.owner_id);
			Notes.findAll({
				attributes: ['id', 'title', 'content'],
				where:{
					user_id: req.params.owner_id,
					isFolder: 0,
					isPublic: 1,
					idParent: req.params.folder_id
				},
				raw:true
			}).then((notes) => {

				if(notes.length){
					res.status(200).send(notes);
				} else {
					res.status(201).send({message: "This folder is empty"});
				}
			})

		} else {
			res.status(403).send({message: "You don't have access"});
		}

    })

};

module.exports.getActualNotes = (req, res) => {
	Permissions.findOne({
		where:{
			friend_id: req.session.id,
			owner_id: req.params.owner_id,
		}
	}).then((permissions) =>
	{
		if(permissions){
		Notes.findOne({
			attributes: ['title', 'content'],
			where: {
				user_id: req.params.owner_id,
				id: req.params.note_id,
				isFolder: 0,
				isPublic: 1,
			},
			raw: true
		}).then((result) => {

			if (result) {
				res.status(200).send(result);
			}
			else {
				res.status(200).send({message: "Nothing to show"});
			}

		}).catch(() => res.status(500).send({message: "Database Error"}));

		} else {
			res.status(403).send({message: "Access not allowed"});
		}
		}).catch(() => res.status(500).send({message: "Error at searching permissions"}));
};