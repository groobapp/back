import { z } from "zod";

export const CreatePublicationSchema = z.object({
    body: z.object({
        content: z.string().max(500).optional(),
        price: z.any(),
        explicitContent: z.any().optional()
    }),
    // params: z.object({
    //     id: z.string().min(17)
    // })
})

export const GetOrDeletePublicationByIdSchema = z.object({
    params: z.object({
        id: z.string().nonempty().min(17),
    }),
})

export type CreatePublicationType = z.infer<typeof CreatePublicationSchema>["body"]
export type GetOrDeletePublicationByIdType = z.infer<typeof GetOrDeletePublicationByIdSchema>["params"]