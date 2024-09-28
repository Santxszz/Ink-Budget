function nameValidation(name) {
  const regex = /[0-9]/;
  return regex.test(name);
}

module.exports = nameValidation;
