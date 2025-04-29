import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId, userType } = await request.json();

        const onboarding = await prisma.onboarding.upsert({
            where: { userId },
            create: {
                userId,
                userType: userType.toUpperCase(),
                completed: false,
            },
            update: {
                userType: userType.toUpperCase(),
            },
        });

        return NextResponse.json({ success: true, data: onboarding });
    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json(
            { error: 'Failed to save user type' },
            { status: 500 }
        );
    }
}