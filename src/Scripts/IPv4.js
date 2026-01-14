export const cidrToMaskBits = i => (0xFFFFFFFF << (32 - i)) >>> 0;
export const ipToBits = i => i.split('.').reduce((acc, o) => (acc << 8) | Number(o), 0) >>> 0;
export const bitsToIp = b => [(b >>> 24) & 0xFF, (b >>> 16) & 0xFF, (b >>> 8) & 0xFF, b & 0xFF].join('.');

export const getNetAddr = (ip, cidr, txt) => {
  const ipBits = ipToBits(ip);
  const maskBits = cidrToMaskBits(cidr);
  const netInt = ipBits & maskBits;
  return !txt ? bitsToIp(netInt) : netInt;
};

export const getBroadAddr = (ip, cidr, txt) => {
  const netInt = getNetAddr(ip, cidr, true);
  const maskBits = cidrToMaskBits(cidr);
  const bcInt = netInt | (~maskBits >>> 0);
  return !txt ? bitsToIp(bcInt) : bcInt;
};

export const getFirstUsableAddr = (ip, cidr, txt) => {
  const netInt = getNetAddr(ip, cidr, true);
  return !txt ? (cidr < 32 ? bitsToIp(netInt + 1) : ip) : netInt + 1;
};

export const getLastUsableAddr = (ip, cidr, txt) => {
  const bcInt = getBroadAddr(ip, cidr, true);
  return !txt ? (cidr < 32 ? bitsToIp(bcInt - 1) : ip) : bcInt - 1;
};

export const getNetworkMask = (cidr) => {
  const maskBits = cidrToMaskBits(cidr);
  return bitsToIp(maskBits);
};

export const getAddrClass = (ip) => {
  const firstOctet = Number(ip.split('.')[0]);
  if(firstOctet >= 1 && firstOctet <= 126) return 'A';
  if(firstOctet >= 128 && firstOctet <= 191) return 'B';
  if(firstOctet >= 192 && firstOctet <= 223) return 'C';
  if(firstOctet >= 224 && firstOctet <= 239) return 'D';
  if(firstOctet >= 240 && firstOctet <= 254) return 'E';
  return '-';
};

export const getAddrType = (ip) => {
  const firstOctet = Number(ip.split('.')[0]);
  if(firstOctet === 10 ||
     (firstOctet === 172 && Number(ip.split('.')[1]) >= 16 && Number(ip.split('.')[1]) <= 31) ||
     (firstOctet === 192 && Number(ip.split('.')[1]) === 168)) {
    return 'Private';
  }
  if(firstOctet === 127) return 'Loopback';
  if(firstOctet >= 224 && firstOctet <= 239) return 'Multicast';
  return 'Public';
};

export const getAddrCount = (cidr) => {
  if(cidr < 0 || cidr > 32) return 0;
  return Math.pow(2, 32 - cidr);
};

export const isValidCidr = (cidr) => {
  const c = Number(cidr);
  return Number.isInteger(c) && c >= 0 && c <= 32;
};

export const isValidAddr = (ip) => {
  const octs = ip.split('.');
  if(octs.length !== 4) return false;
  return octs.every(o => /^\d+$/.test(o) && Number(o) >= 0 && Number(o) <= 255);
};

export const getArpaDomain = () => {
  return "$.in-addr.arpa";
};

export const generateReverseDns = (ip, domain, spacer) => {
  const octs = ip.split('.').map(o => o.trim());
  if(octs.length !== 4) return 'Invalid IPv4 address';
  const reversed = octs.reverse().join(spacer);
  return domain.replaceAll('$', reversed);
};