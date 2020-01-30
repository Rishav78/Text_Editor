const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    text: {
        type: String,
    }
});

module.exports = mongoose.model('texts', textSchema);
