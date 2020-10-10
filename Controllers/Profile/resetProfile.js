const e = require("express");

const resetProfileHandler = (knex, bcrypt) => (req, res) => {
    const { email, password } = req.body
    knex.select('hash').from('login').where('email', email)
    .then(data => {
        const isMatch = bcrypt.compareSync(password, data[0].hash);
        if (isMatch) {
            knex.transaction(trx => {
                trx('profile').where('email', email)
                .update({
                    'total_posts': 0,
                    'total_edits': 0,
                    'total_deletes': 0
                }).returning('email')
                .then(returnedEmail => {
                    return trx('posts').where('email', returnedEmail[0]).del()
                    .then(numDeleted => {
                        if(numDeleted) {
                            res.json(`Profile has been reset and ${numDeleted} posts deleted.`)
                        } else {
                            res.json('Profile has been reset.')
                        }
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
                })
                .then(trx.commit)
                .catch(err => {
                    trx.rollback
                    res.json('somthing is wrong. :(')
                })
            })
            .catch(err => res.json(err.message))
        } else {
            res.status(400).json('wrong password.')
        }
    })
    .catch(err => res.json('something is wrong. :('))
}

module.exports = {
    resetProfileHandler: resetProfileHandler
}