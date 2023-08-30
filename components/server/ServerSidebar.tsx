import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';

import ServerHeader from './ServerHeader';
import ServerSearch from './ServerSearch';
import ServerSection from './ServerSection';
import ServerChannel from './ServerChannel';
import ServerMember from './ServerMember';

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface ServerSideBarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='w-4 h-4 mr-2' />,
  [ChannelType.AUDIO]: <Mic className='w-4 h-4 mr-2' />,
  [ChannelType.VIDEO]: <Video className='w-4 h-4 mr-2' />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='w-4 h-4 mr-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='w-4 h-4 mr-2  text-rose-500' />,
};

const ServerSidebar = async ({ serverId }: ServerSideBarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: { createdAt: 'asc' },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

  const members = server?.members.filter((member) => member.profileId !== profile.id);

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#e6eaf0]'>
      <ServerHeader server={server} role={role} />

      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {/* Text channel */}
        {!!textChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              label='Text Channels'
            />
            {/* list channel */}
            <div className='space-y-[2px]'>
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {/* Audio channel */}
        {!!audioChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              label='Audio Channels'
            />
            {/* list channel */}
            <div className='space-y-[2px]'>
              {audioChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}
        {/* Video channel */}
        {!!videoChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              label='Video Channels'
            />
            {/* list channel */}
            <div className='space-y-[2px]'>
              {videoChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
              ))}
            </div>
          </div>
        )}
        {/* Members channel */}
        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection sectionType='members' role={role} label='Members' server={server} />
            {/* list member */}
            <div className='space-y-[2px]'>
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
