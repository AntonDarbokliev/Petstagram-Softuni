const Photo = require("../models/Photo.js");

async function create(photoData, userId) {
  const creature = {
    name: photoData.name,
    imageUrl: photoData.imageUrl,
    age: photoData.age,
    description: photoData.description,
    location: photoData.location,
    comments: photoData.comments,                    // CHANGE PROPERTIES ACCORDING TO THE TASK
    owner: userId,
  };
  const result = await Photo.create(creature);

  return result;
}

async function getAll() {
  return Photo.find({}).lean().populate('owner').populate('comments');
}

async function getById(id) {
  return Photo.findById(id).lean().populate('owner').populate('comments');
}

async function find(name) {
  return Photo.find({ name: { $regex: name, $options: "i" } }).lean();
}

async function edit(id, data) {
  return Photo.updateOne({ _id: id }, { $set: data }, { runValidators: true });
}

async function del(id) {
  return Photo.findByIdAndDelete(id);
}

async function buy(gameId,userId){
  return Photo.findByIdAndUpdate(gameId,{$push : {boughtBy : userId}})    // CHANGE FUNCTION NAME AND PROPERTIES ACCORDING TO THE TASK
}

async function getLastThree(){
    return Photo.find().sort({_id : -1}).limit(3).lean()
}

module.exports = {
  create,
  getAll,
  getById,
  find,
  edit,
  del,
  buy,
  getLastThree
};
