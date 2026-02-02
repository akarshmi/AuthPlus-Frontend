import AuthPlusSecurities from "@/components/AuthPlusSecurities"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthPlusSecurities>
            {children}
        </AuthPlusSecurities>
    )
}