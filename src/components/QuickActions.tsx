import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { File, UploadCloud, ShieldCheck, ClipboardCheck, BarChart3, FileSearch } from 'lucide-react';

const actions = [
  {
    title: 'Documents',
    icon: <File className="w-5 h-5" />,
    link: '/documents',
  },
  {
    title: 'Upload',
    icon: <UploadCloud className="w-5 h-5" />,
    link: '/documents/upload',
  },
  {
    title: 'Compliance',
    icon: <ShieldCheck className="w-5 h-5" />,
    link: '/compliance',
  },
  {
    title: 'Checklists',
    icon: <ClipboardCheck className="w-5 h-5" />,
    link: '/checklists',
  },
  {
    title: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    link: '/analytics',
  },
  {
    title: 'Reports',
    icon: <FileSearch className="w-5 h-5" />,
    link: '/reports',
  },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {actions.map((action) => (
        <Link to={action.link} key={action.title}>
          <Card className="flex items-center space-x-3 p-4 hover:bg-muted transition-colors">
            <div className="text-primary">{action.icon}</div>
            <div className="font-medium">{action.title}</div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;