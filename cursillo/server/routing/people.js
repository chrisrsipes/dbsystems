var express = require('express');
var _ = require('underscore');
var bcrypt = require('bcrypt');

var auth = require('../utils/auth');
var validations = require('../utils/validations');
var constants = require('../utils/constants');
var Person = require('../models/person');

var router = express.Router();

router.use(auth.authenticate);
router.use(auth.authorize);


// endpoints

// get all people
router.get('/', function (req, res) {

  var finish = function (err, rows, fields) {
    console.log('err', err);
    if (err) {
      res.status(constants.http.INTERNAL_ERROR.status).json({message: constants.http.INTERNAL_ERROR.message});
    }
    else {
      res.status(constants.http.SUCCESS.status).json(rows);
    }
  };

  Person.findAll(finish);

});

// create a new person
router.post('/', function (req, res) {
  var person = Person.schema(req.body);

  var finish = function (err, result) {
    if (err) {
      res.status(constants.http.INTERNAL_ERROR.status).json({message: constants.http.INTERNAL_ERROR.message});
    }
    else {
      person.id = result.insertId;
      res.status(constants.http.SUCCESS.status).json(person);
    }
  };

  Person.create(person, finish);

});

// get person by id
router.get('/:personId', function (req, res) {
  var person, personId = req.params.personId;

  var finish = function (err, rows, fields) {
    if (err) {
      res.status(constants.http.INTERNAL_ERROR.status).json({message: constants.http.INTERNAL_ERROR.message});
    }
    else if (rows.length === 0) {
      res.status(constants.http.NO_CONTENT.status).json({message: constants.http.NO_CONTENT.message});
    }
    else {
      person = rows && rows[0] || {};
      res.status(constants.http.SUCCESS.status).json(person);
    }

  };

  if (validations.validateNonEmpty(personId) && validations.validateNumeric(personId)) {
    Person.findById(personId, finish);
  }
  else {
    res.status(constants.http.BAD_REQUEST.status).json({message: constants.http.BAD_REQUEST.message});
  }
});

// update person by id
router.put('/:personId', function (req, res) {
  var personId = req.params.personId;
  var person = Person.schema(req.body);

  var finish = function (err, rows, fields) {
    if (err) {
      res.status(constants.http.INTERNAL_ERROR.status).json({message: constants.http.INTERNAL_ERROR.message});
      return;
    }

    res.status(constants.http.SUCCESS.status).json(person);
  };

  if (validations.validateNonEmpty(personId) && validations.validateNumeric(personId)) {
    Person.updateById(personId, person, finish);
  }
  else {
    res.status(constants.http.BAD_REQUEST.status).json({message: constants.http.BAD_REQUEST.message});
  }

});

// delete person by id
router.delete('/:personId', function (req, res) {
  var person, personId = req.params.personId;

  var finish = function (err, rows, fields) {
    if (err) {
      res.status(constants.http.INTERNAL_ERROR).json({message: constants.http.INTERNAL_ERROR});
      return;
    }

    res.status(constants.http.NO_CONTENT.status).json({message: 'Successfully deleted.'});
  };

  if (validations.validateNonEmpty(personId) && validations.validateNumeric(personId)) {
    Person.deleteById(personId, finish);
  }
  else {
    res.status(constants.http.BAD_REQUEST.status).json({message: constants.http.BAD_REQUEST.message});
  }
});

module.exports = router;
