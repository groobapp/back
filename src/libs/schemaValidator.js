import Joi from 'joi'

export const schemaValidator = (schema, property) => { 
  return (req, res, next) => { 
  const { error } = schema.validate(req.body, schema); 
  console.log(error)
  const valid = error == null; 

  if (valid) { 
    next(); 
  } else { 
    const { details } = error; 
    console.log(details)
    const message = details.map(i => i.message).join(',');

    // console.log("error", message); 
  //  res.status(422).json({ error: message }) 
    } 
  } 
} 