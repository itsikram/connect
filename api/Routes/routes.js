
const authRoutes = require('./authRoutes')
const profileRoutes = require('./profileRoutes')
const PostRoutes = require('./postRoutes')
const friendRoutes = require('./friendRoutes')
const reactRoutes = require('./reactRoutes')
const commentRoutes = require('./commentRoutes')
const uploadRoute = require('./uploadRoute')
const path = require('path')

let rootRoute = async (req,res) => {
    return res.sendFile(path.join(__dirname, "build", "index.html"));

}
const routes = [

    {
        path: '/api/auth',
        handler: authRoutes
    },
    {
        path: '/api/profile',
        handler: profileRoutes
    },
    {
        path: '/api/post',
        handler: PostRoutes
    },
    {
        path: '/api/friend',
        handler: friendRoutes
    },
    {
        path: '/api/react',
        handler: reactRoutes
    },
    {
        path: '/api/comment',
        handler: commentRoutes
    }, {
        path: '/api/upload',
        handler: uploadRoute
    }
]

module.exports = app => {

    routes.forEach(r => {

        app.use(r.path,r.handler)
        
    })
}







