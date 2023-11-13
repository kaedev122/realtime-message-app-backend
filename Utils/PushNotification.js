const { Expo } = require('expo-server-sdk');
const expo = new Expo();

// Hàm để gửi tin nhắn
module.exports.sendPushNotification = async (expoPushToken, username, message, groupName) => {
    try {
        if (expoPushToken == undefined)
            return
        if (!message) {
            message = 'Đã gửi một hình ảnh!'
        }
        expo.sendPushNotificationsAsync([
            {
                to: expoPushToken,
                title: groupName ? groupName : username,
                body: groupName ? `${username}: ${message}` : `${message}`,
            },
        ])
    } catch (err) {
        console.log(err);
    }
}