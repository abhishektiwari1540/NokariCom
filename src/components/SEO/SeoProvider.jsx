import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SeoProvider = ({ children }) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};

export default SeoProvider;