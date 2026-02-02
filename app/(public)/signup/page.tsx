import { Suspense } from "react"
import SignupClient from "./signup-client"

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <SignupClient />
        </Suspense>
    )
}
