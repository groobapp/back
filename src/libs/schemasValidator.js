export const schemaValidator = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next()
    } catch (error) {
      res.send(error.message)
    }
  }
}
