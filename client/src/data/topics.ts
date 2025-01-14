export interface TopicSlide {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface QuizAnswer {
  id: string;
  choice: string;
  content: {
    text: string;
    html: string;
  };
  isCorrect: boolean;
}

export interface QuizQuestion {
  prompt: {
    text: string;
    html: string;
  };
  answers: QuizAnswer[];
  explanation: {
    text: string;
    html: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type?: 'standard' | 'quiz';
  slides?: TopicSlide[];
  questions?: QuizQuestion[];
}

export const mockTopics: Topic[] = [
  {
    id: "psychiatric-assessment",
    title: "Psychiatric Assessment",
    description: "Core principles of psychiatric assessment and diagnosis",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    type: 'standard',
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
    type: 'standard',
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
    type: 'standard',
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
    type: 'standard',
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
  },
  {
    id: "substance-disorders",
    title: "Substance Use Disorders",
    description: "Assessment and treatment of substance use disorders",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    type: 'standard',
    slides: [
      {
        id: "1",
        content: "Substance use disorders involve a pattern of use that leads to clinically significant impairment.",
      },
      {
        id: "2",
        content: "Assessment includes evaluation of frequency, intensity, and impact on daily functioning.",
      },
      {
        id: "3",
        content: "Treatment often combines pharmacological and psychosocial interventions.",
      }
    ]
  },
  {
    id: "therapeutic-communication",
    title: "Therapeutic Communication",
    description: "Essential skills for effective patient interaction",
    imageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21",
    type: 'standard',
    slides: [
      {
        id: "1",
        content: "Therapeutic communication builds trust and facilitates assessment.",
      },
      {
        id: "2",
        content: "Active listening and empathy are core components.",
      },
      {
        id: "3",
        content: "Non-verbal cues play a crucial role in patient interaction.",
      }
    ]
  },
  {
    id: "pmhnp-practice-quiz-1",
    title: "PMHNP Practice Quiz 1",
    description: "Test your knowledge with practice questions for the PMHNP-BC exam",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    type: 'quiz',
    questions: [
      {
        prompt: {
          text: "The psychiatric-mental health nurse practitioner (PMHNP) presents data showing that a new approach to patient care has better outcomes. However, members of the staff are almost all in disagreement and spend considerable time arguing that the data are in error and providing rationales for maintaining the current approach. This is an example of:",
          html: "<p>The psychiatric-mental health nurse practitioner (PMHNP) presents data showing that a new approach to patient care has better outcomes. However, members of the staff are almost all in disagreement and spend considerable time arguing that the data are in error and providing rationales for maintaining the current approach. This is an example of:</p>"
        },
        answers: [
          {
            id: "1",
            choice: "a",
            content: {
              text: "Prejudice",
              html: "<p>Prejudice</p>"
            },
            isCorrect: false
          },
          {
            id: "2",
            choice: "b",
            content: {
              text: "Aggression",
              html: "<p>Aggression</p>"
            },
            isCorrect: false
          },
          {
            id: "3",
            choice: "c",
            content: {
              text: "Debate",
              html: "<p>Debate</p>"
            },
            isCorrect: false
          },
          {
            id: "4",
            choice: "d",
            content: {
              text: "Group think",
              html: "<p>Group think</p>"
            },
            isCorrect: true
          }
        ],
        explanation: {
          text: "This is an example of groupthink. Groupthink occurs when maintaining the status quo is more important to members of a group than making a reasoned or good decision.",
          html: "<p>This is an example of groupthink. Groupthink occurs when maintaining the status quo is more important to members of a group than making a reasoned or good decision.</p>"
        }
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