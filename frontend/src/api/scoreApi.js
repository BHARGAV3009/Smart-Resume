import api from './axiosConfig'

export const analyzeResume = (resumeId) => api.post(`/scores/analyze/${resumeId}`)
export const getScore = (resumeId) => api.get(`/scores/${resumeId}`)
