import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export interface PortalProps {
  children: ReactNode;
}

function Modal({ children }: PortalProps) {
  const element = typeof window !== 'undefined' && document.querySelector(`#modal`);

  return element && children ? ReactDOM.createPortal(children, element) : null;
}

export default Modal;