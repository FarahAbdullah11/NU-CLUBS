import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="copyright">NU_CLUBS</p>
        <p className='details'>Juhayna Square, 26th of July<br />
         Corridor, El Sheikh Zayed, Giza,<br />
          Egypt</p>
      </div>
    </footer>
  );
};

export default Footer;