import queryString from 'query-string';

export const generateQueryString = (url, paramObj) => {
  // add or update query parameter
  const queryObj = queryString.parse(url);
  for (let key in paramObj) {
    queryObj[key] = paramObj[key];
  }
  let newQuery = queryString.stringify(queryObj, {
    skipNull: true,
    skipEmptyString: true,
  });
  if (newQuery.length > 0) {
    newQuery = '?' + newQuery;
  }
  return newQuery;
};
