import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-indigo-200/50 group-hover:scale-105 transition-all">
                  F
                </div>
                <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                  FGRDB
                </span>
              </Link>
              <nav className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link to="/" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Graph View
                </Link>
                <Link to="/problems" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Problems
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user.username}
                    </span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border border-indigo-200/50">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'curator' && (
                     <Link to="/curator" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
                  )}
                  <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors ml-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2">
                    Log in
                  </Link>
                  <Link to="/register" className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
