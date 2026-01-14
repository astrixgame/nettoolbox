export const cidrToMaskBits = i => (0xFFFFFFFF << (32 - i)) >>> 0;
export const ipToBits = i => i.split('.').reduce((acc, o) => (acc << 8) | Number(o), 0) >>> 0;
export const bitsToIp = b => [(b >>> 24) & 0xFF, (b >>> 16) & 0xFF, (b >>> 8) & 0xFF, b & 0xFF].join('.');

export const getNetAddrV4 = (ip, cidr, txt) => {
  const ipBits = ipToBits(ip);
  const maskBits = cidrToMaskBits(cidr);
  const netInt = ipBits & maskBits;
  return !txt ? bitsToIp(netInt) : netInt;
};

export const getBroadAddrV4 = (ip, cidr, txt) => {
  const netInt = getNetAddrV4(ip, cidr, true);
  const maskBits = cidrToMaskBits(cidr);
  const bcInt = netInt | (~maskBits >>> 0);
  return !txt ? bitsToIp(bcInt) : bcInt;
};

export const getFirstUsableAddrV4 = (ip, cidr, txt) => {
  const netInt = getNetAddrV4(ip, cidr, true);
  return !txt ? (cidr < 32 ? bitsToIp(netInt + 1) : ip) : netInt + 1;
};

export const getLastUsableAddrV4 = (ip, cidr, txt) => {
  const bcInt = getBroadAddrV4(ip, cidr, true);
  return !txt ? (cidr < 32 ? bitsToIp(bcInt - 1) : ip) : bcInt - 1;
};

export const getNetworkMaskV4 = (cidr) => {
  const maskBits = cidrToMaskBits(cidr);
  return bitsToIp(maskBits);
};

export const getAddrClassV4 = (ip) => {
  const firstOctet = Number(ip.split('.')[0]);
  if(firstOctet >= 1 && firstOctet <= 126) return 'A';
  if(firstOctet >= 128 && firstOctet <= 191) return 'B';
  if(firstOctet >= 192 && firstOctet <= 223) return 'C';
  if(firstOctet >= 224 && firstOctet <= 239) return 'D';
  if(firstOctet >= 240 && firstOctet <= 254) return 'E';
  return '-';
};

export const getAddrTypeV4 = (ip) => {
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

export const getAddrCountV4 = (cidr) => {
  if(cidr < 0 || cidr > 32) return 0;
  return Math.pow(2, 32 - cidr);
};

export const isValidCidrV4 = (cidr) => {
  const c = Number(cidr);
  return Number.isInteger(c) && c >= 0 && c <= 32;
};

export const isValidAddrV4 = (ip) => {
  const octs = ip.split('.');
  if(octs.length !== 4) return false;
  return octs.every(o => /^\d+$/.test(o) && Number(o) >= 0 && Number(o) <= 255);
};

function parseIp(input) {
    let ip, cidr, mask, isNetwork, isBroadcast, networkAddr, broadcastAddr, firstUsable, lastUsable, version;
    const original = input;
    const parts = input.split('/');
    ip = parts[0];
    cidr = parts[1] ? Number(parts[1]) : null;

    function isIPv4(str) {
        const octs = str.split('.');
        if (octs.length !== 4) return false;
        return octs.every(o => /^\d+$/.test(o) && Number(o) >= 0 && Number(o) <= 255);
    }

    function isIPv6(str) {
        return /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(str);
    }

    function ipToInt(ipv4) {
        return ipv4.split('.').reduce((acc, o) => (acc << 8) | Number(o), 0) >>> 0;
    }

    function intToIp(int) {
        return [(int >>> 24)&0xFF, (int>>>16)&0xFF, (int>>>8)&0xFF, int&0xFF].join('.');
    }

    function maskFromCidr(c) {
        return [(0xFFFFFFFF << (32 - c) >>> 0)>>>24 &0xFF, (0xFFFFFFFF << (32 - c) >>> 0)>>>16 &0xFF, (0xFFFFFFFF << (32 - c) >>> 0)>>>8 &0xFF, (0xFFFFFFFF << (32 - c) >>> 0)&0xFF].join('.');
    }

    if (isIPv4(ip)) {
        version = 4;
        if (cidr == null || cidr < 0 || cidr > 32) cidr = null;
        if (cidr != null) {
            const ipInt = ipToInt(ip);
            const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
            mask = maskFromCidr(cidr);
            const netInt = ipInt & maskInt;
            const bcInt = netInt | (~maskInt >>> 0);
            networkAddr = intToIp(netInt);
            broadcastAddr = intToIp(bcInt);
            firstUsable = cidr < 32 ? intToIp(netInt + 1) : networkAddr;
            lastUsable = cidr < 32 ? intToIp(bcInt - 1) : broadcastAddr;
        }
        let ipInt = ipToInt(ip);
        isNetwork = cidr != null ? ipInt === ipToInt(networkAddr) : false;
        isBroadcast = cidr != null ? ipInt === ipToInt(broadcastAddr) : false;
    } else if (isIPv6(ip)) {
        version = 6;
        mask = null;
        networkAddr = cidr != null ? ip + '/' + cidr : null;
        broadcastAddr = null;
        firstUsable = null;
        lastUsable = null;
        isNetwork = false;
        isBroadcast = false;
    } else {
        version = null;
        ip = input;
        mask = null;
        networkAddr = null;
        broadcastAddr = null;
        firstUsable = null;
        lastUsable = null;
        cidr = null;
        isNetwork = false;
        isBroadcast = false;
    }

    return { ip, original, version, cidr, mask, networkAddr, broadcastAddr, firstUsable, lastUsable, isNetwork, isBroadcast };
}

// Examples
console.log(parseIp('192.168.1.34/24'));
console.log(parseIp('192.168.1.255/24'));
console.log(parseIp('2001:0db8::1/64'));
console.log(parseIp('invalid.ip'));


const ipAddresses = [
  // Platné IPv4 s CIDR
  "192.168.1.0/24",
  "10.0.0.0/8",
  
  // IPv4 síťové adresy
  "172.16.0.0/16",
  "203.0.113.0/24",
  
  // IPv4 broadcast adresy
  "192.168.1.255/24",
  "10.255.255.255/8",
  
  // Platné IPv6 s CIDR
  "2001:db8::/64",
  "2001:db8:85a3::/48",
  
  // IPv6 síťové adresy
  "2001:db8:abcd::/64",
  "fe80::/10",
  
  // Špatné IPv4 (neplatné oktety)
  "256.1.2.3/24",
  "192.168.1.-1/24",
  "abc.def.1.1/24",
  
  // Špatné IPv4 CIDR
  "192.168.1.1/33",
  "10.0.0.1/-1",
  "172.16.0.1/9.5",
  
  // Špatné IPv6
  "2001:db8:::1/64",
  "gggg::1/64",
  "2001:db8:9999:9999::1/64",
  
  // Špatné IPv6 CIDR
  "2001:db8::/129",
  "fe80::/-1",
  "2001:db8::/abc",
  
  // Smíšené neplatnosti
  "192.168.1.1/24:80",
  "::1/24"
];

