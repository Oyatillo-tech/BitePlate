import Navbar from './Navbar';

export default function PageLayout({ title, subtitle, icon: Icon, children, action }) {
  return (
    <div className="page">
      <Navbar />
      <main className="page-inner">
        {(title || subtitle) && (
          <header className="page-header flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-primary">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
              )}
              <div>
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
            </div>
            {action}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
