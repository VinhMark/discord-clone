'use client';

import React, { useEffect, useState } from 'react';

import CreateServerModal from '@/components/modals/CreateServerModal';
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import MemberModal from '@/components/modals/MemberModal';
import CreateChannelModal from '@/components/modals/CreateChannelModal';
import LeaveServerModal from '@/components/modals/LeaveServerModal';
import DeleteServerModal from '@/components/modals/DeleteServerModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <CreateChannelModal />
      <EditServerModal />
      <InviteModal />
      <MemberModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </>
  );
};

export default ModalProvider;
