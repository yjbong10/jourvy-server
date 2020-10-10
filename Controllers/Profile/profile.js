const profileHandler = (knex) => (req, res) => {
    const { email } = req.body
    knex.select('*').from('profile').where('email', email)
        .then(profile => {
            if (profile[0].email) {
                res.json(profile[0])
            } else {
                res.json('profile not found')
            }
        }).catch(err => {
            res.json('something is wrong :(')
        })
}

module.exports = {
    profileHandler: profileHandler
}