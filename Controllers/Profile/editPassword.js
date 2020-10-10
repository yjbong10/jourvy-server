const editPasswordHandler = (knex, bcrypt, saltRounds) => (req, res) => {
    const { email, password, newPassword } = req.body

    const passwordRegex = /^.[^\s]{5,15}$/gi;
    if ( password === newPassword ) {
        res.json("new password cannot be same as the current's.")
    } else if (!passwordRegex.test(newPassword)) {
        res.json('Password must contained 6 - 15 characters');
    } else {
        
        knex.select('email', 'hash').from('login').where('email', email)
        .then(data => {
            const isMatch = bcrypt.compareSync(password, data[0].hash);
            if(isMatch){
                const newHash = bcrypt.hashSync(newPassword, saltRounds);
                knex('login')
                    .where('email', email)
                    .update('hash', newHash)
                    .returning('*')
                    .then(userLogin => {
                        res.json('user password has been successfuly changed.')
                    })
                    .catch(err=> res.json('unable to edit.'))
            } else {
                res.json('wrong password.')
            }
        })
        .catch(err => res.json('something is wrong. :('))
    }
}

module.exports = {
    editPasswordHandler: editPasswordHandler
}