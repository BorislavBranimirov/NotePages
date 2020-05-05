import queryString from 'query-string';

// update the query returned by location.search or an optional string with given key-value pairs
export const updateQuery = (paramObj, oldQuery = null) => {
    let queryToUpdate = oldQuery || location.search;
    // add or update query parameter
    const queryObj = queryString.parse(queryToUpdate);
    for (let key in paramObj) {
        queryObj[key] = paramObj[key];
    }
    let newQuery = queryString.stringify(queryObj, {
        skipNull: true,
        skipEmptyString: true,
    });
    // prepend a question mark is new query string has content
    // to follow the format of location.search
    if (newQuery.length > 0) {
        newQuery = '?' + newQuery;
    }
    return newQuery;
};

// get an object with key-value pairs taken from location.search or an optional string
export const getQueryObj = (oldQuery = null) => {
    let queryToUpdate = oldQuery || location.search;
    return queryString.parse(queryToUpdate);
};