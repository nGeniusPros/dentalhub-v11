import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HeadBrainConsultant } from '@/ai/orchestrator/head-brain.agent';
import { USER_ROLES } from '@/constants/ai-agents';

interface AIAgentsProps {
  userRole?: string;
}

const AIAgents: React.FC<AIAgentsProps> = ({ userRole = USER_ROLES.DENTIST }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [sections, setSections] = useState<{
    title: string;
    content: string | Record<string, any>;
    type: string;
  }[]>([]);

  // Initialize the orchestrator with agent configurations
  const orchestrator = new HeadBrainConsultant({
    headOrchestrator: {
      name: 'Head Orchestrator',
      description: 'Main orchestrator for dental practice insights',
      providerConfig: {
        provider: 'openai',
        model: 'gpt-4',
      },
      systemPrompt: 'You are a dental practice AI consultant. Your role is to analyze practice data and provide actionable insights.'
    },
    dataAnalysis: {
      name: 'Data Analysis Agent',
      description: 'Specializes in analyzing practice metrics and KPIs',
      providerConfig: {
        provider: 'openai',
        model: 'gpt-4',
      },
      systemPrompt: 'You are a data analysis expert for dental practices. Focus on analyzing metrics and identifying trends.'
    },
    recommendation: {
      name: 'Recommendation Agent',
      description: 'Provides actionable recommendations for practice improvement',
      providerConfig: {
        provider: 'openai',
        model: 'gpt-4',
      },
      systemPrompt: 'You are a practice improvement consultant. Focus on providing actionable recommendations based on data analysis.'
    },
    labCase: {
      name: 'Lab Case Manager',
      description: 'Manages and tracks lab cases for the practice',
      providerConfig: {
        provider: 'openai',
        model: 'gpt-4',
      },
      systemPrompt: 'You are a lab case manager for dental practices. Focus on tracking and managing lab cases.'
    },
    deepSeek: {
      name: 'Deep Seek Agent',
      description: 'Provides context from practice knowledge base',
      providerConfig: {
        provider: 'openai',
        model: 'gpt-4',
      },
      systemPrompt: 'You are a knowledge base expert. Focus on providing relevant context from the practice knowledge base.'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');
    setSections([]);

    try {
      const result = await orchestrator.processQuery(query);
      setResponse(result.answer);
      setSections(result.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">AI Practice Consultant</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Ask your practice question
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ask about your practice metrics, patient care, or business development..."
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Processing...' : 'Get Insights'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {response && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold mb-2">
                  {section.title}
                </h3>
                <div className="prose max-w-none">
                  {typeof section.content === 'string' ? (
                    <p>{section.content}</p>
                  ) : (
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                      {JSON.stringify(section.content, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgents;