export function generateRandomString(length: number = 4) {
  const characters = 'abcdefghijklmnopqrstuvwxyz-';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters.charAt(randomIndex);

    // Проверяем, чтобы тире не шли на концах и не повторялись
    if (randomChar === '-') {
      if (result.length === 0 || result.charAt(result.length - 1) === '-') {
        i--; // Повторно генерируем символ
        continue;
      }
    }

    result += randomChar;
  }

  return result;
}
