-- =============================================
-- PROMPTLOPER SEED DATA
-- =============================================
-- JSON dosyalarindan Supabase'e migrate edilen prompt verileri
-- Oncelikle 003_seed_support.sql migration'ini calistirin!
--
-- Calistirmak icin: Supabase Dashboard > SQL Editor > bu dosyayi yapistir > Run

-- Onceki seed verilerini temizle (tekrar calistirmak icin guvenli)
DELETE FROM public.prompts WHERE source_id LIKE 'prompt-%' OR source_id LIKE 'trend-%';

-- =============================================
-- ALL PROMPTS (all-prompts.json)
-- =============================================
INSERT INTO public.prompts (source_id, title, description, prompt_text, category, ai_tool, image_url, tags, is_public, is_trending)
VALUES
(
  'prompt-1',
  'Recipe Photo Styling',
  'Style and photograph recipes for cookbooks and food blogs',
  'Food styling for recipe photography, rustic wooden background, natural ingredients arranged artistically, soft window light, overhead shot, cookbook quality, appetizing composition',
  'Food',
  'midjourney',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
  '{"food", "photography", "styling"}',
  true,
  false
),
(
  'prompt-2',
  'Story Template Series',
  'Create cohesive Instagram story templates for daily posts',
  'Design 7 Instagram story templates for a week, consistent aesthetic, modern fonts, animated elements, swipe-up CTAs, brand colors, editable in Canva',
  'Instagram',
  'gemini',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500',
  '{"instagram", "social-media", "templates"}',
  true,
  false
),
(
  'prompt-3',
  'Product Photography Setup',
  'Professional product photography for e-commerce',
  'E-commerce product photography, white background, multiple angles, soft diffused lighting, high detail, shadow removal, commercial quality, 4k resolution',
  'Photography',
  'midjourney',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500',
  '{"photography", "e-commerce", "product"}',
  true,
  false
),
(
  'prompt-4',
  'API Documentation Generator',
  'Generate comprehensive API documentation automatically',
  'Create API documentation for REST endpoints, include request/response examples, authentication methods, error codes, rate limits, code snippets in multiple languages, interactive examples',
  'Software',
  'chatgpt',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
  '{"software", "api", "documentation"}',
  true,
  false
),
(
  'prompt-5',
  'Research Paper Outline',
  'Structure research papers with proper academic formatting',
  'Generate a research paper outline on artificial intelligence ethics, include abstract, literature review, methodology, findings, discussion, conclusion, APA format, bibliography structure',
  'Homework',
  'chatgpt',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500',
  '{"homework", "research", "academic"}',
  true,
  false
),
(
  'prompt-6',
  'Geometry Problem Solver',
  'Solve geometry problems with visual diagrams',
  'Solve geometry problem: Calculate the area of a triangle with sides 5cm, 12cm, 13cm, show the formula, draw a diagram, explain Heron''s formula, provide step-by-step solution',
  'Math',
  'gemini',
  'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=500',
  '{"math", "geometry", "education"}',
  true,
  false
),
(
  'prompt-7',
  'Landing Page Wireframe',
  'Create conversion-focused landing page wireframes',
  'Design a high-converting landing page wireframe for SaaS product, include hero section, features, testimonials, pricing, CTA buttons, mobile responsive, Figma file',
  'Design',
  'gemini',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
  '{"design", "wireframe", "landing-page"}',
  true,
  false
),
(
  'prompt-9',
  'Business Plan Template',
  'Create comprehensive business plans for startups',
  'Generate a business plan for a mobile app startup, include executive summary, market analysis, competitive landscape, revenue model, marketing strategy, financial projections',
  'Business',
  'chatgpt',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500',
  '{"business", "startup", "planning"}',
  true,
  false
),
(
  'prompt-10',
  'Digital Art Style Guide',
  'Create consistent digital art style references',
  'Digital illustration style guide, anime-inspired characters, vibrant color palette, lighting techniques, brush settings, layer structure, reference sheets, Procreate tutorial',
  'Art',
  'midjourney',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500',
  '{"art", "digital", "illustration"}',
  true,
  false
),

