import React from 'react';
import AppLayout from '@/components/AppLayout';
import DailySalesEntryClient from './components/DailySalesEntryClient';

export default function DailySalesEntryPage() {
  return (
    <AppLayout>
      <DailySalesEntryClient />
    </AppLayout>
  );
}