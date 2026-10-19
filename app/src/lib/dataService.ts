export const loadParticipationData = async () => {
  try {
    const response = await fetch('/data/participation_data_v2.json');
    if (!response.ok) {
      throw new Error(\HTTP error! status: \\);
    }
    return await response.json();
  } catch (e) {
    console.error("Error loading data:", e);
    throw e;
  }
};
