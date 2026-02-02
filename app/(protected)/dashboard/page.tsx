import { Suspense } from "react"
import Dashboard from "./guest/page"

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <Dashboard />
        </Suspense>
    )
}
