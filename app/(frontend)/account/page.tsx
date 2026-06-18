import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Sign in to view your Furniture Studio orders and account details.',
}

export default function AccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-display-lg mb-4">Account</h1>
      <p className="text-muted">Sign in to view your orders and account details.</p>
    </div>
  )
}
