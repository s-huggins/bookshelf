// export default obj => {
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) return false;
//   }
//   return true;
// };

export default val =>
  val === undefined ||
  val === null ||
  (typeof val === 'string' && val.trim().length === 0) ||
  (typeof val === 'object' && Object.keys(val).length === 0);
