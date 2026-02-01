import React from 'react';
import { Helmet } from 'react-helmet';

const GoogleAnalytics = () => {
  return (
    <Helmet>
      {/* Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_ID}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.REACT_APP_GA_ID}');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;