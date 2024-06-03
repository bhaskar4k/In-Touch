const mongoose = require('mongoose');
const schema = mongoose.Schema;

const followingCountSchema = new schema(
    {
        username: { type: String },
        count: { type: Number }
    }
)

module.exports = mongoose.model("following_counts", followingCountSchema);