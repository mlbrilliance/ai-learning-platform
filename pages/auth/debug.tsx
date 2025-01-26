import { useEffect, useState } from 'react'
import { logger } from '../../lib/logger'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Load logs when component mounts
    logger.loadLogs()
    setLogs(logger.getLogs())

    // Set up interval to refresh logs
    const interval = setInterval(() => {
      setLogs(logger.getLogs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const clearLogs = () => {
    logger.clearLogs()
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auth Debug Logs</h1>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Logs
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {logs.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  )
}
