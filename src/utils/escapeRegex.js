const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;

const escapeRegex = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(ESCAPE_REGEX, "\\$&");
};

module.exports = { escapeRegex };
