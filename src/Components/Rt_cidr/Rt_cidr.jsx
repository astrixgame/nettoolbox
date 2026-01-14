import { useState, useEffect } from 'react';
import InputGroup from '../InputGroup/InputGroup.jsx';
import * as IPv4 from '../../Scripts/IPv4.js';
import * as IPv6 from '../../Scripts/IPv6.js';

export default function Rt_cidr() {
  const [ipAddress, setIpAddress] = useState('');
  const [cidr, setCidr] = useState('');
  const [ipError, setIpError] = useState('');
  const [cidrError, setCidrError] = useState('');
  const [firstUsable, setFirstUsable] = useState('');
  const [lastUsable, setLastUsable] = useState('');
  const [networkAddress, setNetworkAddress] = useState('');
  const [broadcastAddress, setBroadcastAddress] = useState('');
  const [networkMask, setNetworkMask] = useState('');
  const [addrClass, setAddrClass] = useState('');
  const [addrType, setAddrType] = useState('');
  const [addrCount, setAddrCount] = useState('');

  useEffect(() => {
    const IPvX = IPv4.isValidAddr(ipAddress) ? IPv4 : IPv6.isValidAddr(ipAddress) ? IPv6 : null;
    if(!IPvX) {
      setIpError(ipAddress === '' ? '' : 'Invalid IP address');
      setAddrClass('');
      setAddrType('');
      setFirstUsable('');
      setLastUsable('');
      setNetworkAddress('');
      setBroadcastAddress('');
      setNetworkMask('');
      setAddrCount('');
      return;
    }
    const isValidAddr = IPvX.isValidAddr;
    const isValidCidr = IPvX.isValidCidr;
    
    const validIp = isValidAddr(ipAddress);
    const validCidr = isValidCidr(cidr);

    setIpError(validIp || ipAddress === '' ? '' : 'Invalid IPv4 address');

    if(ipAddress !== '') {
      setAddrClass(IPvX.getAddrClass(ipAddress));
      setAddrType(IPvX.getAddrType(ipAddress));
    } else {
      setAddrClass('');
      setAddrType('');
    }

    setCidrError(validCidr || cidr === '' ? '' : 'Invalid CIDR (0-32)');

    if(validCidr && cidr !== '') {
      setNetworkMask(IPvX.getNetworkMask(cidr));
      setAddrCount(IPvX.getAddrCount(cidr));
    } else {
      setNetworkMask('');
      setAddrCount('');
    }

    if(validIp && validCidr && cidr !== '') {
      setNetworkAddress(IPvX.getNetAddr(ipAddress, cidr));
      setBroadcastAddress(IPvX.getBroadAddr(ipAddress, cidr));
      setFirstUsable(IPvX.getFirstUsableAddr(ipAddress, cidr));
      setLastUsable(IPvX.getLastUsableAddr(ipAddress, cidr));
    } else {
      setFirstUsable('');
      setLastUsable('');
      setNetworkAddress('');
      setBroadcastAddress('');
    }
  }, [ipAddress, cidr]);

  return (
    <div>
      <header>
        <h1>IP CIDR Calculator</h1>
        <p>Preview and analyze CIDR blocks</p>
      </header>
      <main>
        <div className="card">
          <div className="card-row">
            <InputGroup type="text" minwidth="360px" label="IP Address" value={ipAddress} onChange={e => setIpAddress(e.target.value)} allowInput={true} error={ipError} placeholder="10.0.0.1 / fd00::1" />
            <InputGroup type="number" minwidth="90px" label="CIDR" min={0} max={128} value={cidr} onChange={e => setCidr(e.target.value)} allowInput={true} error={cidrError} placeholder="24" />
            <InputGroup type="text" label="Network Mask" value={networkMask} allowInput={false} />
            <InputGroup type="text" label="Total Addresses" value={addrCount} allowInput={false} />
          </div>
          <div className="card-row">
            <InputGroup type="text" minwidth="360px" label="First usable address" value={firstUsable} allowInput={false} />
            <InputGroup type="text" minwidth="360px" label="Last usable address" value={lastUsable} allowInput={false} />
            <InputGroup type="text" label="Address Type" value={addrType} allowInput={false} />
          </div>
          <div className="card-row">
            <InputGroup type="text" minwidth="360px" label="Network Address" value={networkAddress} allowInput={false} />
            <InputGroup type="text" minwidth="360px" label="Broadcast Address" value={broadcastAddress} allowInput={false} />
            <InputGroup type="text" label="Address Class" value={addrClass} allowInput={false} />
          </div>
        </div>
      </main>
    </div>
  );
}