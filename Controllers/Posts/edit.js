const editHandler = (knex) => (req, res) => {
    const { id } = req.params
    const { email, title, content } = req.body
    if (title.length === 0 && content.length === 0) {
        res.json('you can just delete this post!')
    } else if (title.length === 0) {
        res.json('you need to have a title for you post!')
    } else if (content.length === 0) {
        res.json('write something for the content at least!')
    } else {
        knex.transaction(trx => {
            trx('profile')
                .where('email', email)
                .increment('total_edits', 1)
                .returning('email')
                .then(ReturnedEmail => {
                    trx.select('title', 'content')
                        .from('posts')
                        .where({'id': id}, {'email': ReturnedEmail[0]})
                        .then(post => {
                            if (title !== post[0].title || content !== post[0].content){
                                return trx('posts')
                                    .where({'id': id}, {'email': ReturnedEmail[0]})
                                    .update({'title': title, 'content': content, 'edited': new Date()})
                                    .returning('*')
                                        .then(post => {
                                            res.json(post[0])
                                        })
                                        .catch(err => {
                                            throw new Error('something is wrong! :(')
                                        })
                            } else {
                                throw new Error("you haven't modified anything yet?!")
                            }
                            })
                        .then(trx.commit)
                        .catch(trx.rollback)
                })
        })
        .catch(err => {
            const { message } = err
            if (message !== "you haven't modified anything yet?!") {
                res.status(400).json('something is wrong! :(')
            } else {
                res.status(400).json(err.message)
            }
        })
    }
}

module.exports = {
    editHandler: editHandler
}