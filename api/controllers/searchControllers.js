
const Profile = require('../models/Profile')

exports.getSearchResult = async (req, res, next) => {
    try {

        let queryString = req.query.input || ''

        let usersFound = await Profile.find({
            fullName: {
                $regex: queryString,
                $options: 'i'
            }
        })

        if(usersFound) {
            console.log(usersFound)
            return res.json(usersFound).status(200)
        }

        return res.json({message: 'Not Profile Found'}).status(400)


    }catch(e){next(e)}
}
