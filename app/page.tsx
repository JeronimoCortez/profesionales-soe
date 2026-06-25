import { getData } from "@/lib/data";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const data = getData();

  return (
    <>
      <header className="bg-[#003087] text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Datos profesionales SOE
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <Dashboard data={data} />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-4 px-4 text-center text-sm text-gray-400">
        SOE Dashboard
      </footer>
    </>
  );
}
