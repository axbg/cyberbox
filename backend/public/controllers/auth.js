let Users = require('../models').Users;
let session = require('client-sessions');
let Files = require('../models').Files;
let Notes = require('../models').Notes;
let axios = require('axios');


module.exports.gLogin = (req, res) => {

    axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + req.body.token)
        .then((response) => {

            Users.findOne({
                attributes: ['id', 'token', 'name', 'email'],
                where: {
                    email: response.data.email
                }
            }).then((result) => {

                if (result) {

                    if (req.session.id) {

                        res.status(200).send({message: "You are already logged in"});

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
                            raw: true
                        }).then((output) => {
                            req.session.folder = output.id;
                        }).catch(() => res.status(500).send({message: "Server error"}));

                        Notes.findOne({
                            where: {
                                title: req.session.email,
                                user_id: req.session.id,
                                idParent: 0,
                                isFolder: 1,
                            },
                            raw: true
                        }).then((output) => {
                            req.session.note = output.id;
                            res.status(200).send({message: "You were logged in"});
                        }).catch(() => res.status(500).send({message: "Server error"}));
                    }
                } else {
                    res.status(203).send({message: "Incorrect log in credentials"});
                }
            }).catch(() => res.status(500).send({message: "Server error"}));
        });
};

module.exports.Login = (req, res) => {

    Users.findOne({
        attributes: ['id', 'token', 'name', 'email'],
        where: {
            email: req.body.email
        }
        }).then((result) => {
            if(result){

                if(req.session.id){

                    res.status(200).send({message: "You are already logged in"});

                } else {

                    req.session.id = result.id;
                    req.session.token = result.token;
                    req.session.email = req.body.email;
                    req.session.friend_folder = 0;
                    req.session.friend_note = 0;

                    Files.findOne({
                        where: {
                            name: req.session.email,
                            user_id: req.session.id,
                            idParent: 0,
                            isFolder: 1,
                        },
                        raw: true
                    }).then((output) => {
                        req.session.folder = output.id;
                    }).catch(() => res.status(500).send({message:"Server error"}));

                    Notes.findOne({
                        where: {
                            title: req.session.email,
                            user_id: req.session.id,
                            idParent: 0,
                            isFolder: 1,
                        },
                        raw: true
                    }).then((output) => {
                        req.session.note = output.id;
                        res.status(200).send({message: "You were logged in"});
                    }).catch(() => res.status(500).send({message:"Server error"}));
                }
            } else {
                res.status(403).send({message: "Incorrect log in credentials"});
            }
    }).catch(() => res.status(500).send({message: "Server error"}));

};


module.exports.Logout = (req,res) => {

    req.session.destroy();
    res.status(200).send({message: "You were logged out"});

};