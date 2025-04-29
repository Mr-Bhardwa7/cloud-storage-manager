import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                onboarding: {
                    include: {
                        individual: true,
                        company: {
                            include: {
                                teamMembers: true
                            }
                        },
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const { email, name } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { name },
            include: {
                onboarding: {
                    include: {
                        individual: true,
                        company: true
                    }
                }
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user data' },
            { status: 500 }
        );
    }
}