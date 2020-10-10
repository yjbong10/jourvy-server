const landingVerifyHandler = (jwt, JWT_SECRET, knex) => (req, res) => {
    const token =  req.cookies['jwt'];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err) {
                return knex.select('*').from('users').where('email', decoded.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.json(err));
            } else {
                res.json('wrong token') 
            }
        })
    } else {
        res.json('Welcome !!!')
    }
}

module.exports = {
    landingVerifyHandler: landingVerifyHandler
}