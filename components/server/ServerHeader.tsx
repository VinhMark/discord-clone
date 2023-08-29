'use client';

import { ServerWithMembersWithProps } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerHeaderProps {
  server: ServerWithMembersWithProps;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <>
            <DropdownMenuItem
              className='text-indigo-600 dark:text-indigo-400 px-3 py-4 text-sm cursor-pointer'
              onClick={() => onOpen('invite', { server })}
            >
              Invite People
              <UserPlus className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-neutral-600 dark:text-neutral-400 px-3 py-4 text-sm cursor-pointer'
              onClick={() => onOpen('createChannel', { server })}
            >
              Create Channel
              <PlusCircle className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
          </>
        )}
        {isAdmin ? (
          <>
            <DropdownMenuItem
              className='text-neutral-600 dark:text-neutral-400 px-3 py-4 text-sm cursor-pointer'
              onClick={() => onOpen('editServer', { server })}
            >
              Server Settings
              <Settings className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-neutral-600 dark:text-neutral-400 px-3 py-4 text-sm cursor-pointer'
              onClick={() => onOpen('members', { server })}
            >
              Manager Members
              <Users className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-rose-500 px-3 py-4 text-sm cursor-pointer'
             onClick={() => onOpen('deleteServer', {server})}>
              Delete Server
              <Trash className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem className='text-rose-500 px-3 py-4 text-sm cursor-pointer'
           onClick={() => onOpen('leaveServer', {server})}>
            Leave Server
            <LogOut className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
