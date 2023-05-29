import React from 'react';

export interface IAppProps {
    children: React.ReactNode
}

export default function Layout ({children}: IAppProps) {
  return (
    <main>
        {children}
    </main>
  );
}
