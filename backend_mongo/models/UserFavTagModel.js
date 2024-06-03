const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserFavTagSchema = new schema(
    {
        username: { type: String },
        tag: { type: Array },
    }
)

module.exports = mongoose.model("user_fav_tags", UserFavTagSchema);