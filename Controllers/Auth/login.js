const loginHandler = (knex, bcrypt, createToken, Age) => (req, res) => {
    const { email, password } = req.body
    knex.select('email', 'hash').from('login').where('email', email)
        .then(data => {
            const isMatch = bcrypt.compareSync(password, data[0].hash);
            if (isMatch) {
                return knex.select('*')
                .from('users')
                .join('settings', {'settings.email': 'users.email'})
                .where('users.email', email)
                .then(user => {
                    const token = createToken(user[0].email)
                    res.cookie('jwt', token, { httpOnly:true, secure:true, maxAge: Age * 1000, sameSite: 'none'}) //12hrs to milisecs
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('something is wrong :('))
            } else {
                res.json('Wrong password.')
            }
        })
        .catch(err => res.status(400).json("Email doesn't exist"))
}

module.exports = {
    loginHandler: loginHandler
}