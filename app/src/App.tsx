import React, { useEffect, useState } from 'react';
import { loadParticipationData } from './lib/dataService';
import { ParticipationChart } from './components/ParticipationChart';
import { InsightCard } from './components/InsightCard';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('Nacional');

  useEffect(() => {
    loadParticipationData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-sans bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 font-medium">Cargando datos oficiales del INE...</p>
      </div>
    </div>
  );

  const states = ['Nacional', ...new Set(data.map(item => item.Nombre))].sort();
  const avgParticipation = (data.reduce((acc, item) => acc + (item.pct_Participación || 0), 0) / data.length * 100).toFixed(2);
  const sortedData = [...data].sort((a, b) => (b.pct_Participación || 0) - (a.pct_Participación || 0));
  const maxState = sortedData[0];
  const minState = sortedData[sortedData.length - 1];
  const diff = ((maxState.pct_Participación - minState.pct_Participación) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <header className="max-w-5xl mx-auto mb-16 text-center">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full">
          Proyecto Hackathon INE 2026
        </span>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-blue-950 mb-6">
          México Participa: <span className="text-blue-600">Seis Historias.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Análisis interactivo de la participación ciudadana basado en los Conteos Censales (CCPC) 2009–2024.
        </p>
      </header>

      <main className="max-w-6xl mx-auto space-y-24">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
            <span className="pl-4 text-sm font-bold text-gray-500 uppercase">Explorar Estado:</span>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-gray-50 border-none text-blue-900 font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Acto I: El Ritmo Nacional</h2>
              <p className="text-gray-500 text-lg">Evolución de la participación ciudadana en el tiempo.</p>
            </div>
            <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              Datos verificados CCPC
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <ParticipationChart 
                data={data} 
                title={Participación: } 
                stateFilter={selectedState === 'Nacional' ? undefined : selectedState}
              />
            </div>
            <div className="space-y-4">
              <InsightCard 
                title="Promedio General" 
                value={${avgParticipation}%} 
                description=" la participación media consolidada a través de los ciclos analizados."
              />
              <InsightCard 
                title="Periodo Analizado" 
                value="2015-2024" 
                description="Rango temporal validado en la exportación actual de datos."
                highlight={true}
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Acto II: Los Contrastes Territoriales</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              La democracia no es uniforme. Analizamos la brecha entre los estados con mayor y menor movilización.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard 
              title="Máxima Participación" 
              value={${(maxState.pct_Participación * 100).toFixed(2)}%} 
              description={Observado en . El techo de movilización ciudadana.}
            />
            <InsightCard 
              title="Mínima Participación" 
              value={${(minState.pct_Participación * 100).toFixed(2)}%} 
              description={Observado en . El punto crítico de abstención.}
            />
            <InsightCard 
              title="Brecha Electoral" 
              value={${diff} pts%} 
              description="La diferencia abismal entre el estado más activo y el menos activo."
              highlight={true}
            />
          </div>
          <div className="bg-blue-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Análisis Editorial</h3>
              <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
                Una brecha de <strong className="text-white">{diff} puntos porcentuales</strong> revela que la participación no depende solo del ciclo electoral, sino de factores estructurales regionales. Mientras algunos estados mantienen una cultura de voto sólida, otros enfrentan barreras que inhiben la movilización.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          </div>
        </section>

        <section className="space-y-8 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Acto III: El Espejo Social</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Análisis de participación por edad y sexo. (Próximamente con datos sociodemográficos detallados).
            </p>
          </div>
          <div className="bg-gray-200 h-64 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-500 font-medium italic">
            Cargando análisis sociodemográfico...
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-24 py-12 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-sm">
          Datos fuente: Instituto Nacional Electoral (INE) - Conteos Censales de Participación Ciudadana.
        </p>
      </footer>
    </div>
  );
}

export default App;
