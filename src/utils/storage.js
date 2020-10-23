const getStorage = (name, type) => {
  const data = localStorage.getItem(name);

  return ["object", "array"].includes(type) ? JSON.parse(data) : data;
};

const setStorage = (name, value, type) => {
  if (type === "object") {
    const data = JSON.parse(localStorage.getItem(name));

    localStorage.setItem(
      name,
      JSON.stringify({
        ...data,
        ...value,
      })
    );
  } else if (type === "array") {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
};

const removeStorage = (name) => {
  localStorage.removeItem(name);
};

export const getCacheCommon = () => getStorage("CACHE_common_data", "object");
export const setCacheCommon = (value) =>
  setStorage("CACHE_common_data", value, "object");
export const removeCacheCommon = () => removeStorage("CACHE_common_data");

export const getCachePools = () => getStorage("CACHE_pools", "array");
export const setCachePools = (value) =>
  setStorage("CACHE_pools", value, "array");
export const removeCachePools = () => removeStorage("CACHE_pools");
