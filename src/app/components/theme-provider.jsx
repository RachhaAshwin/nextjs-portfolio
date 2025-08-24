"use client";

import * as React from "react";

const ThemeProvider = ({ children, ...props }) => {
  // Force dark mode for the entire application
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  return (
    <div className="dark" {...props}>
      {children}
    </div>
  );
};

export { ThemeProvider };
