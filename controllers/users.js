var express = require('express');
var User = require('../models/user');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);
      res.send(users);
    });
  })
  .post(function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (user) {
        res.status(401).send({
          message: 'Account already exists for this email address. Do you want to login?'
        });
      } else {
        User.create(req.body, function(err, user) {
          if (err) return res.status(500).send(err);
          // Use jwt to login newly-created user.
          var secret = "blankslatejwtsecret";
          var token = jwt.sign(user, secret);
          res.send({user: user, token: token});
        });
      }
    });
  });

router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

module.exports = router;
