
export interface EnvironmentalComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  location_in_image: string;
  status: 'חיובי' | 'שלילי' | 'ניטרלי';
  rationale_for_status: string;
  confidence: 'high' | 'medium' | 'low';
  high_nutritional_value: boolean;
}

export interface AnalysisResponse {
  analysis_id: string;
  timestamp: string;
  environment_description: {
    overall_impression: string;
    dominant_features: string[];
    notes: string;
  };
  environmental_components: EnvironmentalComponent[];
  summary_of_analysis: {
    positive_elements_count: number;
    negative_elements_count: number;
    neutral_elements_count: number;
    overall_assessment_notes: string;
  };
  raw_image_data_prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}