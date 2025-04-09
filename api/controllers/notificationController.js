const Notification = require('../models/Notification')


exports.postNotification = async(req,res,next) => {

    let receiverId = req.body.receiverId
    let notificationText = req.body.text;
    let notificationLink = req.body.link || '/';
    let notificationIcon = req.body.icon || null;
    let notificationType = req.body.type || null;
    let notification = new Notification({
        receiverId,
        text: notificationText,
        link: notificationLink,
        icon: notificationIcon,
        type: notificationType,

    })

    let newNotification = await notification.save()
    if(newNotification) {
        return res.json({message: 'New Notification Created'}).json(200)
    }
    return res.json({message: 'Notification Creation Failed'}).json(400)

}

exports.getNotifications = async(req,res,next) => {
    let receverId = req.query.receverId;
    let notifications = await Notification.find({receverId: receverId})
    if(notifications) {
        return res.json(notifications).status(200)
    }
    return res.json({message: 'Failed to get notificaiton'}).status(400)

}