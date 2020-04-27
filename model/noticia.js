const mongoose = require('mongoose');

const NoticiaSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String
})

const Noticia = mongoose.model('noticia', NoticiaSchema);

module.exports = Noticia