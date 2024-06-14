import React from 'react';
import { Toaster } from 'react-hot-toast'; // Import Toaster

// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import { RouterProvider } from 'react-router-dom';
import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <>
      <Toaster /> {/* Add Toaster here to display toast notifications */}
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </>
  );
}
