import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'utils/dotenv';
import configs from 'configs';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Welcome to Node Babel")
});

app.post('/login', (req, res) => {
    res.send("Login")
});

app.post('/logout', (req, res) => {
    res.send("Log out")
});

app.post('/signup', (req, res) => {
    res.send("Sign up")
});

app.get('/get_verify_code', (req, res) => {
    res.send("Get verify code")
});

app.post('/check_verify_code', (req, res) => {
    res.send("Check verify code")
});

app.post('/change_info_after_signup', (req, res) => {
    res.send("Change info after sign up")
});

app.get('/get_list_posts', (req, res) => {
    res.send("Get list posts")
});

app.get('/get_post', (req, res) => {
    res.send("Get post")
});

app.post('/add_post', (req, res) => {
    res.send("Add post")
});

app.put('/edit_post', (req, res) => {
    res.send("Edit post")
});

app.delete('/delete_post', (req, res) => {
    res.send("Delete post")
});

app.get('/get_comment', (req, res) => {
    res.send("Get comment")
});

app.post('/set_comment', (req, res) => {
    res.send("Set comment")
});

app.post('/report_post', (req, res) => {
    res.send("Report post")
});

app.post('/like', (req, res) => {
    res.send("Like")
});

app.post('/search', (req, res) => {
    res.send("Search")
});

app.get('/get_saved_search', (req, res) => {
    res.send("Get saved search")
});

app.delete('/del_saved_search', (req, res) => {
    res.send("Delete saved search")
});

app.get('/get_user_friends', (req, res) => {
    res.send("Get user friends")
});

app.get('/get_user_info', (req, res) => {
    res.send("Get user info")
});

app.put('/set_user_info', (req, res) => {
    res.send("Set user info")
});

app.get('/get_list_videos', (req, res) => {
    res.send("Get list videos")
});

app.get('/get_list_blocks', (req, res) => {
    res.send("Get list blocks")
});

app.post('/set_block', (req, res) => {
    res.send("Set block")
});

app.post('/set_accept_friend', (req, res) => {
    res.send("Set accept friend")
});

app.get('/get_requested_friends', (req, res) => {
    res.send("Get requested friends")
});

app.post('/set_request_friend', (req, res) => {
    res.send("Set request friend")
});

app.get('/get_push_settings', (req, res) => {
    res.send("Get push settings")
});

app.post('/set_push_settings', (req, res) => {
    res.send("Set push settings")
});

app.post('/change_password', (req, res) => {
    res.send("Change password")
});

app.get('/check_new_version', (req, res) => {
    res.send("Check new version")
});

app.post('/set_devtoken', (req, res) => {
    res.send("Set dev token")
});

app.get('/get_conversation', (req, res) => {
    res.send("Get conversation")
});

app.delete('/delete_message', (req, res) => {
    res.send("Delete message")
});

app.get('/get_list_conversation', (req, res) => {
    res.send("Get list conversations")
});

app.delete('/delete_conversation', (req, res) => {
    res.send("Delete conversation")
});

app.get('/get_list_suggested_friends', (req, res) => {
    res.send("Get list suggested friends")
});

app.get('/check_new_item', (req, res) => {
    res.send("Check new item")
});

app.get('/get_notification', (req, res) => {
    res.send("Get notification")
});

app.post('/set_read_message', (req, res) => {
    res.send("Set read message")
});

app.post('/set_read_notification', (req, res) => {
    res.send("Set read notification")
});

app.listen(configs.apiPort, () => {
    console.log(`API is running on ${configs.apiPort}`);
})
