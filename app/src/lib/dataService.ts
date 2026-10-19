export const loadParticipationData = async () => {
  const response = await fetch('/data/participation_data_v2.json');
  return await response.json();
};
