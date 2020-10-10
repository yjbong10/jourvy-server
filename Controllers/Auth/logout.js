const logoutHandler = () => (req, res) => {
    res.cookie('jwt', '', { httpOnly:true, secure:false, maxAge: 0})
    res.json('logout server')
}

module.exports = {
    logoutHandler: logoutHandler
}