document.addEventListener('DOMContentLoaded', () => {
    const basicPromptInput = document.getElementById('basicPromptInput');
    const aiModelSelector = document.getElementById('aiModelSelector');
    const enhanceButton = document.getElementById('enhanceButton');
    const enhancedPromptOutput = document.getElementById('enhancedPromptOutput');
    const copyButton = document.getElementById('copyButton');
    const copyFeedback = document.getElementById('copyFeedback');

    // Enhancement option checkboxes
    const addRoleCheckbox = document.getElementById('addRole');
    const addContextCheckbox = document.getElementById('addContext');
    const addFormatCheckbox = document.getElementById('addFormat');
    const addToneCheckbox = document.getElementById('addTone');
    const addConstraintsCheckbox = document.getElementById('addConstraints');
    const addExamplesCheckbox = document.getElementById('addExamples');
    const addStepByStepCheckbox = document.getElementById('addStepByStep');

    // Custom Role input
    const customRoleDiv = document.getElementById('customRoleDiv');
    const customRoleInput = document.getElementById('customRoleInput');

    // Show/hide custom role input based on checkbox
    addRoleCheckbox.addEventListener('change', function() {
        customRoleDiv.style.display = this.checked ? 'block' : 'none';
    });
    // Initialize visibility
    customRoleDiv.style.display = addRoleCheckbox.checked ? 'block' : 'none';


    enhanceButton.addEventListener('click', () => {
        const basicPrompt = basicPromptInput.value.trim();
        const targetModel = aiModelSelector.value;
        const customRoleText = customRoleInput.value.trim();

        if (!basicPrompt) {
            enhancedPromptOutput.value = "Please enter a basic prompt first.";
            return;
        }

        let enhancedParts = {
            role: "",
            coreTask: `🎯 Your primary task is to: ${basicPrompt}`, // Added emoji
            context: "",
            outputFormat: "",
            tone: "",
            constraints: "",
            examples: "",
            stepByStep: "",
            modelSpecificInstructions: ""
        };

        // 1. Apply General Enhancement Options
        if (addRoleCheckbox.checked) {
            const defaultRolePlaceholder = "[Specify Desired Role/Persona, e.g., 'an expert marketing strategist', 'a supportive coach']";
            enhancedParts.role = `🎭 Act as ${customRoleText || defaultRolePlaceholder}.`; // Added emoji
        }

        if (addContextCheckbox.checked) {
            enhancedParts.context = `ℹ️ Context:\n[Provide any necessary background information, data, current situation, or user profile here. E.g., "Target audience: beginners."]\n`; // Added emoji
        }

        if (addFormatCheckbox.checked) {
            enhancedParts.outputFormat = `📄 Output Format:\n[Specify the desired format, e.g., 'a bulleted list', 'a JSON object', 'a concise summary', 'a markdown table'].\n`; // Added emoji
        }

        if (addToneCheckbox.checked) {
            enhancedParts.tone = `🗣️ Tone:\n[Specify the desired tone, e.g., 'professional', 'friendly', 'witty', 'empathetic', 'neutral'].\n`; // Added emoji
        }

        if (addConstraintsCheckbox.checked) {
            enhancedParts.constraints = `⚙️ Constraints & Guidelines:\n[Specify limitations or things to avoid. E.g., 'Do not use jargon.', 'Limit to 500 words.', 'Focus on practical advice.'].\n`; // Added emoji
        }

        if (addExamplesCheckbox.checked) {
            enhancedParts.examples = `💡 Examples (Optional - Illustrative):\n[If applicable, provide 1-2 concise examples. \nExample 1 Input: ... \nExample 1 Output: ...]\n`; // Added emoji
        }

        if (addStepByStepCheckbox.checked) {
            enhancedParts.stepByStep = `🚶‍♂️ Step-by-Step Guidance:\nThink step-by-step to ensure a comprehensive and logical response. Break down complex tasks.\n`; // Added emoji
        }

        // 2. Apply Model-Specific Enhancements
        let modelInstructionPrefix = "🤖 Model Instructions:\n"; // Added emoji
        switch (targetModel) {
            case 'chatgpt':
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Please act as a helpful and knowledgeable assistant. Ensure your response is well-structured and directly addresses the user's core task within the provided context.`;
                if (!enhancedParts.role && !customRoleText) { // Keep role logic
                    enhancedParts.role = "🎭 You are a highly capable and helpful AI assistant.";
                }
                break;
            case 'perplexity':
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Provide a fact-checked and well-researched response. If possible, cite credible sources or provide links. Focus on accuracy.`;
                if (!basicPrompt.endsWith("?") && !basicPrompt.toLowerCase().startsWith("explain") && !basicPrompt.toLowerCase().startsWith("what is")) {
                     enhancedParts.coreTask = `🎯 Your primary task is to find information about and explain: ${basicPrompt}`;
                }
                break;
            case 'deepseek':
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Strive for technical depth and insightful analysis. Explore nuances and provide detailed explanations. If generating code, ensure it is efficient and well-documented.`;
                break;
            case 'claude':
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Focus on clarity, conciseness, and thoughtful communication. Demonstrate emotional intelligence. Structure your output for easy readability.`;
                enhancedParts.constraints += (enhancedParts.constraints ? "\n" : "") + "Please ensure your response is helpful, harmless, and honest."; // This constraint can remain as it is
                break;
            case 'gemini':
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Aim for a comprehensive and creative response. Be informative and engaging.`;
                break;
            case 'code':
                 if (!enhancedParts.role && !customRoleText) {
                    enhancedParts.role = "🎭 Act as an expert programmer.";
                }
                enhancedParts.coreTask = `🎯 Your primary task is to generate code for: ${basicPrompt}`;
                if (!addFormatCheckbox.checked && !enhancedParts.outputFormat) {
                     enhancedParts.outputFormat = `📄 Output Format:\n[Specify programming language, libraries, expected functionality, e.g., 'Python script using 'requests' to fetch API data.']\n`;
                }
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Produce clean, efficient, and well-commented code. Adhere to best practices.`;
                break;
            case 'general':
            default:
                enhancedParts.modelSpecificInstructions = `${modelInstructionPrefix}Please provide a comprehensive and helpful response.`;
                break;
        }

        // 3. Assemble the Enhanced Prompt - MODIFIED SECTION
        let finalPrompt = "";
        if (enhancedParts.role) finalPrompt += enhancedParts.role + "\n\n";
        
        finalPrompt += enhancedParts.coreTask + "\n\n";

        // Combine all detail parts, adding a bit more space between them if they exist
        if (enhancedParts.context) finalPrompt += enhancedParts.context + "\n";
        if (enhancedParts.outputFormat) finalPrompt += enhancedParts.outputFormat + "\n";
        if (enhancedParts.tone) finalPrompt += enhancedParts.tone + "\n";
        if (enhancedParts.constraints) finalPrompt += enhancedParts.constraints + "\n";
        if (enhancedParts.examples) finalPrompt += enhancedParts.examples + "\n";
        
        // Add a clear separation before guidance and model instructions if any details were added
        if (enhancedParts.context || enhancedParts.outputFormat || enhancedParts.tone || enhancedParts.constraints || enhancedParts.examples) {
            finalPrompt += "\n"; 
        }

        if (enhancedParts.stepByStep) finalPrompt += enhancedParts.stepByStep + "\n";
        if (enhancedParts.modelSpecificInstructions) finalPrompt += "\n" + enhancedParts.modelSpecificInstructions; // Add a newline before model instructions if stepbystep is also present

        enhancedPromptOutput.value = finalPrompt.trim();
        copyFeedback.textContent = ''; // Clear previous copy feedback
    });

    copyButton.addEventListener('click', () => {
        if (enhancedPromptOutput.value) {
            navigator.clipboard.writeText(enhancedPromptOutput.value)
                .then(() => {
                    copyFeedback.textContent = 'Copied to clipboard! ✅'; // Added emoji
                    setTimeout(() => { copyFeedback.textContent = ''; }, 2000);
                })
                .catch(err => {
                    copyFeedback.textContent = 'Failed to copy. ❌'; // Added emoji
                    console.error('Failed to copy text: ', err);
                });
        } else {
            copyFeedback.textContent = 'Nothing to copy. 🤷'; // Added emoji
            setTimeout(() => { copyFeedback.textContent = ''; }, 2000);
        }
    });
});