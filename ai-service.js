/**
 * AI Service for Lifestyle Companion
 * Handles communication with Azure OpenAI / GitHub Models API
 */

const AI_CONFIG = {
    apiKey: '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',
    baseUrl: 'https://models.inference.ai.azure.com',
    model: 'gpt-4o-mini', // Efficient for lifestyle analysis
    freeLimit: 3
};

const AIService = {
    checkScanLimit: () => {
        const today = new Date().toDateString();
        const lastScanDate = localStorage.getItem('last_scan_date');
        let count = parseInt(localStorage.getItem('scan_count') || '0');

        if (lastScanDate !== today) {
            count = 0;
            localStorage.setItem('last_scan_date', today);
            localStorage.setItem('scan_count', '0');
        }

        return { count, remaining: Math.max(0, AI_CONFIG.freeLimit - count) };
    },

    incrementScanCount: () => {
        const count = parseInt(localStorage.getItem('scan_count') || '0') + 1;
        localStorage.setItem('scan_count', count.toString());
    },

    analyzeFood: async (imageDataBase64) => {
        const systemPrompt = `You are a non-medical Lifestyle Companion. 
        Analyze the food image provided. 
        1. Identify the food.
        2. Provide a short description.
        3. Provide "Lifestyle Awareness" notes: soft, encouraging, non-medical advice about how this fits into a balanced routine.
        4. Suggest 2 "Similar Choices" that are also lifestyle-friendly.
        
        CRITICAL: Use ONLY non-medical language. Do not mention calories, weight loss, doses, or clinical terms. 
        Format as JSON: { "name": "", "description": "", "lifestyle_note": "", "similar": ["", ""] }`;

        try {
            const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: "Analyze this food for lifestyle awareness." },
                                {
                                    type: 'image_url',
                                    image_url: { url: imageDataBase64 }
                                }
                            ]
                        }
                    ],
                    model: AI_CONFIG.model,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error('AI analysis offline');

            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error('AI Error:', error);
            throw error;
        }
    },

    generateMealIdeas: async (preference) => {
        const systemPrompt = `You are a non-medical Lifestyle Companion. 
        Generate 3 lifestyle-friendly meal ideas based on the preference: "${preference}".
        Each idea should include a title and a short "Lifestyle Awareness" description.
        Use soft, non-prescriptive language. Focus on "gentle patterns" and "mindful portions".
        
        CRITICAL: No clinical terms. No calorie counting.
        Format as JSON: { "meals": [{ "title": "", "desc": "" }] }`;

        try {
            const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    messages: [{ role: 'system', content: systemPrompt }],
                    model: AI_CONFIG.model,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error('AI offline');
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content).meals;
        } catch (error) {
            console.error('AI Error:', error);
            throw error;
        }
    }
};

export default AIService;
