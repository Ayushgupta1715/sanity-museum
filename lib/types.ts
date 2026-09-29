export interface Topic {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface CodeSnippet {
  _key: string;
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  codeExamples: CodeSnippet[];
  tags: string[];
  topicName: string;
  topicIcon: string;
  topicColor: string;
}

export interface Citation {
  id: string;
  title: string;
  topic: string;
  topicIcon: string;
  difficulty: string;
  slug: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
  isLoading?: boolean;
}
