const Permissions = require("../models").Permissions;
const Users = require("../models").Users;

module.exports.createPermissions = (req, res)=> {

    Users.findOne({
        where:{
            email: req.body.email,
        },
        raw:true,
    }).then((email) => {

        if (email.id.toString() !== req.session.id.toString()) {
            Permissions.findOne({

                where: {
                    owner_id: req.session.id,
                    friend_id: email.id
                },
                raw: true
            }).then((result) => {

                if (result) {
                    Permissions.destroy({
                        where: {
                            owner_id: req.session.id,
                            friend_id: email.id,
                        }
                    }).then(() => res.status(200).send({message: "Permission removed"})
                    ).catch(() => res.status(404).send({message: "Not found"}));
                }
                else {
                    Permissions.create({
                        owner_id: req.session.id,
                        friend_id: email.id,
                        created: Date.now()
                    }).catch(() => res.status(500).send({message: "Server Error!"}));
                    res.status(201).send({message: "Permission granted"});
                    //also we can send an email here to the person who received the permission
                }
            })
        } else {
            res.status(204).send({message: "You cannot grant permissions to yourself!"});
        }
    }).catch(() => res.status(203).send({message: "No user has this email"}));
};

module.exports.getPermissionsGranted  = (req, res)=>{

	Permissions.findAll({
		where:{
			owner_id: req.session.id
		},
		raw: true
	}).then((result) => {

		if(result){

            let arr = result.map(a => a.friend_id);

            Users.findAll({
                attributes: ['email', 'name', 'id'],
                where:{
                    id: arr,
                },
                raw:true
            }).then((permissions) => {
                if(permissions.length) {
                    res.status(200).send(permissions);
                }
                else {
                    res.status(201).send({message:"No user found"});
                }
            });

        } else {

		    res.status(200).send({message: "No user found"});
        }

	}).catch(()=> res.status(500).send({message: "Server Error"}));
};

module.exports.getPermissionsReceived = (req, res) => {
    req.session.friend_folder = 0;
    req.session.friend_note = 0;
    Permissions.findAll({
        attributes: ['owner_id'],
        where:{
            friend_id: req.session.id
        },
        raw: true
    }).then((result) => {

        if(result){

            let arr = result.map(a => a.owner_id);

            Users.findAll({
                attributes: ['email', 'name', 'id'],
                where:{
                    id: arr
                },
                raw:true
            }).then((permissions) => {

                if(permissions.length) {
                    res.status(200).send(permissions);
                }
                else {
                    res.status(200).send({message:"No user found"});
                }
            });

        } else {

            res.status(200).send({message: "No user found"});
        }

    }).catch(()=> res.status(500).send({message: "Server Error"}));
};

module.exports.searchEmail = (req,res) => {

    Users.findAll({
        attributes: ['email'],
        where:{
            email:{
                $like: req.params.content + "%"
            }
        },
        limit: 4,
        raw:true
    }).then((result) => {

        if(result.length){
            res.status(200).send(result);
        } else {
            res.status(203).send({message:"nothing found"});
        }

    })
};