const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],

});

module.exports = Family = mongoose.model("family", FamilySchema);
