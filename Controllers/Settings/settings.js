const settingHandler = (knex) => (req, res) => {
    const { email } = req.body
    const { isNightMode, islocationAuto, locationMethod } = req.body
    const { city, lat, lon } = req.body 

    const latRegex = /^[-]?[0-9]{1,2}([.][0-9]{1,6})?$/
    const lonRegex = /^[-]?[0-9]{1,3}([.][0-9]{1,6})?$/
    const cityRegex = /^[a-zA-Z\s]{0,}$/
    


    knex.transaction(trx => {
        trx('settings').where('email', email)
        .update({
            'is_night_mode': isNightMode,
            'auto_location': islocationAuto
        })
        .returning('*')
        .then(returnedData => {
            if (returnedData[0].auto_location){
                res.json(returnedData[0])
            } else {
                if(JSON.parse(locationMethod)) {
                    if( latRegex.test(lat) && lonRegex.test(lon) && lat && lon ) {
                        return trx('settings').where('email', email)
                        .update({
                            'location_method': locationMethod,
                            'lat': lat,
                            'lon': lon
                        })
                        .returning('*')
                        .then(data => res.json(data[0]))
                        .catch(trx.rollback)

                    } else {
                        throw new Error('invalid input.')
                    }

                } else  {
                    if(cityRegex.test(city) && city) {
                        return trx('settings').where('email', email)
                        .update({
                            'location_method': locationMethod,
                            'city': city
                        })
                        .returning('*')
                        .then(data => res.json(data[0]))
                        .catch(trx.rollback)

                    } else {
                        throw new Error('invalid input.')
                    }

                }
            }
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        if (err.message === 'invalid input.') {
            res.status(400).json({ name: 'error', message: err.message})

        } else {
            res.status(400).json({ name: 'error', message: 'something is wrong. :('})
        }
    })
}

module.exports = {
    settingHandler: settingHandler
}