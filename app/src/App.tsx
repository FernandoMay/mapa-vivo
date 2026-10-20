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
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-xl text-slate-600 font-semibold tracking-tight">Sincronizando datos del INE...</p>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="font-black text-xl tracking-tighter text-slate-900">México Participa</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-full border border-slate-200">
            <span className="pl-3 text-[10px] font-bold uppercase text-slate-500">Estado:</span>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white border-none text-sm font-bold text-blue-700 rounded-full px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-700 uppercase bg-blue-100 rounded-full border border-blue-200">
            Hackathon INE 2026
          </span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Seis elecciones, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">muchas historias.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Un viaje interactivo a través de la participación ciudadana en México (2009-2024). 
            Entiende quién vota, quién se abstiene y por qué importa.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-32 pb-32">
        
        {/* ACT 1: MACRO TREND */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Acto I: El Ritmo Nacional</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                La participación no es una línea recta. Es el pulso de la democracia mexicana, marcada por ciclos de entusiasmo y apatía.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <InsightCard 
                title="Promedio General" 
                value={avgParticipation + "%"} 
                description=" la participación media consolidada en el periodo."
              />
              <InsightCard 
                title="Periodo Analizado" 
                value="2015-2024" 
                description="Ciclos electorales validados por la CCPC."
                highlight={true}
              />
            </div>
          </div>
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <ParticipationChart 
              data={data} 
              title={"Tendencia de " + selectedState} 
              stateFilter={selectedState === 'Nacional' ? undefined : selectedState}
            />
          </div>
        </section>

        {/* ACT 2: CONTRASTS */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Acto II: Los Contrastes</h2>
            <p className="text-slate-500 text-lg">
              La democracia no es uniforme. Mientras unos estados son motores de voto, otros luchan contra la abstención.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard 
              title="Máxima Participación" 
              value={(maxState.pct_Participación * 100).toFixed(2) + "%"} 
              description={\Observado en \. El techo de movilización.\}
            />
            <InsightCard 
              title="Mínima Participación" 
              value={(minState.pct_Participación * 100).toFixed(2) + "%"} 
              description={\Observado en \. El punto crítico.\}
            />
            <InsightCard 
              title="Brecha Electoral" 
              value={diff + " pts%"} 
              description="La diferencia abismal entre el estado más activo y el menos activo."
              highlight={true}
            />
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="text-5xl font-black text-blue-500 mb-4 md:mb-0">!</div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Perspectiva Editorial</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Una brecha de <strong className="text-white font-bold">{diff} puntos porcentuales</strong> revela que la participación no depende solo del ciclo electoral, sino de factores estructurales regionales. 
                  Esto sugiere que la cultura democrática está fragmentada territorialmente.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
        </section>

        {/* ACT 3: SOCIAL */}
        <section className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Acto III: El Espejo Social</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              ¿Participan igual todos los grupos? El análisis sociodemográfico es la clave para entender la apatía.
            </p>
          </div>
          <div className="bg-white p-12 rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl">📊</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Análisis Sociodemográfico en Desarrollo</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Estamos integrando los datos de edad y sexo para identificar la brecha generacional en el voto.
              </p>
            </div>
            <div className="px-6 py-2 bg-slate-100 text-slate-500 text-xs font-bold uppercase rounded-full tracking-widest">
              Próxima Actualización
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-32 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          Datos fuente: Instituto Nacional Electoral (INE) - Conteos Censales de Participación Ciudadana.
        </p>
      </footer>
    </div>
  );
}

export default App;
