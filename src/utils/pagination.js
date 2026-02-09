const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const getPagination = (query = {}) => {
  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = { getPagination, DEFAULT_LIMIT, MAX_LIMIT };
