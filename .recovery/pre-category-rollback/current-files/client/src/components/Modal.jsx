import {useEffect, useRef} from 'react';

export default function Modal({children, onClose, label, className = ''}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <dialog ref={ref} className={className} aria-label={label}
    onCancel={event => {event.preventDefault(); event.stopPropagation(); onClose();}}
    onClick={event => {
      if (event.target !== ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    <button type="button" className="close" aria-label={`Close ${label}`} onClick={onClose}>×</button>
    {children}
  </dialog>;
}
