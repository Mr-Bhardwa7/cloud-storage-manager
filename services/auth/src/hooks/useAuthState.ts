"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { setUser, logout } from '@/store/slices/authSlice';
import { Session } from 'next-auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOnboardingDetails } from '@/store/slices/onboardingSlice';
import { isEmpty } from 'lodash';

interface CustomSession extends Session {
    token: string;
    expiresAt: Date;
    device: string;
}

export function useAuthState() {
    const { data: session, status } = useSession() as { 
        data: CustomSession | null; 
        status: "loading" | "authenticated" | "unauthenticated" 
    };
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const {userType, userDetails, teamMembers} = useAppSelector((state) => state.onboarding);
    
    const fetchUserData = useCallback(async (email: string, token: string) => {
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            dispatch(logout());
            return;
        }

        const syncStoreWithDB = isEmpty(authState.user) || isEmpty(userDetails) || (userType === 'company' && teamMembers.length === 0);
        console.log("syncStoreWithDB", syncStoreWithDB)
        if (status === 'authenticated' && session?.user?.email && session?.token && syncStoreWithDB) {
            fetchUserData(session.user.email, session.token)
                .then(userData => {
                    if (userData) {
                        dispatch(setUser({
                            user: {
                                id: userData.id,
                                name: userData.name || null,
                                email: userData.email,
                                image: userData.avatarUrl,
                                isNew: !userData.onboarding?.completed,
                            },
                            token: session.token,
                            expiresAt: new Date(session.expires),
                        }));

                        if (userData.onboarding) {
                            const { teamMembers, ...company } = userData.onboarding.company || {};
                           dispatch(setOnboardingDetails({
                                userType: userData.onboarding.userType,
                                userDetails:  userData.onboarding.individual || company,
                                completed: userData.onboarding.completed,
                                teamMembers: teamMembers || [],
                            }));
                        }
                    
                    }
                });
        }

        console.log('Session:', session);
        console.log('Status:', status);
    }, [session, status, dispatch, fetchUserData]);

    return {
        isLoading: status === 'loading',
        user: status === 'authenticated' ? authState.user : null,
        isAuthenticated: status === 'authenticated' && !!authState.user,
        token: authState.token,
        expiresAt: authState.expiresAt,
    };
}