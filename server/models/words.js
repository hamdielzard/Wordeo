const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordSchema = new Schema ({
    word: {
        type: String,
        required: true
    },
    hints: [{
        type: String,
        required: false
    }],
}) 

// mongoose will reference the collection 'Words' from the database
const Word = mongoose.model('Word', WordSchema);

// export
module.exports = Word;