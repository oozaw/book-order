import Joi from "joi";

const borrowBookValidation = Joi.object({
   book_code: Joi.string().required()
});

const returnBookValidation = Joi.object({
   transaction_id: Joi.number().required(),
});

export {
   borrowBookValidation,
   returnBookValidation,
}