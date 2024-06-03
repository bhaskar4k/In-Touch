const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new schema(
    {
        comment_id: { type: String },
        post_id: { type: String },
        username: { type: String },
        comment_description: { type: String },
        upload_date: { type: String },
        upload_time: { type: String }
    }, { timestamps: true }
)

module.exports = mongoose.model("comment_infos", commentSchema);