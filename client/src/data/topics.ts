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
      },
      {
        id: "3",
        content: "Clinical interviews should follow a structured approach while maintaining therapeutic rapport.",
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
      },
      {
        id: "3",
        content: "Common side effects include GI disturbances and initial anxiety.",
      }
    ]
  },
  {
    id: "mood-disorders",
    title: "Mood Disorders",
    description: "Understanding and treating major depressive disorder and bipolar disorders",
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2",
    slides: [
      {
        id: "1",
        content: "Major Depressive Disorder requires at least 5 symptoms present for 2 weeks.",
      },
      {
        id: "2",
        content: "Key symptoms include depressed mood, anhedonia, and changes in sleep/appetite.",
      }
    ]
  },
  {
    id: "anxiety-disorders",
    title: "Anxiety Disorders",
    description: "Diagnosis and treatment of various anxiety disorders",
    imageUrl: "https://images.unsplash.com/photo-1474418397713-2f2090187d06",
    slides: [
      {
        id: "1",
        content: "Generalized Anxiety Disorder involves excessive worry about multiple areas of life.",
      },
      {
        id: "2",
        content: "Treatment typically includes both medication and psychotherapy.",
      },
      {
        id: "3",
        content: "Cognitive Behavioral Therapy is highly effective for anxiety disorders.",
      }
    ]
  }
];

export const mockAIResponses: Record<string, string[]> = {
  "psychiatric-assessment": [
    "Mental status exam helps evaluate current psychological functioning",
    "Risk assessment focuses on harm to self or others",
    "History taking should cover both psychiatric and medical history"
  ],
  "psychopharmacology": [
    "SSRIs block serotonin reuptake in the synaptic cleft",
    "Therapeutic effects typically begin after 2-4 weeks",
    "Regular monitoring is essential for medication management"
  ],
  "mood-disorders": [
    "Depression often has both psychological and biological components",
    "Screening tools like PHQ-9 help track symptom severity",
    "Treatment should be tailored to individual needs"
  ],
  "anxiety-disorders": [
    "Anxiety can manifest with both physical and psychological symptoms",
    "Lifestyle modifications can help manage symptoms",
    "Different types of anxiety may require different approaches"
  ]
};