import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userEmail } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const onboarding = await prisma.onboarding.update({
            where: { userId: user.id },
            data: {
                completed: true,
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