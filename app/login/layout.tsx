'use client'
export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="login-layout">
          {/* Any login-specific styling or components */}
          {children}
        </div>
      );
  }