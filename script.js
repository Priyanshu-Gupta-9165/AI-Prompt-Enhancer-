/**
 * AI Prompt Enhancer - Script
 * Transforms simple prompts into professional AI-ready prompts
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // DOM Elements
    // ========================================
    const elements = {
        // Theme
        themeToggle: document.getElementById('themeToggle'),

        // Input
        basicPromptInput: document.getElementById('basicPromptInput'),
        aiModelSelector: document.getElementById('aiModelSelector'),
        charCount: document.getElementById('charCount'),

        // Options
        addRole: document.getElementById('addRole'),
        addContext: document.getElementById('addContext'),
        addFormat: document.getElementById('addFormat'),
        addTone: document.getElementById('addTone'),
        addConstraints: document.getElementById('addConstraints'),
        addExamples: document.getElementById('addExamples'),
        addStepByStep: document.getElementById('addStepByStep'),

        // Custom Role
        customRoleDiv: document.getElementById('customRoleDiv'),
        customRoleInput: document.getElementById('customRoleInput'),

        // Buttons
        enhanceButton: document.getElementById('enhanceButton'),
        copyButton: document.getElementById('copyButton'),
        clearButton: document.getElementById('clearButton'),

        // Output
        enhancedPromptOutput: document.getElementById('enhancedPromptOutput'),
        copyFeedback: document.getElementById('copyFeedback')
    };

    // ========================================
    // Theme Management
    // ========================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    };

    const updateThemeIcon = (theme) => {
        const moonIcon = document.getElementById('themeIconMoon');
        const sunIcon = document.getElementById('themeIconSun');

        if (theme === 'dark') {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };

    // ========================================
    // Character Counter
    // ========================================
    const updateCharCount = () => {
        const count = elements.basicPromptInput.value.length;
        elements.charCount.textContent = count.toLocaleString();
    };

    // ========================================
    // Option Chips Management
    // ========================================
    const initOptionChips = () => {
        const chips = document.querySelectorAll('.option-chip');

        chips.forEach(chip => {
            const checkbox = chip.querySelector('input[type="checkbox"]');

            // Set initial state
            if (checkbox.checked) {
                chip.classList.add('active');
            }

            // Toggle on click
            chip.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    checkbox.checked = !checkbox.checked;
                }
                chip.classList.toggle('active', checkbox.checked);

                // Handle custom role visibility
                if (checkbox.id === 'addRole') {
                    toggleCustomRole(checkbox.checked);
                }
            });
        });
    };

    const toggleCustomRole = (show) => {
        if (show) {
            elements.customRoleDiv.classList.add('visible');
        } else {
            elements.customRoleDiv.classList.remove('visible');
        }
    };

    // ========================================
    // Prompt Enhancement Logic
    // ========================================
    const enhancePrompt = () => {
        const basicPrompt = elements.basicPromptInput.value.trim();
        const targetModel = elements.aiModelSelector.value;
        const customRole = elements.customRoleInput.value.trim();

        if (!basicPrompt) {
            showFeedback('⚠️ Please enter a basic prompt first.', 'warning');
            elements.basicPromptInput.focus();
            return;
        }

        // Build enhanced prompt parts
        const parts = {
            role: '',
            coreTask: `🎯 **Core Task:**\n${basicPrompt}`,
            context: '',
            outputFormat: '',
            tone: '',
            constraints: '',
            examples: '',
            stepByStep: '',
            modelInstructions: ''
        };

        // Add Role/Persona
        if (elements.addRole.checked) {
            const roleText = customRole || '[Specify your desired role, e.g., "an expert marketing strategist", "a creative writing mentor"]';
            parts.role = `🎭 **Role:**\nYou are ${roleText}.`;
        }

        // Add Context
        if (elements.addContext.checked) {
            parts.context = `ℹ️ **Context:**\n[Provide relevant background information, target audience, current situation, or any specific details the AI should know.]`;
        }

        // Add Output Format
        if (elements.addFormat.checked) {
            parts.outputFormat = `📄 **Desired Output Format:**\n[Specify format: bullet points, numbered list, markdown table, JSON, paragraph, code block, etc.]`;
        }

        // Add Tone
        if (elements.addTone.checked) {
            parts.tone = `🗣️ **Tone & Style:**\n[Specify: professional, casual, friendly, formal, humorous, empathetic, technical, etc.]`;
        }

        // Add Constraints
        if (elements.addConstraints.checked) {
            parts.constraints = `⚙️ **Constraints & Guidelines:**\n• [Word/length limit if any]\n• [Topics or approaches to avoid]\n• [Specific requirements to follow]`;
        }

        // Add Examples
        if (elements.addExamples.checked) {
            parts.examples = `💡 **Examples (Few-Shot Learning):**\n[Provide 1-2 examples of input/output pairs to guide the AI's response pattern.]`;
        }

        // Add Step-by-Step
        if (elements.addStepByStep.checked) {
            parts.stepByStep = `🔢 **Approach:**\nPlease think through this step-by-step, breaking down complex aspects into manageable parts.`;
        }

        // Model-Specific Instructions
        parts.modelInstructions = getModelInstructions(targetModel, parts, basicPrompt);

        // Assemble final prompt
        const finalPrompt = assemblePrompt(parts);

        elements.enhancedPromptOutput.value = finalPrompt;
        showFeedback('✨ Prompt enhanced successfully!', 'success');

        // Animate the output
        elements.enhancedPromptOutput.classList.add('pulse');
        setTimeout(() => elements.enhancedPromptOutput.classList.remove('pulse'), 500);
    };

    const getModelInstructions = (model, parts, basicPrompt) => {
        const instructions = {
            chatgpt: `🤖 **AI Instructions (ChatGPT):**\nProvide a well-structured, comprehensive response. Be helpful and directly address the user's needs.`,

            claude: `🤖 **AI Instructions (Claude):**\nFocus on clarity, accuracy, and thoughtful communication. Structure your response for easy readability. Be helpful, harmless, and honest.`,

            gemini: `🤖 **AI Instructions (Gemini):**\nProvide a comprehensive, creative, and engaging response. Leverage your multimodal understanding where applicable.`,

            perplexity: `🤖 **AI Instructions (Perplexity):**\nProvide fact-checked, well-researched information. Include citations or sources when possible. Focus on accuracy and reliability.`,

            deepseek: `🤖 **AI Instructions (DeepSeek):**\nProvide technically detailed and insightful analysis. Explore nuances thoroughly. If generating code, ensure it's efficient and well-documented.`,

            code: `🤖 **AI Instructions (Code Generation):**\nGenerate clean, efficient, well-commented code. Follow best practices and modern conventions. Include error handling where appropriate.`,

            general: `🤖 **AI Instructions:**\nProvide a helpful, accurate, and well-organized response that fully addresses the request.`
        };

        // Special handling for code model
        if (model === 'code' && !parts.role) {
            parts.role = `🎭 **Role:**\nYou are an expert programmer with deep knowledge of software development best practices.`;
            parts.coreTask = `🎯 **Core Task:**\nGenerate code for: ${basicPrompt}`;
        }

        return instructions[model] || instructions.general;
    };

    const assemblePrompt = (parts) => {
        const sections = [];

        if (parts.role) sections.push(parts.role);
        sections.push(parts.coreTask);
        if (parts.context) sections.push(parts.context);
        if (parts.outputFormat) sections.push(parts.outputFormat);
        if (parts.tone) sections.push(parts.tone);
        if (parts.constraints) sections.push(parts.constraints);
        if (parts.examples) sections.push(parts.examples);
        if (parts.stepByStep) sections.push(parts.stepByStep);
        if (parts.modelInstructions) sections.push(parts.modelInstructions);

        return sections.join('\n\n---\n\n');
    };

    // ========================================
    // Clipboard & Clear Functions
    // ========================================
    const copyToClipboard = async () => {
        const text = elements.enhancedPromptOutput.value;

        if (!text) {
            showFeedback('📭 Nothing to copy yet!', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showFeedback('📋 Copied to clipboard!', 'success');

            // Button animation
            elements.copyButton.classList.add('copied');
            setTimeout(() => elements.copyButton.classList.remove('copied'), 1000);
        } catch (err) {
            console.error('Copy failed:', err);
            showFeedback('❌ Failed to copy. Try selecting and copying manually.', 'error');
        }
    };

    const clearAll = () => {
        elements.basicPromptInput.value = '';
        elements.enhancedPromptOutput.value = '';
        elements.customRoleInput.value = '';
        updateCharCount();
        showFeedback('🗑️ Cleared!', 'success');
        elements.basicPromptInput.focus();
    };

    // ========================================
    // Feedback Messages
    // ========================================
    const showFeedback = (message, type = 'info') => {
        elements.copyFeedback.textContent = message;
        elements.copyFeedback.className = `feedback-message ${type}`;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            elements.copyFeedback.textContent = '';
        }, 3000);
    };

    // ========================================
    // Event Listeners
    // ========================================
    const initEventListeners = () => {
        // Theme toggle
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Character counter
        elements.basicPromptInput.addEventListener('input', updateCharCount);

        // Buttons
        elements.enhanceButton.addEventListener('click', enhancePrompt);
        elements.copyButton.addEventListener('click', copyToClipboard);
        elements.clearButton.addEventListener('click', clearAll);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to enhance
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                enhancePrompt();
            }

            // Ctrl/Cmd + Shift + C to copy
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                copyToClipboard();
            }
        });
    };

    // ========================================
    // Initialize Application
    // ========================================
    const init = () => {
        initTheme();
        initOptionChips();
        initEventListeners();
        updateCharCount();

        // Initialize custom role visibility
        toggleCustomRole(elements.addRole.checked);

        console.log('✨ AI Prompt Enhancer initialized successfully!');
    };

    init();
});