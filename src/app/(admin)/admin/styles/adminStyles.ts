export const adminStyles = {
  // Layout containers
  pageContainer: 'p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen',
  contentCard: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl',
  
  // Typography
  pageTitle: 'text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 pb-1',
  pageDescription: 'mt-2 text-sm text-slate-600 dark:text-slate-300',
  sectionTitle: 'text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2',
  
  // Form elements
  input: 'block w-full p-3 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-700/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm shadow-sm',
  select: 'block w-full p-3 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-700/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm shadow-sm appearance-none',
  
  // Option styles for select elements
  option: 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100',
  
  // Buttons
  primaryButton: 'inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 dark:from-blue-500 dark:to-teal-500 dark:hover:from-blue-600 dark:hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5',
  secondaryButton: 'inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg shadow-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300',
  dangerButton: 'inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 dark:from-red-500 dark:to-pink-500 dark:hover:from-red-600 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300',
  
  // Filter buttons
  filterButton: {
    base: 'px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5',
    inactive: 'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm',
    active: {
      all: 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md',
      pending: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md',
      approved: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md',
      featured: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
    }
  },
  
  // Tables
  table: 'min-w-full divide-y divide-slate-200 dark:divide-slate-700 border-collapse bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg',
  tableHeader: 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700',
  tableHeaderCell: 'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300',
  tableBody: 'bg-white/60 dark:bg-slate-800/60 divide-y divide-slate-200 dark:divide-slate-700',
  tableRow: 'transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50',
  tableCell: 'px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300',
  
  // Status indicators
  statusPill: {
    pending: 'px-3 py-1 text-xs font-bold text-amber-800 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/60 dark:to-yellow-900/60 dark:text-amber-300 rounded-full shadow-sm',
    approved: 'px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-sm',
    featured: 'px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-sm',
    active: 'px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-sm',
    free: 'px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full shadow-sm',
    premium: 'px-3 py-1 text-xs font-bold text-teal-800 dark:text-teal-100 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/60 dark:to-cyan-900/60 rounded-full shadow-sm',
    pro: 'px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-100 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/60 dark:to-purple-900/60 rounded-full shadow-sm'
  }
};
