"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    // const { data: session } = useSession();
    // const router = useRouter();

    // if (!session) {
    //     router.push("/login");
    //     return null;
    // }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Welcome, </h2>
                <button
                    onClick={() => signOut()}
                    className="mt-4 p-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
