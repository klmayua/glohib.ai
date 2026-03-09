export interface Video {
  id: string;
  applicant_id: string;
  job_id: string;
  object_path: string;
  transcription: string | null;
  ai_grade: Record<string, any>;
  duration_sec: number | null;
  created_at: Date;
}
