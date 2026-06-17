import { RootPage } from '@payloadcms/next/views'
import { importMap } from '@/app/(payload)/admin/importMap'
import configPromise from '@/payload.config'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function AdminPage({ params, searchParams }: Args) {
  return (
    <RootPage
      config={configPromise}
      importMap={importMap}
      params={params}
      searchParams={searchParams}
    />
  )
}
