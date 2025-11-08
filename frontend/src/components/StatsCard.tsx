interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  gradient?: string
}

export function StatsCard({ title, value, icon, gradient = 'from-blue-500 to-purple-500' }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} mb-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-1 dark:text-white">{value}</div>
      <div className="text-gray-600 dark:text-gray-400 text-sm">{title}</div>
    </div>
  )
}
