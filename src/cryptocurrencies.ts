export type Cryptocurrency = { name: String; symbol: string };

export const cryptocurrencies: Array<Cryptocurrency> = [
  {
    name: "Bitcoin",
    symbol: "btc",
  },
  {
    name: "Ether",
    symbol: "eth",
  },
  {
    name: "Litecoin",
    symbol: "ltc",
  },
  {
    name: "Monero",
    symbol: "xmr",
  },
  {
    name: "Ripple",
    symbol: "xrp",
  },
  {
    name: "Dogecoin",
    symbol: "doge",
  },
  {
    name: "Dash",
    symbol: "dash",
  },
  {
    name: "MaidSafeeCoin",
    symbol: "maid",
  },
  {
    name: "Lisk",
    symbol: "lsk",
  },
  /*{
    name: "Storjcoin X",
    symbol: "sjcx",
  },*/
];

export default cryptocurrencies;
