// lib/ReduxProvider.tsx
"use client"; // Mark as client component

import React from 'react';
import { Provider } from 'react-redux';

export default function ReduxProvider({ children, store }: { children: React.ReactNode, store: any }) {
    return <Provider store={store}>{children}</Provider>;
}