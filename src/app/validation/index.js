const validate = (schema, request) => {
   const {error, value} = schema.validate(request, {
      abortEarly: false,
      allowUnknown: false,
   });

   if (error) {
      throw error;
   } else {
      return value;
   }
};

export {
   validate
}