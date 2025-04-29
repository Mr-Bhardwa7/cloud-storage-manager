import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId, members } = await request.json();

        const onboarding = await prisma.onboarding.findUnique({
            where: { userId },
            include: { company: true }
        });

        if (!onboarding?.company) {
            return NextResponse.json(
                { error: 'Company not found' },
                { status: 404 }
            );
        }

       await prisma.teamMember.createMany({
            data: members.map((member: {name: string, position: string, email: string }) => ({
                companyId: onboarding?.company?.id,
                name: member.name,
                role: member.position,
                email: member.email
            }))
        });

        const teamMembers = await prisma.teamMember.findMany({
            where: { companyId: onboarding.company.id }
        });

        return NextResponse.json({
            success: true,
            data: {
                members: teamMembers,
                count: teamMembers.length
            }
        });
    } catch (error) {
        console.error('Team members error:', error);
        return NextResponse.json(
            { error: 'Failed to save team members' },
            { status: 500 }
        );
    }
}