import React from 'react';
import AppLayout from '@/components/AppLayout';
import CustomerTableClient from './components/CustomerTableClient';

export default function CustomerManagementPage() {
  return (
    <AppLayout>
      <CustomerTableClient />
    </AppLayout>
  );
}