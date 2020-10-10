const registerHandler = (bcrypt, saltRounds, knex) => (req, res) => {
    const { name, email, password } = req.body;
        
    const nameRegex = /^[\w][a-z\d]{3,15}$/gi;
    const emailRegex = /^[\w\d]{3,}@[\w]{3,}.[\w]{2,10}(.[\w]{2,10})?$/gi;
    const passwordRegex = /^.[^\s]{5,15}$/gi;

    if (!nameRegex.test(name)) {
        res.json('Name must contained 4 - 15 characters');
    } else if (!emailRegex.test(email)) {
        res.json('Email must contained 3 - 15 characters');
    } else if (!passwordRegex.test(password)) {
        res.json('Password must contained 6 - 15 characters');
    } else {

        const hash = bcrypt.hashSync(password, saltRounds);
        knex.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('profile')
                    .insert({email: loginEmail[0]})
                    .returning('email')
                    .then(profileEmail => {
                        return trx('settings')
                            .insert({email: profileEmail[0]})
                            .returning('email')
                            .then(settingsEmail => {
                                return trx('users')
                                .returning('*')
                                .insert({
                                    name: name,
                                    email: settingsEmail[0],
                                    joined: new Date()
                                })
                                .then(user => {
                                        res.json(user[0])
                                })
                                .catch(err => res.status(400).json('unable to register'))
                            })
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Email has been taken.'))
    }
}

module.exports = {
    registerHandler: registerHandler
}