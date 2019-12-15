exports.filterWhite = (obj, whitelist) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (obj.hasOwnProperty(el) && whitelist[el]) newObj[el] = obj[el];
  });
  return newObj;
};

exports.filterBlack = (obj, blacklist) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(el => {
    if (newObj.hasOwnProperty(el) && blacklist[el]) delete newObj[el];
  });
  return newObj;
};
