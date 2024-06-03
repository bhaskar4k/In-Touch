const express = require('express');
const { get_post_count, get_all_post, add_post, delete_post,
    like_control, is_liked, do_comment, get_comment, get_like_count,
    get_all_like_list, do_follow, setting_up_following_schema_on_creating_new_profile, get_feed,
    get_follower_and_following_info, is_followerd, update_post, get_follower_list, get_following_list } = require('../controllers/PostController');

const { check_cache } = require("../controllers/RedisCache");
const router = express.Router();


router.post('/setup', setting_up_following_schema_on_creating_new_profile)
router.post('/add_post', add_post)
router.post('/delete_post', delete_post)
router.get('/get_all_post/:username/:offset', get_all_post)
router.get('/get_post_count/:username', get_post_count)
router.post('/like_control', like_control)
router.get('/is_liked/:post_id/:username', is_liked)
router.get('/get_like_count/:post_id', get_like_count)
router.get('/get_all_like_list/:post_id/:offset', get_all_like_list)
router.post('/do_comment', do_comment);
router.get('/get_comment/:post_id/:offset', get_comment)
router.post('/do_follow', do_follow)
router.get('/get_follower_and_following_info/:username', get_follower_and_following_info)
router.get('/is_followerd/:username/:followed_by_username', is_followerd)
router.get('/get_follower_list/:username/:offset', get_follower_list)
router.get('/get_following_list/:username/:offset', get_following_list)
router.post('/update_post', update_post);
//router.get('/get_feed/:username/:offset', check_cache, get_feed);
router.get('/get_feed/:username/:offset', get_feed);

module.exports = router;