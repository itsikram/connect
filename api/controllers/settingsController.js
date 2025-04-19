const Setting = require('../models/Setting')

exports.getSetting = async(req,res,next) => {

}

exports.addSetting = async(req,res,next) => {
    
}

exports.updateSetting = async(req,res,next) => {
    let settingObejct = req.body
    let profileId = req.profile._id

    let isSettings = await Setting.exists({profile: profileId})
    if(!isSettings) {
        let newSetting = new Setting({
            profile: profileId,
            settingObejct
        })

        let savedNewSetting = await newSetting.save()
        if(savedNewSetting) {
            return res.json(savedNewSetting).status(200)
        }
    }

    let updatedSetting = await Setting.findOneAndUpdate({profile: profileId},settingObejct, {new: true});

    if(updatedSetting) {
        return res.json(updatedSetting).status(200)
    }

    if(settingObejct) {
        let 
    }
}