-- =============================================
-- TRENDING PROMPTS (trending-prompts.json)
-- =============================================
(
  'trend-1',
  'Professional LinkedIn Executive Profile Photo Transformation',
  'Transform your selfie into an executive-level LinkedIn profile photo while preserving your exact facial identity. Includes professional studio lighting, business-formal attire, modesty-appropriate styling, and a modern executive office background.',
  E'Professional LinkedIn Executive Profile Photo Transformation\n\nTransform my selfie into an executive-level professional profile photo suitable for C-suite LinkedIn profiles.\n\nCRITICAL REQUIREMENTS:\nPRESERVE THE ORIGINAL FACE COMPLETELY - Do not alter, modify, or change any facial features, face shape, skin tone, or facial characteristics whatsoever.\nMaintain the person''s EXACT facial appearance and identity.\nKeep the original face 100% intact and unmodified.\n\nPhotography Style:\nDramatic yet professional studio lighting with soft, flattering shadows.\nConfident and approachable posture.\nExecutive presence with warm professionalism.\n\nAttire:\nDark navy blue blazer.\nProfessional business formal style.\nModest and conservative styling.\n\nModesty Requirements (if wearing hijab/headscarf):\nKeep hijab/headscarf elegant and professional.\nEnsure neck area remains fully covered.\nArms must be fully covered.\nNo skin showing except face and hands.\nConservative neckline.\n\nBackground:\nModern executive office setting.\nLarge windows with natural light.\nSoftly blurred bokeh (shallow depth of field).\nMinimalist, neutral, professional color palette.\n\nTechnical Specifications:\nHigh-resolution, sharp facial details.\nProfessional color grading.\nLinkedIn-optimized composition.\nHead and shoulders framing.',
  'Linkedin',
  'gemini',
  '/trending-image/linkedin-profile.jpeg',
  '{"linkedin", "professional", "portrait"}',
  true,
  true
),
(
  'trend-2',
  'Fashion Editorial Golden Sunlight Portrait',
  'Create a high-end fashion editorial portrait with dramatic golden-hour lighting, low-angle composition, and the exact same face as the reference image. Perfect for aesthetic Instagram feeds.',
  E'Fashion Editorial Portrait of an individual (face same as reference) seated on a gray floor, leaning against a simple beige wall. Medium shot, low angle.\nOutfit: Same as uploaded reference.\nThe individual has a direct, contemplative gaze.\n\nLighting: Intense, directional golden sunlight from the right side (sunset/late afternoon), creating strong raking light and deep, sharp shadows.\n\nOverall Style: High-end fashion editorial aesthetic, warm cinematic tones, refined color grading, and realistic texture.',
  'Instagram',
  'gemini',
  '/trending-image/instagram-fashion.jpeg',
  '{"instagram", "fashion", "editorial"}',
  true,
  true
),
(
  'trend-3',
  'Hyper-Realistic Top-Down Dinner Plate',
  'A hyper-realistic, minimalist top-down dinner plate featuring a balanced meal. All required ingredients (dough, tomato paste, onion, yogurt) are clearly visible. Generates an English description below the image.',
  E'Create a hyper-realistic, top-down (bird''s-eye) photo of a dinner plate on a clean, minimalist white table with a white round serving plate.\n\nThe meal must be a balanced, real-food dinner containing protein, healthy fats, and vegetables.\nUse only whole, natural, healthy ingredients.\n\nThe food presentation must be elegant, clean, restaurant-quality, with realistic textures, accurate colors, and soft natural lighting.\n\nAfter creating the image, add a short description below the image.\nThe description must:\n• List all ingredients clearly\n• Give a simple dinner idea\n• Be written in the same language as the ingredients (Default language = English)\n\nYou MUST include ALL of the following ingredients on the plate, clearly visible:\nINGREDIENTS: dough, tomato paste, onion, yogurt',
  'Food',
  'gemini',
  '/trending-image/food-table.png',
  '{"food", "realistic", "photography"}',
  true,
  true
),
(
  'trend-4',
  'Modern Dashboard UI Design',
  'Design a clean, modern dashboard interface for SaaS applications',
  'Modern SaaS dashboard UI design, dark mode, glassmorphism elements, data visualization charts, clean typography, minimalist sidebar, responsive layout, Figma design',
  'Software',
  'gemini',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
  '{"software", "dashboard", "ui-design"}',
  true,
  true
),
(
  'trend-5',
  'High-Fashion Cinematic Street Style Portrait',
  'A luxury editorial-style street fashion photograph with cinematic motion blur, natural overcast lighting, muted tones, film-like texture, and the model''s original face preserved.',
  E'Slim stylish person in a busy city street with a moving crowd creating a motion blur effect. The person is wearing an oversized neutral-toned textured blazer with a minimalist fashion aesthetic, natural makeup, and messy hair strands framing the face. Cinematic sharp focus on the model while the background is in motion. Full body shot captured with a 35mm lens, f/2.8, shutter speed 1/30 for motion effect. Natural soft overcast daylight with diffused lighting. Color grading with muted neutral tones, lifted blacks, soft cinematic matte finish, and slight film grain for a luxury editorial look. Ultra-detailed fabrics and realistic skin texture. High-fashion street style photograph in 8k resolution.\n\nSecond pose: Model sitting casually on a city curb, legs slightly bent, elbows resting on knees, one hand playing with hair, looking toward the camera with a soft confident gaze, blurred traffic and people moving behind.\n\nCRITICAL RULE: Never change the face in the photo. Preserve all original facial features and identity exactly.',
  'Instagram',
  'gemini',
  '/trending-image/instagram-street-fashion.png',
  '{"instagram", "fashion", "street-style"}',
  true,
  true
),
(
  'trend-6',
  'Step-by-Step Math Solutions',
  'Solve complex math problems with detailed explanations',
  'Solve this calculus problem step-by-step: Find the derivative of f(x) = 3x^2 + 2x - 5, explain each step clearly, include the power rule, show all work',
  'Math',
  'chatgpt',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
  '{"math", "calculus", "education"}',
  true,
  true
),
(
  'trend-7',
  'Brand Identity Package',
  'Create comprehensive brand identity guidelines for businesses',
  'Design a complete brand identity package for a tech startup, include logo variations, color palette, typography system, brand guidelines, mockups, modern and minimalist style',
  'Design',
  'gemini',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop',
  '{"design", "branding", "identity"}',
  true,
  true
);
