
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'super_admin' | 'admin' | 'mentor' | 'hiring_partner' | 'student' | 'institution';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Backdoor: Force admin role for the specific admin email
                if (firebaseUser.email?.toLowerCase() === 'admin@studlyf.com') {
                    setRole('super_admin');
                    setLoading(false);
                    return;
                }

                // Fetch role from Firestore
                try {
                    // Check local storage hint first for immediate redirection during signup race conditions
                    const cachedRole = localStorage.getItem(`userRole_${firebaseUser.uid}`) as UserRole;
                    if (cachedRole) {
                        console.log("[AuthContext] Using cached role hint:", cachedRole);
                        setRole(cachedRole);
                    }

                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("[AuthContext] Role found in Firestore:", userData.role);
                        const finalRole = userData.role || 'student';
                        setRole(finalRole);
                        localStorage.setItem(`userRole_${firebaseUser.uid}`, finalRole);
                    } else if (cachedRole) {
                        // Keep using cached role if doc doesn't exist yet (signup race)
                        console.log("[AuthContext] Doc not found yet, sticking with cached role");
                    } else {
                        console.warn("[AuthContext] No user doc found for UID:", firebaseUser.uid, "Defaulting to 'student'");
                        setRole('student');
                        localStorage.setItem(`userRole_${firebaseUser.uid}`, 'student');
                    }
                } catch (error: any) {
                    console.error("[AuthContext] Error fetching role:", error);
                    const cachedRole = localStorage.getItem(`userRole_${firebaseUser.uid}`) as UserRole;
                    if (cachedRole) {
                        setRole(cachedRole);
                    } else {
                        setRole('student');
                    }
                }
            } else {
                console.log("[AuthContext] No user logged in");
                setRole(null);
                // We don't necessarily want to clear ALL role hints, but for security we can clear the current one if we had its UID
                // However, we don't have UID here easily without tracking. 
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
