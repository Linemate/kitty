import { PortalProps } from '@mui/material';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

function Popup({ children }: PortalProps) {
  const element = typeof window !== 'undefined' && document.querySelector(`#popup`);

  return element && children ? ReactDOM.createPortal(children, element) : null;
}

export default Popup;