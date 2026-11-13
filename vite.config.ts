import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { createMosswingServer } from './server/server.mjs'
import { createAccountAuthApp } from './server/account-auth.mjs'
import type { RequestListener } from 'node:http'

const multiplayerPort = Number(process.env.PORT) || 3001

function getErrorCode(error: unknown) {
  return error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
    ? error.code
    : undefined
}

function multiplayerServer(): Plugin {
  return {
    name: 'skinn-multiplayer-server',
    apply: 'serve',
    async configureServer(viteServer) {
      const multiplayer = createMosswingServer()
      let ownsMultiplayerServer = false
      let fallbackAuthClose: (() => void) | null = null
      let authApp: RequestListener = multiplayer.app
      try {
        await multiplayer.start()
        ownsMultiplayerServer = true
        console.log(`SKINN multiplayer server listening on port ${multiplayerPort}`)
      } catch (error) {
        await multiplayer.stop()
        if (getErrorCode(error) !== 'EADDRINUSE') throw error

        const response = await fetch(`http://127.0.0.1:${multiplayerPort}/health`, {
          signal: AbortSignal.timeout(2000),
        })
        if (!response.ok) {
          throw new Error('Port 3001 is occupied by a service that is not a healthy SKINN multiplayer server.', { cause: error })
        }
        const health: unknown = await response.json()
        if (!health || typeof health !== 'object' || !('game' in health) || health.game !== 'mosswing-online') {
          throw new Error(`Port ${multiplayerPort} is occupied by an incompatible service.`, { cause: error })
        }
        const fallbackAuth = createAccountAuthApp()
        authApp = fallbackAuth.app
        fallbackAuthClose = fallbackAuth.close
        console.log(`Using the existing SKINN multiplayer server on port ${multiplayerPort}`)
      }

      viteServer.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith('/api/auth/')) return next()
        authApp(request, response)
      })

      if (ownsMultiplayerServer) {
        viteServer.httpServer?.once('close', () => {
          void multiplayer.stop().catch((error: unknown) => {
            console.error('Unable to stop the SKINN multiplayer server:', error)
          })
        })
      } else {
        viteServer.httpServer?.once('close', () => fallbackAuthClose?.())
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), multiplayerServer()],
})
