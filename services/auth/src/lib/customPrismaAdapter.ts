import { getDeviceInfo } from "@/utils/device";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { type Adapter } from "next-auth/adapters"
import { headers } from "next/headers";
import { upsertSession } from "./session";
import { prisma } from "./prisma";
import { type User } from "next-auth";
import { setServerCookie } from "@/utils/cookie";

type PrismaClientType = typeof prisma;

interface AdapterUser extends User {
  access_token?: string;
  sessionId?: string;
  expires?: Date;
}

const CustomPrismaAdapter = (p: PrismaClientType): Adapter => {
  const baseAdapter = PrismaAdapter(p);

  return {
    ...baseAdapter,

    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const createdUser = await baseAdapter.createUser(user);
      
      const headersList = await headers();
      const deviceInfo = getDeviceInfo(headersList);
      
      const { sessionId, sessionToken, expiryDate } = await upsertSession(
        user.email!,
        createdUser.id,
        deviceInfo,
        false
      );

      setServerCookie("authly-sid", sessionId);
      return {
        ...createdUser,
        access_token: sessionToken,
        sessionId: sessionId,
        expires: expiryDate,
      };
    },
  };
};

export default CustomPrismaAdapter;
