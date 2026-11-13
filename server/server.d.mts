import type { RequestListener } from 'node:http'

export interface MultiplayerServer {
  app: RequestListener
  start(): Promise<unknown>
  stop(): Promise<void>
}

export function createMosswingServer(options?: { port?: number; authDatabasePath?: string }): MultiplayerServer
