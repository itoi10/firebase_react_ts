export const generateRandomChar = (length: number = 16): string => {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((n) => S[n % S.length])
    .join('')
  return randomChar
}
