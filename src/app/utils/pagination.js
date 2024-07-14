const paginate = (items, pageNumber = 1, pageSize = 10) => {
   const totalPage = Math.ceil(items.length / pageSize);
   pageNumber = parseInt(pageNumber);
   pageSize = parseInt(pageSize);

   const metadata = {
      currentPage: pageNumber,
      limit: pageSize,
      totalItems: items.length,
      totalPage: totalPage
   }

   const startIndex = (pageNumber - 1) * pageSize;
   const endIndex = pageNumber * pageSize;

   let data = items.slice(startIndex, endIndex);

   if (endIndex < items.length) {
      metadata.next = {
         page: pageNumber + 1,
         limit: pageSize
      }
   } else {
      metadata.next = null;
   }

   if (startIndex > 0) {
      metadata.previous = {
         page: pageNumber - 1,
         limit: pageSize
      }
   } else {
      metadata.previous = null;
   }

   data.metadata = metadata;

   return data;
};

export {
   paginate
};