import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

function DashboardContent() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: 'white' }}>🚀 Welcome to your FAR Clarity Dashboard</h1>
      <p style={{ color: 'lightgray' }}>Let's get you compliant!</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}