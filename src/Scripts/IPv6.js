export const cidrToMaskBits = i => {
  const highBits = i <= 64 ? (0xFFFFFFFFFFFFFFFFn << BigInt(64 - i)) & 0xFFFFFFFFFFFFFFFFn : 0xFFFFFFFFFFFFFFFFn;
  const lowBits = i > 64 ? (0xFFFFFFFFFFFFFFFFn << BigInt(128 - i)) & 0xFFFFFFFFFFFFFFFFn : 0n;
  return (highBits << 64n) | lowBits;
};

export const normalizeIpv6 = ip => {
  let parts = ip.split('::');
  let hextets = [];
  if(parts.length === 2) {
    const left = parts[0] ? parts[0].split(':').filter(h => h !== '') : [];
    const right = parts[1] ? parts[1].split(':').filter(h => h !== '') : [];
    const missing = 8 - (left.length + right.length);
    hextets = [...left, ...Array(missing).fill('0000'), ...right];
  } else {
    hextets = ip.split(':').filter(h => h !== '');
    while (hextets.length < 8) hextets.push('0000');
  }
  return hextets.map(h => h.padStart(4, '0')).join(':');
};

export const ipToBits = i => {
  const hextets = normalizeIpv6(i).split(':');
  let bits = 0n;
  for(const h of hextets) {
    bits = (bits << 16n) | BigInt(parseInt(h, 16));
  }
  return bits;
};

export const bitsToIp = b => {
  const hextets = [];
  for(let i = 0; i < 8; i++) {
    hextets.unshift(((b >> BigInt(i * 16)) & 0xFFFFn).toString(16).padStart(4, '0'));
  }
  return hextets.join(':');
};

export const getNetAddr = (ip, cidr, txt) => {
  const ipBits = ipToBits(ip);
  const maskBits = cidrToMaskBits(cidr);
  const netInt = ipBits & maskBits;
  return !txt ? bitsToIp(netInt) : netInt;
};

export const getBroadAddr = (ip, cidr, txt) => {
  const netInt = getNetAddr(ip, cidr, true);
  const maskBits = cidrToMaskBits(cidr);
  const bcInt = netInt | (~maskBits & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn);
  return !txt ? bitsToIp(bcInt) : bcInt;
};

export const getFirstUsableAddr = (ip, cidr, txt) => {
  const netInt = getNetAddr(ip, cidr, true);
  return !txt ? bitsToIp(netInt + 1n) : netInt + 1n;
};

export const getLastUsableAddr = (ip, cidr, txt) => {
  const bcInt = getBroadAddr(ip, cidr, true);
  return !txt ? bitsToIp(bcInt - 1n) : bcInt - 1n;
};

export const getNetworkMask = (cidr) => {
  const maskBits = cidrToMaskBits(cidr);
  return bitsToIp(maskBits);
};

export const getAddrClass = (ip) => {
  const normalized = normalizeIpv6(ip);
  const firstHextet = parseInt(normalized.split(':')[0], 16);
  if((firstHextet & 0xFF00) === 0xFF00) return 'Multicast (/8)';
  if((firstHextet & 0xFFC0) === 0xFE80) return 'Link-Local (/10)';
  if((firstHextet & 0xFE00) === 0xFC00) return 'Unique-Local (/7)';
  if((firstHextet & 0xE000) === 0x2000) return 'Global (/3)';
  return 'Other';
};

export const getAddrType = (ip) => {
  const normalized = normalizeIpv6(ip);
  const firstHextet = parseInt(normalized.split(':')[0], 16);
  if(normalized === '0000:0000:0000:0000:0000:0000:0000:0001') return 'Loopback';
  if(normalized === '0000:0000:0000:0000:0000:0000:0000:0000') return 'Unspecified';
  if((firstHextet & 0xFF00) === 0xFF00) return 'Multicast';
  if((firstHextet & 0xFFC0) === 0xFE80) return 'Link-Local';
  if((firstHextet & 0xFE00) === 0xFC00) return 'Unique-Local';
  if((firstHextet === 0x2001) && parseInt(normalized.split(':')[1], 16) === 0x0DB8) return 'Documentation';
  if((firstHextet & 0xE000) === 0x2000) return 'Global-Unicast';
  return 'Reserved';
};

export const getAddrCount = (cidr) => {
  if(cidr < 0 || cidr > 128) return 0n;
  return 1n << BigInt(128 - cidr);
};

export const isValidCidr = (cidr) => {
  const c = Number(cidr);
  return Number.isInteger(c) && c >= 0 && c <= 128;
};

export const isValidAddr = (ip) => {
  try {
    const normalized = normalizeIpv6(ip);
    const hextets = normalized.split(':');
    if(hextets.length !== 8) return false;
    return hextets.every(h => /^[0-9a-fA-F]{4}$/.test(h) && 
                            parseInt(h, 16) >= 0 && parseInt(h, 16) <= 0xFFFF);
  } catch {
    return false;
  }
};

export const getArpaDomain = () => {
  return "$.ip6.arpa";
};

export const generateReverseDns = (ip, domain, spacer) => {
  const normalized = normalizeIpv6(ip);
  const nibbles = normalized.replace(/:/g, '').split('').reverse();
  return domain.replaceAll('$', nibbles.join(spacer));
};