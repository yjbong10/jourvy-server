const editNameHandler = (knex) => (req, res) => {
    const { name, email, newName } = req.body

    const nameRegex = /^[\w][a-z\d]{3,15}$/gi;
    if(name === newName) {
        res.json("New name cannot be same as the current's")

    }else if (!nameRegex.test(newName)) {
        res.json('Name must contained 4 - 15 characters');

    } else {
        knex('users').where({'email': email, 'name': name})
        .update('name', newName)
        .returning('*')
        .then(user => {
            if(user[0].id){
                res.json({
                    newName: user[0].name,
                    message: 'user name has been successfuly changed.'})
            } else {
                res.json('user not found')
            }
        })
        .catch(err => res.json('user not found'))
    }
}

module.exports = {
    editNameHandler: editNameHandler
}