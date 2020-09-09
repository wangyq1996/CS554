const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const movieCollection = mongoCollections.movies;
const movies = require('./movies');
const ObjID = require('mongodb').ObjectID;

const addComment = async (id, name, comment) => {
    if (typeof name !== 'string') throw 'Invalid Comment Name';

    if (typeof comment !== 'string') throw 'Invalid Comment';

    const oldMovie = await movies.getMovieById(id);

    const commentCollection = await comments();

    const newComment = {
        name: name,
        comment: comment,
    };

    const newCommentInformation = await commentCollection.insertOne(newComment);
    if (newCommentInformation.insertedCount === 0) throw 'Insert Failed';
    const newID = newCommentInformation.insertedId;

    const insertedComment = {
        id: newID,
        name: newComment.name,
        comment: newComment.comment,
    };

    oldMovie.comments.push(insertedComment);

    const movieCollections = await movieCollection();

    await movieCollections.updateOne({ _id: ObjID(id) }, { $set: oldMovie });

    return getCommentById(newID.toString());
};

const getCommentById = async (commentId) => {
    const commentCollection = await comments();

    const comment = await commentCollection.findOne({ _id: ObjID(commentId) });
    if (!comment) throw 'No Comment Found';

    return comment;
};

const deleteComment = async (commentId, movieId) => {
    await getCommentById(commentId);
    const oldMovie = await movies.getMovieById(movieId);

    for (let i = 0; i < oldMovie.comments.length; i++) {
        if (oldMovie.comments[i].id.toString() === commentId) {
            oldMovie.comments.splice(i, 1);
            break;
        }
    }
 
    const movieCollections = await movieCollection();

    await movieCollections.updateOne({ _id: ObjID(movieId) }, { $set: oldMovie });

    const commentCollection = await comments();

    const deletionInfo = await commentCollection.removeOne({
        _id: ObjID(commentId),
    });
    if (deletionInfo.deletedCount === 0) throw 'No user deleted';
    return true;
};

module.exports = {
    addComment,
    deleteComment,
}