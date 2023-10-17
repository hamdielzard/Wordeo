const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema ({
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true}) // creates 'createdAt' & 'updatedAt' timestamps automatically

// mongoose will reference the collection 'Accounts' from the database
const Account = mongoose.model('Account', AccountSchema);

// export
module.exports = {
    Account
};