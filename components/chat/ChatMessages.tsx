'use client';

import { Loader2, ServerCrash } from 'lucide-react';
import { Member, Message, Profile } from '@prisma/client';
import { format } from 'date-fns';
import { useChatQuery } from '@/hooks/use-chat-query';

import ChatWelcome from '@/components/chat/ChatWelcome';
import ChatItem from '@/components/chat/ChatItem';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { ElementRef, useRef } from 'react';
import { useChatScroll } from '@/hooks/use-chat-scroll';

const DATE_FORMAT = 'a MMM yyyy, HH:mm';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages = ({
  name,
  type,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  useChatSocket({ addKey, updateKey, queryKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items.length ?? 0,
  });

  if (status === 'loading') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Something went wrong!</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
      {!hasNextPage ? (
        <>
          <div className='flex-1' />
          <ChatWelcome name={name} type={type} />
        </>
      ) : (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='w-6 h-6 text-zinc-500 animate-spin my-4' />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, i) => (
          <div key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                currentMember={member}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
              />
            ))}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
