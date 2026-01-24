const storage = {};

const createMMKV = () => ({
  set: (key, value) => {
    storage[key] = value;
  },
  getString: key => storage[key],
  getNumber: key => storage[key],
  getBoolean: key => storage[key],
  remove: key => {
    delete storage[key];
  },
  getAllKeys: () => Object.keys(storage),
  contains: key => key in storage,
  clearAll: () => {
    Object.keys(storage).forEach(key => delete storage[key]);
  },
});

module.exports = {
  createMMKV,
};
