// lib/ReduxProvider.tsx
"use client"; // Mark as client component

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef(store);

    return <Provider store={storeRef.current}>{children}</Provider>;
}