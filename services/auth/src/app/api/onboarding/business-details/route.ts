import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserType } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const { userId, name, email, description, phone, role, website } = await request.json();

        const onboarding = await prisma.onboarding.findUnique({
            where: { userId },
            include: { company: true, individual: true }
        });
        
        if (!onboarding) {
            return NextResponse.json(
                { error: 'Onboarding not found' },
                { status: 404 }
            );
        }

        if (onboarding.userType === UserType.COMPANY) {
            await prisma.company.upsert({
                where: { onboardingId: onboarding.id },
                create: {
                    onboardingId: onboarding.id,
                    name,
                    email,
                    description,
                    mobile: phone,
                    website
                },
                update: {
                    name,
                    email,
                    description,
                    mobile: phone,
                    website
                },
            });
        } else {
            await prisma.individual.upsert({
                where: { onboardingId: onboarding.id },
                create: {
                    onboardingId: onboarding.id,
                    mobile: phone,
                    role
                },
                update: {
                    mobile: phone,
                    role
                },
            });
        }

        const updatedOnboarding = await prisma.onboarding.findUnique({
            where: { userId },
            include: {
                company: true,
                individual: true
            }
        });
        return NextResponse.json({ success: true, data : updatedOnboarding?.individual || updatedOnboarding?.company });
    } catch (error) {
        console.error('Business details error:', error);
        return NextResponse.json(
            { error: 'Failed to save business details' },
            { status: 500 }
        );
    }
}