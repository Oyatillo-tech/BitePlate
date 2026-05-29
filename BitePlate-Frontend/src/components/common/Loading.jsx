export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-gray-100 border-t-secondary rounded-full animate-spin animate-reverse"></div>
            </div>
            <span className="ml-4 text-xl font-semibold text-primary">Loading...</span>
        </div>
    );
}