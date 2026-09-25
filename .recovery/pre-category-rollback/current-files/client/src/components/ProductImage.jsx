import {useState} from 'react';
export const PLACEHOLDER = '/images/jersey-placeholder.svg';

export default function ProductImage({src, alt, ...props}) {
  const [failedSource, setFailedSource] = useState(null);
  const unavailable = !src || src === PLACEHOLDER || failedSource === src;
  return <img {...props} src={unavailable ? PLACEHOLDER : src}
    alt={unavailable ? `${alt} — product photograph unavailable` : alt}
    onError={() => setFailedSource(src)} />;
}
