// import User from '../../models/User'

// export const searchUser = async (req, res) => {
//     try {
//         const { input } = req.query
//         if (input === undefined || input === null || input === "") return
//         else {
//             let data = await User.find()
//         const result = data.filter(user => {
//             if(user.userName.toLowerCase().includes(input)
//             || user.description.toLowerCase().includes(input)
//             || user.firstName.toLowerCase().includes(input)
//             || user.lastName.toLowerCase().includes(input)
//             || user.email.toLowerCase().includes(input)
//             ) {
//                 return user
//             }
//         })
//         return res.status(200).json(result)
//     }
//     } catch (error) {
//         console.log("Error:", error)
//         res.status(500).json(error)
//         next()
//     }

// }