export const reduceFractionDigit = (number = "", digitAmount = 0) =>
  Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digitAmount,
  });

export const reduceLongNumber = (number = 0) => {
  let result = Number(number) || 0;
  let unit = "";

  if (result >= 1000000000) {
    result = result / 1000000000;
    unit = "B";
  } else if (result >= 1000000) {
    result = result / 1000000;
    unit = "M";
  } else if (result >= 1000) {
    result = result / 1000;
    unit = "K";
  }

  return `${reduceFractionDigit(result, 2)}${unit}`;
};
