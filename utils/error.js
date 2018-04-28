module.exports = function translateError(msg) {
  const newErr = new Error(msg);
  newErr.originalError = msg;
  return e => {
    console.log(e)
    throw newErr;
  }
}
