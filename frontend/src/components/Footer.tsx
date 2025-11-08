export function Footer() {
  return (
    <footer className="mt-16 pb-8 text-center text-gray-600 dark:text-gray-400">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span>Built with</span>
        <span className="text-red-500 animate-pulse">❤️</span>
        <span>on</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">Base</span>
      </div>
      <div className="text-sm">
        <a 
          href="https://base.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Learn more about Base →
        </a>
      </div>
    </footer>
  )
}
