const composeHandler = (knex) => (req, res) => {
    const { title, content, email } = req.body;
    if (title.length === 0 && content.length === 0){
        res.json('you have nothing to post!')
    } else if (title.length === 0) {
        res.json('you need to have a title for you post!')
    } else if (content.length === 0) {
        res.json('you have no content written yet!')
    } else {
        knex.transaction(trx => {
            trx('profile')
                .where('email', email)
                .increment('total_posts', 1)
                .returning('email')
                .then(ReturnedEmail => {
                    return trx('posts')
                        .insert({
                            email: ReturnedEmail[0], 
                            title: title, 
                            content: content,
                            posted: new Date()
                        }).returning('*')
                })
                .then(post => {
                    res.json(post[0])
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })  .catch(err => {
                res.json('unable to post.')
            })
    }
}

module.exports = {
    composeHandler: composeHandler
}