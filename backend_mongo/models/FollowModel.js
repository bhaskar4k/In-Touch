const mongoose = require('mongoose');
const schema = mongoose.Schema;

const followSchema = new schema(
    {
        username: { type: String },
        followed_by_username: { type: String }
    }
)

module.exports = mongoose.model("follow_infos", followSchema);