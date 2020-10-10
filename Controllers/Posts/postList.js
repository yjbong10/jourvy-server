const postListHandler = (knex) => (req, res) => {
    const { email } = req.body;
    knex.select('*').from('posts').where('email', email).orderBy('id', 'desc')
        .then(posts => {
            if(posts.length > 0){
                const all = posts.map(post => {
                    let newPost = {...post};
                    newPost.day = post.posted.toLocaleDateString('default', { weekday: 'long' })    //eg: monday
                    newPost.date = post.posted.getDate()                                            //eg: 01
                    newPost.month = post.posted.toLocaleString('default', { month: 'long' })        //eg: September
                    newPost.year = post.posted.getFullYear()                                        //eg: 2020
                    newPost.postedFmt = post.posted.toLocaleString('default')
                    newPost.editedFmt = (post.edited) && post.edited.toLocaleString('default')
                    
                    const maxLength = 260
                    const minLength = 240
                    let n = 60
                    const teaser = post.content.split(' ').slice(0, n).join(' ')
                    newPost.teaser = (teaser.length > minLength && teaser.length < maxLength) 
                        ? teaser + '...'
                        : (teaser.length < minLength)
                            ? post.content
                            : (teaser.split(' ')[0].length > maxLength)
                                ? teaser.slice(0, maxLength) + '...'
                                : truncate(teaser)

                        function truncate(str) {
                            let s = str
                            while(s.length > maxLength){
                                s = s.split(' ').slice(0, n).join(' ');
                                n--;
                            }
                            return s + '...'
                            }
                    return newPost
                })
              
                res.json(all)
            } else {
                res.status(404).json('Not Found.')
            }
        })
        .catch(err => {
            res.status(400).json('something is wrong. :(')
        })
}

module.exports = {
    postListHandler: postListHandler
}