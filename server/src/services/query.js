/* 
  Reusable way of making any endpoint paginated
*/
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; // in mongo passing 0 as limit returns all docs in the collection

function getPagination(query) {

  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; // Math.abs() returns absolute value of a number(always +); if String returns Number
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
}