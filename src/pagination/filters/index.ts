// const queryFilters = (dataFilter: any) => {
//   const keys = Object.keys(dataFilter).slice(2);
//   const filters = [];

//   keys.forEach((key) => {
//     if (dataFilter[key]) {
//       const filter = {};
//       filter[key] = { $regex: dataFilter[key], $options: 'i' };
//       console.log({ filter });
//       // filters.push(filter);
//       filters.push({ $and: filter });
//     }
//   });

//   const finalFilters = [];
//   if (filters.length > 0) {
//     finalFilters.push({ $or: filters });
//   }
//   finalFilters.push({ deleted_at: null }); // Thêm bộ lọc deleted_at == null

//   if (finalFilters.length > 0) {
//     return { $and: finalFilters };
//   } else {
//     return { deleted_at: null };
//   }
// };

// export default queryFilters;

const queryFilters = (dataFilter: any) => {
  const keys = Object.keys(dataFilter).slice(2);

  const filters = [];
  keys.forEach((key) => {
    if (dataFilter[key]) {
      const filter = {};
      filter[key] = { $regex: dataFilter[key], $options: 'i' };
      filters.push(filter);
    }
  });
  filters.push({ deleted_at: null }); // Thêm bộ lọc deleted_at == null

  if (filters.length > 0) {
    return { $and: filters };
  } else {
    return { deleted_at: null };
  }
};

export default queryFilters;
