// import User from '../../models/User'
// import Publication from "../../models/Publication";
// import { closeConnectionInMongoose } from "../../libs/constants";

// export const getAllPostsByFollowings = async (req, res) => {
//     try {

//         const myUser = await User.findById(req.userId, { password: 0, followers: 0, firstName: 0, lastName: 0, birthday: 0, createdAt: 0, updatedAt: 0, email: 0 })

//         // traigo mi usuario y busco los id de mis publicaciones
//         let myPosts = myUser.publications.map((id) => id)

//         // busco mis publicaciones en el modelo
//         const postsByMyUser = await Publication.find({
//             _id: {
//                 $in: myPosts
//             }
//         })

//         let allMyIds = myUser.followings.map((id) => id)
//         // busco las publicaciones de quienes sigo
//         const postsByFollowings = await Publication.find({
//             user: {
//                 $in: allMyIds
//             }
//         })

//         // No implementado
//         let usersByPosts = await User.find({
//             user: {
//                 $in: allMyIds
//             }
//         }, { password: 0, followers: 0, firstName: 0, lastName: 0, birthday: 0, createdAt: 0, updatedAt: 0, email: 0 })
//         // console.log(usersByPosts) // obtengo cada usuario que sigo
//         // Implementar en unir cada post con los datos del usuario correspondiente

//         if (myUser.explicitContent === true) {
//             const allPosts = postsByMyUser.concat(postsByFollowings) // concateno los usuarios y los posts
//             const data = allPosts.sort((a: any, b: any) => {
//                 if (a.createdAt < b.createdAt) return 1;
//                 return -1;
//             })
//             res.status(200).json({ data, myId: myUser?._id })
//         } else {
//             const postWithOutExplicitContent = postsByFollowings.filter(post => post.explicitContent === false)
//             const allPosts = postsByMyUser.concat(postWithOutExplicitContent) // concateno los usuarios y los posts
//             const data = allPosts.sort((a: any, b: any) => {
//                 if (a.createdAt < b.createdAt) return 1;
//                 return -1;
//             })
//             res.status(200).json({ data, myId: myUser?._id })

//         }
//         closeConnectionInMongoose
//     } catch (error) {
//         console.log("Error:", error)
//         res.status(500).json(error)
//         next()
//     }
// }

