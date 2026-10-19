import pandas as pd
import json
import os

# Load data with utf-8-sig to handle the BOM automatically
raw_path = 'data/raw/tabla_general.csv'
try:
    df = pd.read_csv(raw_path, encoding='utf-8-sig', sep=None, engine='python')
except:
    df = pd.read_csv(raw_path, encoding='latin-1', sep=None, engine='python')

# Clean column names: Remove any non-printable characters from the start/end
df.columns = [col.strip().encode('ascii', 'ignore').decode('ascii') if not col.strip().startswith('Ent') else col.strip().replace('\ufeff', '') for col in df.columns]
# Specifically for the BOM if it survived
df.rename(columns={df.columns[0]: 'Ent.'}, inplace=True)

print('Fixed Columns:', df.columns.tolist())

# Pivot the data
try:
    df_pivoted = df.pivot_table(
        index=['Ent.', 'Nombre', 'i'], 
        columns='Nombres de medidas', 
        values='Valores de medidas', 
        aggfunc='first'
    ).reset_index()
    
    # Clean column names for JSON
    df_pivoted.columns = [col.replace(' ', '_').replace('%', 'pct').replace('�', 'o').strip() for col in df_pivoted.columns]
    
    # Export to JSON
    result_json = df_pivoted.to_dict(orient='records')
    output_path = 'data/processed/participation_data.json'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result_json, f, ensure_ascii=False, indent=2)
        
    print(f'SUCCESS: Processed data saved to {output_path}')
    print(f'Total records: {len(df_pivoted)}')

except Exception as e:
    print(f'ERROR during pivot: {str(e)}')
