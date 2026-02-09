const pick = (source, keys) => {
  if (!source || typeof source !== "object") return {};
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      acc[key] = source[key];
    }
    return acc;
  }, {});
};

module.exports = { pick };
