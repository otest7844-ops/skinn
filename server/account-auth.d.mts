import type { RequestListener } from 'node:http'

export function createAccountAuthApp(options?: { databasePath?: string }): {
  app: RequestListener
  close(): void
}
