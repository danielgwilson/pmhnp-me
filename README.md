# PMHNP-BC Training Platform

A mobile-first, AI-enhanced training platform designed specifically for PMHNP-BC exam preparation. This platform transforms medical study content into an engaging, interactive learning experience using an Instagram-stories-style interface.

## 🎯 Current Status

### Implemented Features
- ✅ Mobile-first responsive design
- ✅ Instagram-style story navigation
- ✅ Topic-based content organization
- ✅ Robust image handling with fallbacks
- ✅ Local storage for progress tracking
- ✅ Interactive UI with like/comment functionality

### In Progress
- 🚧 AI chat integration
- 🚧 Content management system
- 🚧 Advanced search functionality

## 🛠 Tech Stack

- **Frontend Framework**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: Wouter
- **State Management**: React Query
- **Animations**: Framer Motion
- **UI Components**: Custom components + shadcn/ui

## 📁 Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── TopicCircles/  # Story circle navigation
│   │   ├── TopicFeed/     # Main content feed
│   │   ├── TopicStory/    # Story viewer
│   │   └── ui/            # Base UI components
│   ├── pages/             # Route pages
│   ├── data/              # Mock data and types
│   ├── lib/               # Utilities and helpers
│   └── hooks/             # Custom React hooks
server/                    # Express backend (minimal)
```

## 🔑 Key Features

### Story Navigation
- Horizontal scrollable topic circles
- Tap navigation between slides
- Progress indicators
- Smooth animations

### Content Display
- Responsive feed layout
- Image optimization with fallbacks
- Lazy loading for performance
- Double-tap to like

### Local Storage
- Viewed topics tracking
- Like/comment persistence
- Chat history per topic

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## 💻 Development

### Key Development Guidelines

- Mobile-first approach for all components
- Consistent image fallbacks across components
- Type safety with TypeScript
- Reusable component patterns
- Performance optimization with lazy loading

### Component Guidelines

- Use shadcn/ui components when possible
- Implement proper loading states
- Handle image failures gracefully
- Maintain consistent styling patterns

## 🔜 Upcoming Features

1. **AI Integration**
   - Context-aware chat responses
   - Study recommendations
   - Progress tracking

2. **Content Management**
   - Dynamic content loading
   - Admin interface
   - Content versioning

3. **User Experience**
   - Advanced search functionality
   - Personalized study paths
   - Progress analytics

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.
