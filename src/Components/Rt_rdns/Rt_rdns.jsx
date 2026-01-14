import { useState, useEffect } from 'react';
import InputGroup from '../InputGroup/InputGroup.jsx';
import * as IPv4 from '../../Scripts/IPv4.js';
import * as IPv6 from '../../Scripts/IPv6.js';

export default function Rt_rdns() {
  const [ipv4Domain, setIpv4Domain] = useState('');
  const [ipv4Spacer, setIpv4Spacer] = useState('');
  const [ipv6Domain, setIpv6Domain] = useState('');
  const [ipv6Spacer, setIpv6Spacer] = useState('');
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState('');

  useEffect(() => {
    const list = addresses.split('\n').map(a => a.trim()).filter(a => a !== '');
    for(const addr of list) {
      let result = '';
      if(IPv4.isValidAddr(addr)) {
        result = IPv4.generateReverseDns(addr, ipv4Domain || IPv4.getArpaDomain(), ipv4Spacer || '.');
      } else if(IPv6.isValidAddr(addr)) {
        result = IPv6.generateReverseDns(addr, ipv6Domain || IPv6.getArpaDomain(), ipv6Spacer || '.');
      } else {
        result = `${addr} - Invalid IP address`;
      }
      list[list.indexOf(addr)] = result;
    }
    setResults(list.join('\n'));
  }, [ipv4Domain, ipv4Spacer, ipv6Domain, ipv6Spacer, addresses]);

  return (
    <div>
      <header>
        <h1>Reverse DNS generator</h1>
        <p>Generate and analyze reverse DNS lookups</p>
      </header>
      <main>
        <div className="card">
          <div className="card-row">
            <InputGroup type="text" label="IPv4 Domain" value={ipv4Domain} onChange={e => setIpv4Domain(e.target.value)} allowInput={true} placeholder={IPv4.getArpaDomain()} />
            <InputGroup type="text" label="IPv4 Spacer" value={ipv4Spacer} onChange={e => setIpv4Spacer(e.target.value)} allowInput={true} placeholder="." />
            <InputGroup type="text" label="IPv6 Domain" value={ipv6Domain} onChange={e => setIpv6Domain(e.target.value)} allowInput={true} placeholder={IPv6.getArpaDomain()} />
            <InputGroup type="text" label="IPv6 Spacer" value={ipv6Spacer} onChange={e => setIpv6Spacer (e.target.value)} allowInput={true} placeholder="." />
          </div>
          <div className="card-row">
            <InputGroup type="textarea" label="Addresses" value={addresses} onChange={e => setAddresses(e.target.value)} allowInput={true} placeholder="10.0.0.1" />
          </div>
          <div className="card-row">
            <code>
              {results}
            </code>
          </div>
        </div>
      </main>
    </div>
  );
}