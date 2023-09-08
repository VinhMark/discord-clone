import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/ui/MediaRoom';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const orderMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={orderMember.profile.name}
        serverId={params.serverId}
        type='conversations'
        imageUrl={orderMember.profile.imageUrl}
      />

      {searchParams?.video && <MediaRoom chatId={conversation.id} video={true} audio={false} />}

      {!searchParams?.video && (
        <>
          <ChatMessages
            member={memberOne}
            name={orderMember.profile.name}
            chatId={conversation.id}
            type='conversation'
            apiUrl='/api/direct-messages'
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey='conversationId'
            paramValue={conversation.id}
          />

          <ChatInput
            apiUrl='/api/socket/direct-messages'
            name={orderMember.profile.name}
            type='conversation'
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
