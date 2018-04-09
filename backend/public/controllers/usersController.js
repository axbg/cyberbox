const Users = require("../models").Users;
const Settings = require("../models").Settings;
let crypto = require("crypto");
const Files = require("../models").Files;
const Notes = require("../models").Notes;
const mkdir = require('make-dir');
let rmdir = require('rmdir');
const path = require('path');
const Reminders = require ("../models").Reminders;
const Permissions = require ("../models").Permissions;
let cron= require('node-cron');
let nodemailer = require('nodemailer');

/*
module.exports.createUser = (req,res) => {

    Users.findOne({
        where: {
            email: req.body.email
        },
        raw: true
    }).then((result) => {

        if (result) {
            res.status(302).send({message: "Email already registered"});
        }
        else {
            tokenizer = crypto.randomBytes(64).toString('hex');

            Users.create({
                email: req.body.email,
                name: req.body.name,
                token: tokenizer,
                isAdmin: 0
            }).then((result) => {

                Settings.create({
                    user_id: result.id,
                    push: 1,
                    mail: 0
                });
                
				let location = path.join(__dirname, '..', '..', '..', 'files', req.body.email.toString());
                mkdir(location);
                Files.create({
                    user_id: result.id,
                    idParent: 0,
                    name: req.body.email,
                    isPublic: 1,
                    isFolder: 1,
                    path: location
                });

                let locationNotes = path.join(__dirname, '..', '..', '..', 'notes', req.body.email.toString());
                mkdir(locationNotes);
                Notes.create({
                	user_id: result.id,
                	idParent: 0,
                	title: req.body.email,
                	isPublic: 0,
                	isFolder: 1,
                	path: locationNotes
                });
                
            }).then(() => res.status(201).send({message: "You were registered"})
            )
        }

    });

};
*/

module.exports.Welcome = (req, res) => {

	Users.findOne({
		where:{
			email: req.session.email
		}
	}).then((response) => {
		let info = [];

		info['name'] = response.name;

		Files.count({
			where:{
				user_id: response.id,
				isFolder: 0
			}
		}).then((files) => {
			info['files'] = files;


        Notes.count({
			where:{
				user_id: response.id,
				isFolder: 0
			}
		}).then((notes) => {
			info['notes'] = notes;


			Reminders.count({
				where:{
					user_id: response.id,
					isDone:0
				}
			}).then((reminders) => {
				info['reminders'] = reminders;

				res.status(200).send({name: info['name'], files: info['files'], notes: info['notes'], reminders:info['reminders']});
			})

		})
		})

})

};


module.exports.deleteUser = (req,res) => {

	Users.findOne({
		where:{
			email: req.body.email
		},
		raw: true
	}).then((result) => {

		if(result){

			Users.destroy({
				where:{
					email: req.body.email
				}
			}).then((result) => {

				Settings.destroy({
					where:{
						user_id: result.id
					}
				});

				
				Files.destroy({
					where:{
						user_id: result.id
					}
				});

				rmdir(location, () =>{ req.status(200).send("Notes Folder has been removed")});
				
				Notes.destroy({
					where:{
						user_id: result.id
					}
				});
				rmdir(locationNotes, () =>{ req.status(200).send("Notes Folder has been removed")});

				Reminders.destroy({
					where:{
						user_id: result.id
					}
				});

				Permissions.destroy({
					where:{
						user_id: result.id
					}
				});

			}).catch(() => res.status(500).send({message: "User cannot be deleted"}));

			res.status(200).send({message: "User was deleted"});
		}
		else{
			res.status(404).send({message: "User was not found"});
		}

	});
};

module.exports.getUsers = (req, res) => {

	Users.findAll({
		attributes: ['id', 'name', 'email', 'isAdmin'],
		raw: true
	}).then((result) => {

		res.status(200).send(result);

	}).catch(() => res.status(500).send({message: "Database Error"}));
};


module.exports.getOneUser = (req, res) => {

	Users.findOne({
		attributes: ['id', 'name', 'email'],
		where: {
			email: req.params.email
		},
		raw:true
	}).then((result) => {

		if(result){
			res.status(200).send(result);
		} else {
			res.status(404).send({message:"User not found!"});
		}
	})
};


cron.schedule('0 0 6 * * *', function(){

	Reminders.findAll({
		where:{
			isDone: 0
		}
	}).then((result) => {

		for(let i = 0; i < result.length; i++){

            let data = result[i].expiration;

            let day = data.substring(8,10);

            let month = data.substring(6,7);

            let data_now = new Date();

            let day_now = data_now.getDate();

            let month_now = data_now.getMonth() + 1;

            if(day == day_now && month == month_now){

            	Users.findOne({
					where:{
						id: result[i].user_id
					}
				}).then((sender)=>{

					Settings.findOne({
						where:{
							user_id: sender.id
						}
					}).then((permission) => {

						if(permission.dataValues.mail === true){

                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'cyberbox.app@gmail.com',
                                    pass: 'neamfacutgmail'
                                }
                            });

                            let mailOptions = {
                                from: 'Cyberbox',
                                to: sender.email,
                                subject: 'You have a reminder set for today',
                                text: result[i].title
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            })
						}
					})

				});
			}
		}
	});
});
