import Joi from "joi";

const createBookValidation = Joi.object({
   code: Joi.string().max(10).required(),
   title: Joi.string().max(100).required(),
   author: Joi.string().max(100).required(),
   status: Joi.string().valid('BORROWED', 'AVAILABLE'),
});

const updateBookValidation = Joi.object({
   code: Joi.string().max(10),
   title: Joi.string().max(100),
   author: Joi.string().max(100),
   status: Joi.string().valid('BORROWED', 'AVAILABLE'),
});

export {
   createBookValidation,
   updateBookValidation,
}