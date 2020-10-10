const deleteAccountHandler = (knex, bcrypt) => (req, res) => {
    const { email, password } = req.body

    knex.select('hash').from('login').where('email', email)
    .then(data => {
        const isMatch = bcrypt.compareSync(password, data[0].hash);
        if(isMatch) {
            knex.transaction(trx => {
                return trx('profile').where('email', email).del()
                    .then(() => trx('settings').where('email', email).del())
                    .then(() => trx('posts').where('email', email).del())
                    .then(() => trx('users').where('email', email).del())
                    .then(() => trx('login').where('email', email).del())
                    .then(data => res.json('account has been deleted. Logging out...'))
                    .then(trx.commit)
                    .catch(trx.rollback)
            })
            .catch(err => res.status(400).json(err.message))
        } else {
            res.status(400).json('wrong password. Logging out...')
        }
    })
    .catch(err => res.json("users doesn't exist"))
}

module.exports = {
    deleteAccountHandler: deleteAccountHandler
}