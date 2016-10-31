import _ from "underscore";

// this takes an object and replaces the existing object that matches on the key
export function replaceOrInsert(array, object, {key = 'id', replaceOnly = false} = {}) {
  if (!_.isArray(array) || array.length == 0) {
    return [object];
  }

  const old = _.find(array, (item) => item[key] == object[key]);
  if (!old) {
    if (replaceOnly) {
      return array;
    }
    return array.concat([object]);
  }

  const indexOfOld = _.indexOf(array, old),
    newArray = _.clone(array);

  newArray.splice(indexOfOld, 1, object);
  return newArray;
}

export function replace(array, object, options) {
  return replaceOrInsert(array, object, {...options, replaceOnly: true});
}