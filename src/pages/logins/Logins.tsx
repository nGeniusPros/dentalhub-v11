import React from 'react';
import { Outlet } from 'react-router-dom'; 

const Logins: React.FC = () => {
  return (
    <div>
      <h1>Logins</h1>
      <Outlet /> 
    </div>
  );
};

export default Logins;