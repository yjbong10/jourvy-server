const deleteHandler = (knex) => (req, res) => {
    const { id } = req.params
    const { email } = req.body
    knex.transaction(trx => {
        trx('profile')
            .where('email', email)
            .increment('total_deletes', 1)
            .returning('email')
            .then(ReturnedEmail => {
                trx('posts').where({'id': id, 'email': ReturnedEmail[0]}).del()
                .then(deleted => {
                    if (deleted) {
                        res.json({
                            id: id,
                            message: `Post id: ${id} has been deleted.`
                        })
                    } else {
                        // res.status(400).json('unable to delete post.')
                        throw new Error()
                    }
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
    })
    .catch(err => {
            res.status(400).json('unable to delete post.')
        })
}

module.exports = {
    deleteHandler: deleteHandler
}