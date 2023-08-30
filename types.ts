import { Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersWithProps = Server & { members: (Member & { profile: Profile })[] };

export type ServerWithMembersWithProfiles = Server & { members: (Member & { profile: Profile })[] };
