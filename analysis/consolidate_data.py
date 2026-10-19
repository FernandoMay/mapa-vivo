import pandas as pd
import json
import os

# Load data
raw_path = 'data/raw/tabla_general.csv'
# Use utf-8-sig to handle BOM
try:
    df_measures = pd.read_csv(raw_path, encoding='utf-8-sig', sep=None, engine='python')
except:
    df_measures = pd.read_csv(raw_path, encoding='latin-1', sep=None, engine='python')

dln_path = 'data/raw/dln_data.csv'
try:
    df_dln = pd.read_csv(dln_path, encoding='utf-8-sig', sep=None, engine='python')
except:
    df_dln = pd.read_csv(dln_path, encoding='latin-1', sep=None, engine='python')

print('--- Initializing Consolidation ---')

# Clean all column names to remove invisible chars
df_measures.columns = [col.strip().replace('\ufeff', '') for col in df_measures.columns]
df_dln.columns = [col.strip().replace('\ufeff', '') for col in df_dln.columns]

# Ensure the critical column 'Ent.' exists. If it's the first column but name is slightly off, rename it.
if 'Ent.' not in df_measures.columns:
    df_measures.rename(columns={df_measures.columns[0]: 'Ent.'}, inplace=True)
if 'Ent.' not in df_dln.columns:
    df_dln.rename(columns={df_dln.columns[0]: 'Ent.'}, inplace=True)

# 1. Process Measures: Pivot
df_pivoted = df_measures.pivot_table(
    index=['Ent.', 'Nombre', 'i'], 
    columns='Nombres de medidas', 
    values='Valores de medidas', 
    aggfunc='first'
).reset_index()

df_pivoted.columns = [col.replace(' ', '_').replace('%', 'pct').replace('�', 'o').strip() for col in df_pivoted.columns]

# 2. Process DLN: Clean and select essential columns
# Find column that looks like 'Año'
year_col = [col for col in df_dln.columns if 'A' in col and 'o' in col][0]
nom_col = [col for col in df_dln.columns if 'Lista nominal' in col][0]

df_dln_clean = df_dln[['Ent.', 'Nombre', year_col, nom_col]].copy()
df_dln_clean.rename(columns={year_col: 'year', nom_col: 'lista_nominal'}, inplace=True)

# 3. Merge
merged = pd.merge(df_pivoted, df_dln_clean, on=['Ent.', 'Nombre'], how='inner')

# 4. National Trend Calculation
if 'pct_Participación' in merged.columns:
    national_trend = merged.groupby('year')['pct_Participación'].mean().sort_index()
    print('\n--- VALIDATED NATIONAL TREND ---')
    print(national_trend)

# 5. Export to JSON
result_json = merged.to_dict(orient='records')
output_path = 'data/processed/participation_data_v2.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(result_json, f, ensure_ascii=False, indent=2)

print(f'\n✅ Master Dataset saved to {output_path}')
print(f'Merged dataset shape: {merged.shape}')
