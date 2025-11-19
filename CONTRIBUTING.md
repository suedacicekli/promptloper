# Contributing to Promptloper

Thank you for your interest in contributing to Promptloper! This document provides guidelines and instructions for contributing prompts to our platform.

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Email Submission](#email-submission)
- [GitHub Contribution](#github-contribution)
- [Prompt Guidelines](#prompt-guidelines)
- [JSON Format Specification](#json-format-specification)
- [Review Process](#review-process)

## Ways to Contribute

You can contribute prompts to Promptloper in two ways:

### 1. Email Submission (Recommended for Non-Developers)
Quick and easy submission through our web form. Perfect if you're not familiar with Git/GitHub.

### 2. GitHub Contribution (For Developers)
Direct contribution via pull request. Faster review process and you'll be listed as a contributor.

---

## Email Submission

### Steps:

1. **Visit the site** and click the floating action button (FAB) in the bottom-right corner
2. **Fill out the form** with your prompt details:
   - Prompt Title (required)
   - Category (required)
   - Description (required)
   - Prompt Content (required)
   - Tags (optional)
   - Image URL (optional)
   - Your Name (optional)
   - Your Email (optional)

3. **Click "Submit via Email"**
4. You'll receive a confirmation email
5. Your prompt will be reviewed and added within 1-3 business days

### Benefits:
- No technical knowledge required
- Simple form interface
- Email confirmation
- Quick submission process

---

## GitHub Contribution

### Prerequisites:
- GitHub account
- Git installed on your computer
- Basic knowledge of Git/GitHub workflow

### Step-by-Step Guide:

#### 1. Prepare Your Prompt

Visit the contribution page and use the form to generate properly formatted JSON:

1. Fill out all required fields
2. Click "Show JSON" button
3. Click "Copy JSON" to copy the generated code

#### 2. Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/promptloper.git
cd promptloper
```

#### 3. Create a Branch

```bash
git checkout -b add-prompt-your-topic-name
```

Use a descriptive branch name like:
- `add-prompt-recipe-photography`
- `add-prompt-social-media-marketing`

#### 4. Add Your Prompt

1. Open `public/data/all-prompts.json`
2. Add your JSON object to the array
3. Ensure proper formatting:
   - Maintain 2-space indentation
   - Add comma after previous object
   - No trailing comma after your object if it's the last one

Example:
```json
[
  {
    "id": "prompt-1",
    ...existing prompt...
  },
  {
    "id": "prompt-1234567890",
    "category": "Photography",
    "title": "Your Prompt Title",
    "description": "Brief description",
    "prompt": "Your full prompt text",
    "imageSrc": "https://images.unsplash.com/photo-xxxxx?w=500",
    "tags": ["photography", "food", "styling"],
    "contributor": {
      "name": "Your Name",
      "email": "your.email@example.com"
    }
  }
]
```

#### 5. Validate Your JSON

Before committing, validate your JSON:
- Use an online JSON validator (jsonlint.com)
- Or use `npm run lint` if available

#### 6. Commit and Push

```bash
git add public/data/all-prompts.json
git commit -m "Add prompt: Your Prompt Title"
git push origin add-prompt-your-topic-name
```

#### 7. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request" button
3. Select your branch
4. Write a clear PR description:
   ```
   Add prompt: [Your Prompt Title]

   Category: [Category Name]
   Description: [Brief description of what the prompt does]

   - [ ] JSON is valid
   - [ ] All required fields included
   - [ ] Image URL is accessible
   - [ ] Followed contribution guidelines
   ```
5. Submit the pull request

### Benefits:
- Faster review process
- You're listed as a contributor
- Direct impact on the repository
- Learn Git/GitHub workflow

---

## Prompt Guidelines

### Quality Standards

✅ **Do:**
- Provide clear, descriptive titles
- Write detailed, actionable prompts
- Use relevant categories
- Include helpful tags
- Test your prompt before submitting
- Use high-quality images
- Credit original sources if adapted

❌ **Don't:**
- Submit duplicate prompts
- Use copyrighted content without permission
- Include offensive or inappropriate content
- Submit low-quality or vague prompts
- Use broken image links

### Best Practices

1. **Title**: Keep it clear and concise (3-7 words)
2. **Description**: Explain what the prompt does (1-2 sentences)
3. **Prompt**: Make it detailed and specific
4. **Category**: Choose the most relevant category
5. **Tags**: Add 3-5 relevant keywords
6. **Image**: Use high-quality, relevant images

---

## JSON Format Specification

### Required Fields

```json
{
  "id": "prompt-1234567890",
  "category": "Category Name",
  "title": "Your Prompt Title",
  "description": "Brief description of what this prompt does",
  "prompt": "The actual prompt text that users will copy",
  "imageSrc": "https://images.unsplash.com/photo-xxxxx?w=500"
}
```

### Optional Fields

```json
{
  "tags": ["tag1", "tag2", "tag3"],
  "contributor": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

### Field Specifications

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique identifier | `prompt-1234567890` |
| `category` | string | ✅ | Must match existing categories | `Photography` |
| `title` | string | ✅ | Clear, descriptive title | `Recipe Photo Styling` |
| `description` | string | ✅ | Brief explanation | `Style and photograph recipes...` |
| `prompt` | string | ✅ | Full prompt content | `Food styling for recipe...` |
| `imageSrc` | string | ✅ | Image URL | `https://images.unsplash.com/...` |
| `tags` | array | ❌ | Relevant keywords | `["food", "photography"]` |
| `contributor.name` | string | ❌ | Your name | `John Doe` |
| `contributor.email` | string | ❌ | Your email | `john@example.com` |

### Valid Categories

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

**Recommended Sources:**
- [Unsplash](https://unsplash.com) - Free, high-quality images
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images and videos

**Format:**
```
https://images.unsplash.com/photo-xxxxxxxxxxxxx?w=500
```

**Requirements:**
- Must be publicly accessible
- Should be relevant to the prompt
- Prefer landscape orientation
- Minimum 500px width recommended

---

## Review Process

### Timeline

- **Email Submissions**: 1-3 business days
- **GitHub PRs**: 1-2 business days (faster if properly formatted)

### Review Criteria

We review submissions based on:

1. **Quality**: Is the prompt well-written and useful?
2. **Originality**: Is it unique or a valuable variation?
3. **Formatting**: Does it follow the JSON specification?
4. **Completeness**: Are all required fields included?
5. **Appropriateness**: Is the content suitable for all audiences?

### Possible Outcomes

✅ **Approved**: Your prompt is merged and goes live immediately

🔄 **Revision Requested**: We'll ask you to make changes
- Email: We'll email you with requested changes
- GitHub: We'll comment on your PR

❌ **Rejected**: Prompt doesn't meet quality standards
- We'll provide feedback on why
- You're welcome to revise and resubmit

### After Approval

- **Email submissions**: You'll receive a confirmation email
- **GitHub PRs**: Your PR will be merged and you'll be notified
- Your prompt goes live immediately after approval
- You'll be credited as a contributor (if you provided your name)

---

## Questions or Issues?

### For Questions:
- Open an issue on GitHub
- Email us at suedacicekli@gmail.com

### For Bug Reports:
- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce

### For Feature Requests:
- Open a GitHub Discussion
- Describe the feature and use case
- Explain why it would be valuable

---

## Code of Conduct

By contributing to Promptloper, you agree to:

- Be respectful and inclusive
- Provide constructive feedback
- Follow our guidelines
- Create high-quality, useful content
- Respect intellectual property rights

---

## License

By contributing to Promptloper, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Promptloper and helping build an amazing prompt library for the community!
