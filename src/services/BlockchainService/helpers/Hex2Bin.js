import BigInt from 'big-integer'

export default function Hex2Bin (n) {
  return BigInt(n, 16).toString(2)
}
