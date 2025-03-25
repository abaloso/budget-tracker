// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/app/firebaseConfig'

export async function POST(request: Request) {
    try {
        const { email, password, fullName } = await request.json()

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await updateProfile(user, { displayName: fullName })
        await setDoc(doc(db, "users", user.uid), {
            fullName,
            email,
        })

        return NextResponse.json({
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
}