let express = require('express'),
  router = express.Router(),
  groupSerializer = require('../serializers/group-serializer'),
  taskSerializer = require('../serializers/task-serializer'),
  groupModel = require('../models/group'),
  taskModel = require('../models/task'),
  _ = require('lodash');

router.get('/', function(req, res, next) {
  groupModel.find({})
    .then(groups => groupSerializer.serialize(groups))
    .then(serializedGroups => res.json(serializedGroups))
    .catch(error => res.status(404).json(error));
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;

  groupModel.findById(id)
    .populate('tasks')
    .then(group => groupSerializer.serialize( group ))
    .then(serializedGroup => res.json(serializedGroup))
    .catch(error => res.status(404).json(error));
});

router.post('/', function(req, res, next) {
  const { body } = req,
    newGroup = Object.assign(new groupModel(), body.group);

  newGroup.save()
    .then(savedGroup => groupSerializer.serialize(savedGroup))
    .then(serializedGroup => res.json(serializedGroup))
    .catch(error => res.status(404).json(error));
});

router.put('/:id', function(req, res, next) {
  const { body, params } = req,
    groupToUpdate = body.group,
    { id } = params;

  groupModel.findByIdAndUpdate(id, groupToUpdate, { new: true })
    .then(updatedGroup => groupSerializer.serialize(updatedGroup))
    .then(serializedGroup => res.json(serializedGroup))
    .catch(error => res.status(404).json(error));
});

router.delete('/:id', function(req, res, next) {
  const { body, params } = req,
  { id } = params;

  taskModel.update({ groupId: id }, { $set: { groupId: null }}, { multi: true })
    .then(updatedItems => console.log(updatedItems))

  groupModel.findByIdAndRemove(id)
    .then(removedGroup => groupSerializer.serialize(removedGroup))
    .then(serializedGroup => res.json(serializedGroup))
    .catch(error => res.status(404).json(error));
});


module.exports = router;
