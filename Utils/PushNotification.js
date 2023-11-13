const { Expo } = require('expo-server-sdk');
const expo = new Expo();

// Hàm để gửi tin nhắn
module.exports.sendPushNotification = async (expoPushToken) => {
    expo.sendPushNotificationsAsync([
        {
            to: expoPushToken,
            title: "test",
            body: "test",
        },
    ])


}