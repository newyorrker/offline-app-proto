export const splitList = <T>(list: T[], n: number = 20) => {
  if (n <= 0) {
    throw new Error('Значение n должно быть положительным числом.');
  }

  const result = [];
  let i = 0;
  while (i < list.length) {
    result.push(list.slice(i, i + n));
    i += n;
  }
  return result;
}