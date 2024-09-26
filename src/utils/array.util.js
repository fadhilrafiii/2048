export const findLastIdx = (arr, cb) => {
  for (let idx = arr.length - 1; idx >= 0; idx--) {
    if (cb(arr[idx])) return idx;
  }

  return -1;
}