import S from './Style.module.css';

export default function InputGroup({ type, label, value, minwidth, onChange, min, max, allowInput, error, placeholder }) {
  return (
    <div className={`${S.InputGroup} ${error ? S.Error : ''}`} style={{ minWidth: minwidth }}>
      <label>{label} {error && <span className={S.ErrorMessage}>{error}</span>}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={onChange} disabled={!allowInput} placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={onChange} disabled={!allowInput} min={min} max={max} placeholder={placeholder} />
      )}
    </div>
  );
}