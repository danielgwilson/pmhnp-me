export interface TopicSlide {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slides: TopicSlide[];
}

export const mockTopics: Topic[] = [
  {
    id: "psychiatric-assessment",
    title: "Psychiatric Assessment",
    description: "Core principles of psychiatric assessment and diagnosis",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    slides: [
      {
        id: "1",
        content: "Key components of a psychiatric assessment include mental status examination, history taking, and risk assessment.",
      },
      {
        id: "2",
        content: "The mental status examination evaluates appearance, behavior, mood, affect, thought process, thought content, cognition, insight, and judgment.",
      }
    ]
  },
  {
    id: "psychopharmacology",
    title: "Psychopharmacology",
    description: "Essential medications and their mechanisms",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    slides: [
      {
        id: "1",
        content: "Antidepressants work by affecting neurotransmitters like serotonin, norepinephrine, and dopamine.",
      },
      {
        id: "2",
        content: "SSRIs are first-line treatments for depression and anxiety disorders due to their favorable side effect profile.",
      }
    ]
  }
];

export const mockAIResponses: Record<string, string[]> = {
  "psychiatric-assessment": [
    "The mental status exam is a structured assessment of a patient's psychological functioning.",
    "Key aspects include appearance, behavior, mood/affect, speech, thought process/content, cognition, and insight/judgment."
  ],
  "psychopharmacology": [
    "SSRIs work by blocking the reuptake of serotonin in the synaptic cleft.",
    "Common side effects include GI disturbances, sexual dysfunction, and initial anxiety/agitation."
  ]
};
