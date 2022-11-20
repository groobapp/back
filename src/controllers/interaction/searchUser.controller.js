import User from '../../models/User.js'

export const searchUser = async (req, res, next) => {
    try {

        // Recibir mi id por params o enviar token en cada consulta
        const { input } = req.query
        console.log(input)
        if (input === undefined || input === null || input === "") return
        else {
            let users = await User.find()
            const result = users.filter(user => {
                if (user.userName.toLowerCase().includes(input)
                    || user.description.toLowerCase().includes(input)
                    || user.firstName.toLowerCase().includes(input)
                    || user.lastName.toLowerCase().includes(input)
                    || user.email.toLowerCase().includes(input)
                ) {
                    return user
                }
            }).sort((a, b) => {
                if (a.verified < b.verified) return 1;
                if (a.verified > b.verified) return -1;
            })
            
            // una vez realizada la búsqueda
            // el resultado de usuarios compararlo con mi lista de seguidos
            // ordenar y poner arriba primero a los que coincidan con esa lista
            res.status(200).json(result)
            return res.status(200).json(result)
        }
    } catch (error) {
        console.log(error)
        next()
    }

}

