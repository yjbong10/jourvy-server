const verifyHandler = (knex, bcrypt) => (req, res) => {
    const { password, email } = req.body

    knex.select('hash').from('login').where('email', email)
    .then(data => {
        const isMatch = bcrypt.compareSync(password, data[0].hash);
        if(isMatch) {
            res.json(true)
        } else {
            res.json(false)
        }
    })
    .catch(err => res.status(400).json('something is wrong. :('))
}

module.exports = {
    verifyHandler: verifyHandler
}