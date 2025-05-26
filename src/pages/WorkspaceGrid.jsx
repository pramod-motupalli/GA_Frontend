import React from 'react';
import WorkspaceCard from './WorkspaceCard';

const workspace = {
  name: 'NEXUS',
  url: 'nexus.com',
  description: 'Connecting you to the future with collaboration and intelligent designs.',
  avatars: [
    'https://i.pravatar.cc/40?img=1',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=3',
    'https://i.pravatar.cc/40?img=4',
    'https://i.pravatar.cc/40?img=5',
  ],
};

export default function WorkspaceGrid() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <WorkspaceCard workspace={workspace} />
    </div>
  );
}
