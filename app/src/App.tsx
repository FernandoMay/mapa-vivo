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
      <div className="text-center">
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
    <div className="min-h-screen bg-paper-base text-text-primary font-body antialiased selection:bg-ine-magenta/10 selection:text-ine-magenta">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-[1280px] mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-ine-plum flex items-center justify-center text-white font-headline font-bold tracking-tight shrink-0">INE</div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-text-primary tracking-tight leading-none">México Participa</span>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Seis Historias · CCPC 2009-2024</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-medium cursor-pointer hover:bg-surface-container-high transition-colors">
              <span className="text-civic-navy">📍 Ámbito:</span>
              <span className="text-text-muted">{selectedState === 'Nacional' ? 'Nacional' : selectedState}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container p-1 rounded-full border border-slate-200">
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-blue-700 rounded-full px-3 py-1 focus:ring-0 outline-none cursor-pointer"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-[1280px] mx-auto px-6 pb-24 space-y-32">
        <section className="space-y-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider">
                Acto I de VI
              </span>
              <span className="text-text-muted text-xs font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span> Datos verificados CCPC
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-tight">
              El Ritmo Nacional: <span className="text-ine-plum">Evolución de la participación</span>
            </h1>
            <p className="text-lg text-text-muted max-w-3xl leading-relaxed">
              El compás cíclico entre elecciones concurrentes y legislativas intermedias a nivel federal y estatal.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 bg-surface-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <ParticipationChart 
                data={data} 
                title={"Participación: " + selectedState} 
                stateFilter={selectedState === 'Nacional' ? undefined : selectedState}
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <InsightCard 
                title="Promedio General" 
                value={avgParticipation + "%"} 
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

        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-text-primary">Los Contrastes Territoriales</h2>
            <p className="text-lg text-text-muted leading-relaxed">
              La democracia no es uniforme. Analizamos la brecha entre los estados con mayor y menor movilización.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InsightCard 
              title="Máxima Participación" 
              value={(maxState.pct_Participación * 100).toFixed(2) + "%"} 
              description={\Observado en \. El techo de movilización ciudadana.\}
            />
            <InsightCard 
              title="Mínima Participación" 
              value={(minState.pct_Participación * 100).toFixed(2) + "%"} 
              description={\Observado en \. El punto crítico de abstención.\}
            />
            <InsightCard 
              title="Brecha Electoral" 
              value={diff + " pts%"} 
              description="La diferencia abismal entre el estado más activo y el menos activo."
              highlight={true}
            />
          </div>
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="text-5xl font-black text-blue-500 mb-4 md:mb-0">!</div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Análisis Editorial</h3>
                <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                  Una brecha de <strong className="text-white">{diff} puntos porcentuales</strong> revela que la participación no depende solo del ciclo electoral, sino de factores estructurales regionales. Mientras algunos estados mantienen una cultura de voto sólida, otros enfrentan barreras que inhiben la movilización.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
        </section>

        <section className="space-y-12 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight text-text-primary">Acto III: El Espejo Social</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Análisis de participación por edad y sexo. (Próximamente con datos sociodemográficos detallados).
            </p>
          </div>
          <div className="bg-white p-12 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl">📊</div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Carga de Microdatos Sociodemográficos</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Estamos procesando la base de datos por cohortes de edad y género para identificar la brecha generacional.
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
