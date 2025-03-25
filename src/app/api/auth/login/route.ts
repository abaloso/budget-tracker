import { NextResponse } from 'next/server'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/firebaseConfig'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

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