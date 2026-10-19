import pandas as pd
import json

# Load the processed data
with open('data/processed/participation_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Ensure numeric types
numeric_cols = ['pct_Participación', 'pct_Abstención', 'S_votaron', 'No_votaron', 'Lista_nominal']
for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

# --- HALLAZGO 1: Evolución Nacional ---
# Group by election index 'i' and calculate the mean of participation
national_trend = df.groupby('i')['pct_Participación'].mean().sort_index()
print('\n--- NATIONAL TREND (Avg Participation) ---')
print(national_trend)

# --- HALLAZGO 2: Estados con mayores cambios ---
# Find the min and max participation for each state across all elections
state_volatility = df.groupby('Nombre')['pct_Participación'].agg(['min', 'max'])
state_volatility['diff'] = state_volatility['max'] - state_volatility['min']
top_volatility = state_volatility.sort_values(by='diff', ascending=False).head(5)

print('\n--- TOP 5 MOST VOLATILE STATES (Max Change) ---')
print(top_volatility)

# --- HALLAZGO 3: Estado con mayor caída reciente ---
# Compare latest election (max 'i') vs previous one
latest_i = df['i'].max()
prev_i = latest_i - 1 # This depends on if 'i' is sequential

if prev_i in df['i'].values:
    latest_data = df[df['i'] == latest_i][['Nombre', 'pct_Participación']]
    prev_data = df[df['i'] == prev_i][['Nombre', 'pct_Participación']]
    
    merged = latest_data.merge(prev_data, on='Nombre', suffixes=('_latest', '_prev'))
    merged['change'] = merged['pct_Participación_latest'] - merged['pct_Participación_prev']
    
    biggest_drop = merged.sort_values(by='change').head(5)
    print('\n--- BIGGEST DROPS (Latest vs Previous) ---')
    print(biggest_drop)

# Save findings to a markdown file for the narrative
with open('docs/hallazgos.md', 'w', encoding='utf-8') as f:
    f.write('# Hallazgos Verificables - Mapa Vivo\n\n')
    f.write('## 1. Tendencia Nacional\n')
    f.write(national_trend.to_string())
    f.write('\n\n## 2. Volatilidad por Estado\n')
    f.write(top_volatility.to_string())
    f.write('\n\n## 3. Caídas más fuertes (Recientes)\n')
    f.write(biggest_drop.to_string())
