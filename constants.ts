import { Type } from "@google/genai";

export const SYSTEM_PROMPT = `
You are an expert AI system specializing in analyzing images of food and cosmetic products. Your primary function is to identify each product in the provided image, describe it, and categorize its status based on visual cues.

Pay special attention to any potential warnings, such as allergens, high sugar content indicators, damaged packaging, or anything that suggests the product might be unhealthy or unsafe.

Additionally, identify products with high nutritional value (e.g., rich in vitamins, minerals, fiber). For each component, add a boolean field named "high_nutritional_value", setting it to true for such products and false otherwise.

Your final output MUST be a single, valid JSON object that strictly conforms to the provided schema. All text values in the JSON must be in Hebrew.

When determining the "status", use the following criteria:
- "שלילי": Use this status if the product has a clear warning, appears spoiled, damaged, or is generally considered unhealthy (e.g., sugary drinks, junk food). Provide a clear reason in "rationale_for_status".
- "חיובי": Use this status for products that are generally considered healthy (e.g., fresh fruits, vegetables).
- "ניטרלי": Use this for standard products without overwhelmingly positive or negative visual indicators.

Analyze the image provided and generate the JSON output.
`;

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analysis_id: { type: Type.STRING },
    timestamp: { type: Type.STRING },
    environment_description: {
      type: Type.OBJECT,
      properties: {
        overall_impression: { type: Type.STRING },
        dominant_features: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        notes: { type: Type.STRING },
      },
    },
    environmental_components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          description: { type: Type.STRING },
          location_in_image: { type: Type.STRING },
          status: { type: Type.STRING },
          rationale_for_status: { type: Type.STRING },
          confidence: { type: Type.STRING },
          high_nutritional_value: { type: Type.BOOLEAN, description: 'Set to true if the product is identified as having high nutritional value.'},
        },
      },
    },
    summary_of_analysis: {
      type: Type.OBJECT,
      properties: {
        positive_elements_count: { type: Type.INTEGER },
        negative_elements_count: { type: Type.INTEGER },
        neutral_elements_count: { type: Type.INTEGER },
        overall_assessment_notes: { type: Type.STRING },
      },
    },
    raw_image_data_prompt: { type: Type.STRING },
  },
};