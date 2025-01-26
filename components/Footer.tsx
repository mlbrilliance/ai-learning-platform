export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm text-white p-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Developer Info */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold">
                NS
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm">Nick Sudh</p>
                <p className="text-xs text-gray-300">Developer</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            {/* Website Link */}
            <a
              href="https://mlbrilliance.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 transition-all duration-300"
            >
              <svg
                className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white">mlbrilliance.com</span>
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/mlbrilliance"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 transition-all duration-300"
            >
              <svg
                className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
