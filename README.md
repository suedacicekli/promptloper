# Promptloper

Open-source platform for sharing AI prompts. Browse and copy categorized prompts built with Next.js, TypeScript, Zustand, Tailwind CSS, and DaisyUI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: DaisyUI
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd promptloper
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
promptloper/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   └── constants/       # Constants and configs
├── public/              # Static assets
└── ...config files
```

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Zustand for state management with devtools and persistence
- ✅ Tailwind CSS for styling
- ✅ DaisyUI component library
- ✅ Responsive design
- ✅ ESLint configuration

## State Management

The app uses Zustand for state management. Example store structure:

```typescript
// src/store/usePromptStore.ts
import { create } from 'zustand'

interface PromptState {
  prompts: Prompt[]
  setPrompts: (prompts: Prompt[]) => void
  // ... other state and actions
}

export const usePromptStore = create<PromptState>()(
  devtools(
    persist(
      (set, get) => ({
        // state and actions
      }),
      { name: 'prompt-storage' }
    )
  )
)
```

## Styling

This project uses:
- **Tailwind CSS** for utility-first styling
- **DaisyUI** for pre-built components

Available DaisyUI themes: `light`, `dark`, `cupcake`

## Contributing

We welcome contributions from the community! There are two ways to contribute prompts to Promptloper:

### Option 1: Submit via Email (Easiest)

1. Click the floating action button (FAB) in the bottom-right corner of the site
2. Fill out the contribution form with your prompt details
3. Click "Submit via Email"
4. Your submission will be reviewed and added to the platform

### Option 2: Direct GitHub Contribution (For Developers)

#### Step 1: Prepare Your Prompt

Click the FAB button and fill out the form, then click "Show JSON" to generate properly formatted JSON.

#### Step 2: Prompt JSON Format

Each prompt follows this structure:

```json
{
  "id": "prompt-unique-id",
  "category": "Category Name",
  "title": "Your Prompt Title",
  "description": "Brief description of what this prompt does",
  "prompt": "The actual prompt text that users will copy",
  "imageSrc": "https://images.unsplash.com/...",
  "tags": ["tag1", "tag2", "tag3"],
  "contributor": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

**Required Fields:**
- `id`: Unique identifier (e.g., `prompt-1234567890`)
- `category`: Must match existing categories (Food, Instagram, Photography, Software, Homework, Math, Design, Business, Art, Marketing, Writing, Education, Other)
- `title`: Clear, descriptive title
- `description`: Brief explanation
- `prompt`: The actual prompt content
- `imageSrc`: URL to an image (Unsplash recommended)

**Optional Fields:**
- `tags`: Array of relevant keywords
- `contributor`: Your name and email

#### Step 3: Add Your Prompt

1. Fork this repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/promptloper.git
   cd promptloper
   ```

3. Create a new branch:
   ```bash
   git checkout -b add-prompt-your-topic
   ```

4. Add your prompt to `public/data/all-prompts.json`:
   - Open the file
   - Add your JSON object to the array (keep it formatted and valid)
   - Ensure proper commas between objects

5. Commit your changes:
   ```bash
   git add public/data/all-prompts.json
   git commit -m "Add prompt: Your Prompt Title"
   ```

6. Push to your fork:
   ```bash
   git push origin add-prompt-your-topic
   ```

7. Create a Pull Request:
   - Go to your fork on GitHub
   - Click "Pull Request"
   - Provide a clear description of your prompt
   - Submit for review

### Contribution Guidelines

- Ensure your prompt is original or properly attributed
- Use clear, descriptive titles
- Provide accurate category classification
- Test your JSON syntax (use a JSON validator)
- Use high-quality images (Unsplash is recommended)
- Keep descriptions concise but informative
- Add relevant tags for discoverability

### Categories

Available categories:
- Food
- Instagram
- Photography
- Software
- Homework
- Math
- Design
- Business
- Art
- Marketing
- Writing
- Education
- Other

### Image Guidelines

- Use Unsplash or other free stock photo services
- Image URL format: `https://images.unsplash.com/photo-xxxxx?w=500`
- Ensure images are relevant to your prompt
- Prefer landscape orientation for consistency

### Review Process

- Email submissions are reviewed manually and added within 1-3 business days
- GitHub PRs are reviewed by maintainers for quality and formatting
- You will be notified once your prompt is live

### Questions?

If you have questions about contributing, please:
- Open an issue on GitHub
- Email us at suedacicekli@gmail.com

## Formspree Setup (For Maintainers)

To enable email submissions:

1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form
3. Get your form endpoint ID
4. Update `FORMSPREE_ENDPOINT` in `src/components/ContributionForm/index.tsx`:
   ```typescript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
