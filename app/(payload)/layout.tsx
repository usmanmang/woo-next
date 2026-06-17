import type { ServerFunctionClient } from 'payload'
import { RootLayout } from '@payloadcms/next/layouts'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from '@/app/(payload)/admin/importMap'
import configPromise from '@/payload.config'
import '@payloadcms/next/css'
import './admin.css'

export const metadata = {
  title: 'Furniture Admin',
  description: 'Admin panel for the furniture store',
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

export default function PayloadAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
