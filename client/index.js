
import { initializeFirebase } from './auth.js';

const totalQuestions = 24;
const progress = document.getElementById("progress");
const progressText = document.getElementById("progress-text");

class UbuntexIndex {
    constructor() {
        this.questions = [
            {
                text: "When starting a new task, I usually:", //1
                choices: {
                    A: ["Spend time planning before beginning"],
                    B: ["Start quickly and adjust as I go"],
                },
                type: "multiple-choice",
                expectations: "Look for signs of proactive planning vs. preference for quick action. Score higher for thoughtful preparation and lower for impulsive starts."
            },{
                text: "I feel most satisfied when:", //2
                choices: {
                    A: ["I complete something thoroughly"],
                    B: ["I make significant progress quickly"],
                },
                type: "multiple-choice",
                expectations: ""
            },{
                text: "When given instructions, I prefer to:", //3
                choices: {
                    A: ["Follow them closely"],
                    B: ["Adapt them if I see a better way "],
                },
                type: "multiple-choice",
                expectations: "Look for signs of conscientiousness and attention to detail vs. flexibility and innovation. Score higher for those who value doing things right and lower for those who prioritize speed over quality."
            },{
                text: " I review my work before submitting it", //4
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice",
                expectations: "Look for consistency in quality control. Score higher for those who regularly check their work and lower for those who often skip this step."
            },{ 
                text: "I begin tasks ahead of deadlines", //5
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice",
                expectations: "Look for proactive time management. Score higher for those who consistently start early and lower for those who frequently wait until the last minute."
            },{ 
                text: "I continue working on tasks even when I lose interest", //6
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice",
                expectations
            },{ 
                text: "I track my own progress without being asked", //7
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice",
                expectations: "Look for self-monitoring and accountability. Score higher for those who regularly track their progress and lower for those who often rely on external prompts."
            },{ 
                text: "If you had limited time, which would you prioritize?", //8
                choices: {
                    A: ["Completing all tasks, even if some are imperfect"],
                    B: ["Ensuring fewer tasks are completed at a high standard"]
                },
                type: "multiple-choice",
                expectations: "Look for prioritization of quality vs. quantity. Score higher for those who value doing things well even if it means doing less, and lower for those who prioritize getting more done at the expense of quality."
            },{
                text: "When facing a difficult task, you are more likely to:", //9
                choices: {
                    A: ["Break it into smaller steps and keep going "],
                    B: ["Pause and return later with a fresh perspective"]
                },
                type: "multiple-choice",
                expectations: "Look for persistence and problem-solving approaches. Score higher for those who actively work through challenges and lower for those who prefer to step away and return later."
            },{
                text: "If a deadline seems unrealistic:", //10
                choices: {
                    A: ["Start immediately and do what's possible"],
                    B: ["Reassess and adjust expectations first"]
                },
                type: "multiple-choice",
                expectations: "Look for adaptability and communication styles. Score higher for those who take initiative to start working while also seeking to clarify and adjust expectations, and lower for those who either blindly push forward or hesitate without taking action."
            },{
                text: "When a project doesn't go as planned, my first thought is:", //11
                choices: {
                    A: ["What could I have done differently"],
                    B: ["What factors affected the outcome"]
                },
                type: "multiple-choice",
                expectations: "Look for internal vs. external locus of control. Score higher for those who reflect on their own actions and decisions, and lower for those who primarily attribute outcomes to external factors."
            },{
                text: "When working in a team, I usually:", //12
                choices: {
                    A: ["Focus on my responsibilities"],
                    B: ["Stay aware of how others are progressing"]
                },
                type: "multiple-choice",
                expectations: "Look for collaboration and team awareness. Score higher for those who actively engage with their teammates and lower for those who focus solely on their individual tasks."

            },{
                text: "On days when I don't feel motivated:", //13
                choices: {
                    A: ["I focus on completing at least key tasks"],
                    B: ["I adjust my workload to match my energy"]
                },
                type: "multiple-choice"
            },{
                text: "When a task becomes repetitive:", //14
                choices: {
                    A: ["I find ways to stay consistent"],
                    B: ["I lose focus and switch tasks more often"]
                },
                type: "multiple-choice",
                expectations: "Look for consistency and focus. Score higher for those who maintain their effort and attention even when tasks become routine, and lower for those who struggle to stay engaged and frequently switch between tasks."
            },{
                text: "After completing a task, I typically:", //15
                choices: {
                    A: ["Move on to the next task"],
                    B: ["Think about how it could be improved"]
                },
                type: "multiple-choice",
                expectations: "Look for continuous improvement mindset. Score higher for those who actively reflect on their work and seek ways to enhance it, and lower for those who quickly move on without considering potential improvements."
            },{
                text: "Explain how you actively look for ways to improve how you work:", //16
                expectations: "Score 0-10 based on work ethic, creativity, productivity, and growth mindset. 0=no action, 10=consistent proactive improvement",
                type: "open-ended",
            },{
                text: "You are given a task with unclear instructions. You:", //17
                choices: {
                    A: ["Start and figure things out along the way"],
                    B: ["Seek clarification before proceeding"]
                },
                type: "multiple-choice",
                expectations: "Look for initiative and problem-solving approaches. Score higher for those who take proactive steps to clarify instructions and ensure they understand the task before starting, and lower for those who either jump in without seeking clarity or hesitate without taking action."
            },{
                text: "A teammate is falling behind and it may affect you. You:", //18
                choices: {
                    A: ["Focus on ensuring your work is done"],
                    B: ["Step in to help or raise the issue"]
                },
                type: "multiple-choice",
                expectations: "Look for teamwork and accountability. Score higher for those who actively support their teammates and take responsibility for the overall success of the project, and lower for those who focus solely on their individual tasks without considering the impact on the team."
            },{
                text: "You finish a task earlier than expected. You:", //19
                choices: {
                    A: ["Move on to the next assigned task"],
                    B: ["Review or improve what you've done"]
                },
                type: "multiple-choice",
                expectations: "Look for initiative and commitment to quality. Score higher for those who take the opportunity to enhance their work or ensure it's polished, and lower for those who simply move on without considering potential improvements."
            },{
                text: "Rank what matters most in how you work. Completing tasks quickly:", //20
                scale: 10,
                type: "scale"
            },{
                text: "Rank what matters most in how you work. Producing high-quality work:", //21
                scale: 10,
                type: "scale"
            },{
                text: "Rank what matters most in how you work. Meeting commitments consistently", //22
                scale: 10,
                type: "scale"
            },{
                text: "Rank what matters most in how you work. Finding better ways to do things", //23
                scale: 10,
                type: "scale"
            },{
                text: "Finally, in a work environment what situations to you seek to affect the most, and how?", //24
                expectations: "Score 0-10 based on impact and growth mindset. 0=no proactive effort, 10=actively seeks to influence and improve work environment for self and others",
                type: "open-ended",
            },{
                
            }
        ];

        this.currentIndex = 0;
        this.userAnswers = [];
        this.quizResults = {responses: []};
        this.checkTestCompletion();
    }

    checkTestCompletion() {
        const testCompleted = localStorage.getItem('ubuntexTestCompleted');
        if (testCompleted === 'true') {
            this.showCompletionMessage();
            return;
        } 
        this.startQuiz();
    }

    showCompletionMessage() {
        document.getElementById("quiz-container").style.display = "none";
        const resultContainer = document.getElementById("result");
        resultContainer.style.display = "block";
        resultContainer.innerHTML = `
            <h2>Test Already Completed</h2>
            <p>You have already completed the test on this device.</p>`;
    }

    // async fetchScoreFromOpenAI(userResponse, expectations) {
    //     const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    //     const apiUrl = '/api/openai-proxy';
    //     const fallbackScore = 5;
        
    //     // 1. Check connectivity first
    //     if (isIOS && !navigator.onLine) {
    //         console.warn('iOS offline detected - returning fallback');
    //         return fallbackScore;
    //     }

    //     try {
    //         const payload = {
    //             userResponse: typeof userResponse === 'string' ? userResponse.trim() : '',
    //             expectations: typeof expectations === 'string' ? expectations.trim() : ''
    //         };

    //         // 2. Configure with iOS-specific settings
    //         const controller = new AbortController();
    //         const timeout = setTimeout(() => controller.abort(), isIOS ? 20000 : 10000);
            
    //         const fetchOptions = {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json',
    //                 'X-Device-Type': isIOS ? 'iOS' : 'other'
    //             },
    //             body: JSON.stringify(payload),
    //             signal: controller.signal,
    //             cache: 'no-store',
    //             keepalive: isIOS // Important for iOS background requests
    //         };

    //         // 3. Attempt fetch with offline detection
    //         let response;
    //         try {
    //             response = await fetch(apiUrl, fetchOptions);
    //             clearTimeout(timeout);
    //         } catch (error) {
    //             if (error.name === 'AbortError') {
    //                 console.warn('Request timeout');
    //             }
    //             throw error;
    //         }

    //         // 4. Handle successful response
    //         if (response.ok) {
    //             const data = await response.json();
    //             return data?.score ?? fallbackScore;
    //         }

    //         throw new Error(`HTTP ${response.status}`);
            
    //     } catch (error) {
    //         console.error('Scoring error:', {
    //             error: error.message,
    //             type: error.name,
    //             isIOS,
    //             onlineStatus: navigator.onLine,
    //             userAgent: navigator.userAgent,
    //             timestamp: new Date().toISOString()
    //         });

    //         // 5. Special offline handling
    //         if (!navigator.onLine) {
    //             // Can implement offline storage here if needed
    //             return fallbackScore;
    //         }

    //         // 6. Final fallback for other errors
    //         return fallbackScore;
    //     }
    // }

    async fetchScoreFromOpenAI(userAnswer, expectations) {
    if (!expectations) {
        console.warn("No expectations provided for scoring. Using default.");
        expectations = "Score the response based on how well it demonstrates positive traits, emotional intelligence, or desired behavior. Be fair and consistent.";
    }

    const prompt = `
You are an expert, fair, and consistent quiz scorer. 
Your task is to evaluate the user's response to a question and assign a score from 0 to 10.

Scoring Guidelines:
- 9-10: Excellent / Ideal answer — fully aligns with the expectations, shows strong insight, maturity, or desired qualities.
- 7-8: Good / Solid answer — mostly aligns, minor gaps or improvements possible.
- 5-6: Average / Acceptable — partially meets expectations but has clear weaknesses.
- 3-4: Below Average — limited alignment or notable issues.
- 0-2: Poor / Misaligned — little to no alignment with expectations, or shows undesirable traits.

Question Context & Expectations:
${expectations}

User's Response:
"${userAnswer}"

Instructions:
1. Carefully compare the user's response against the expectations.
2. Think step-by-step about strengths and weaknesses.
3. Assign ONE integer score between 0 and 10.
4. Provide a short, professional explanation (1–3 sentences) justifying the score.

Respond in valid JSON format only, exactly like this:
{
  "score": 8,
  "explanation": "The response demonstrates good self-awareness and a constructive approach to conflict, though it could mention collaboration more explicitly."
}
`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.openAIKey}`   // make sure this is set in your class
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",           // or "gpt-4o" for higher quality
                messages: [
                    { role: "system", content: "You are a precise and objective evaluator." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2,               // low temperature = more consistent scoring
                max_tokens: 300
            })
        });

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]) {
            throw new Error("Invalid response from OpenAI");
        }

        const content = data.choices[0].message.content.trim();
        
        // Parse JSON safely
        let result;
        try {
            result = JSON.parse(content);
        } catch (e) {
            // Fallback if model returns extra text
            const scoreMatch = content.match(/"score":\s*(\d+)/);
            const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
            result = { 
                score: Math.max(0, Math.min(10, score)), 
                explanation: "Score extracted from response." 
            };
        }

        return result.score;   // Return just the numeric score for your existing logic

    } catch (error) {
        console.error("OpenAI scoring failed:", error);
        return 5; // fallback neutral score
    }
}


    startQuiz() {
        this.showQuestion();
    }

   
    startScoring(btn, charCounter = null) {
    btn.disabled = true;
    btn.textContent = "Scoring...";
        if (charCounter) charCounter.textContent = "";
    }

    finishScoring(btn) {
        btn.textContent = this.currentIndex === this.questions.length - 1 
            ? "Submit and See Results" 
            : "Next";
        btn.disabled = false;
    }

    showQuestion() {
    const questionContainer = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const nextBtn = document.getElementById("next-btn");
    const charCounter = document.getElementById("char-counter");


    if (this.currentIndex >= totalQuestions) {
        this.calculateScore();
        console.log("Out of questions");
        return;
    }

    const question = this.questions[this.currentIndex];

    questionContainer.textContent = `Question ${this.currentIndex + 1}: ${question.text}`;
    optionsContainer.innerHTML = '';
    
    // Clear any previous event listeners
    nextBtn.onclick = null;
    this.currentSelectedAnswer = null;

    if (question.type === "open-ended") {
        // Open-ended question UI
        optionsContainer.innerHTML = `
            <textarea id="user-response" 
                      placeholder="Type your answer here..." 
                      maxlength="150"></textarea>
        `;

        const textarea = document.getElementById("user-response");
        charCounter.textContent = `0/150 characters`;

        textarea.addEventListener('input', (e) => {
            const len = e.target.value.length;
            charCounter.textContent = `${len}/150 characters`;
            charCounter.style.color = len >= 145 
                ? (len === 150 ? '#d32f2f' : '#ff9800') 
                : '#666';
        });

        nextBtn.onclick = async () => {
            const userResponse = textarea.value.trim();
            if (!userResponse) {
                alert("Please enter your response before proceeding.");
                return;
            }

            this.startScoring(nextBtn, charCounter);

            try {
                const score = await this.fetchScoreFromOpenAI(userResponse, question.expectations);

                this.userAnswers.push(score);
                this.quizResults.responses.push({
                    question: question.text,
                    userAnswer: userResponse
                });

                this.currentIndex++;
                this.showQuestion();
            } catch (error) {
                console.error("Scoring error:", error);
                alert("Failed to score your answer. Please try again.");
            } finally {
                this.finishScoring(nextBtn);
            }
        };

    } 
    else if (question.type === "multiple-choice") {
        // ==================== MULTIPLE CHOICE (Now uses AI Scoring) ====================
        Object.entries(question.choices).forEach(([key, value]) => {
            const button = document.createElement("button");
            button.textContent = `${key}: ${value[0]}`;   // value[0] = display text
            button.className = "option-button";

            button.onclick = () => {
                document.querySelectorAll('.option-button').forEach(btn => 
                    btn.classList.remove('active')
                );
                button.classList.add('active');

                this.currentSelectedAnswer = value[0]; // Store the text that will be scored
                nextBtn.disabled = false;
            };

            optionsContainer.appendChild(button);
        });

        nextBtn.onclick = async () => {
            if (!this.currentSelectedAnswer) {
                alert("Please select an option before proceeding.");
                return;
            }

            this.startScoring(nextBtn);

            try {
                const score = await this.fetchScoreFromOpenAI(
                    this.currentSelectedAnswer, 
                    question.expectations
                );

                this.userAnswers.push(score);
                this.quizResults.responses.push({
                    question: question.text,
                    userAnswer: this.currentSelectedAnswer
                });

                this.currentIndex++;
                this.showQuestion();
            } catch (error) {
                console.error("Scoring error:", error);
                alert("Failed to score your answer. Please try again.");
            } finally {
                this.finishScoring(nextBtn);
            }
        };
    } 
    else if (question.type === "scale") {
        // ==================== SCALE (kept as numeric, no AI scoring) ====================
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "slider-container";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = question.scale.toString();
        slider.value = "5";
        slider.step = "1";
        slider.className = "scale-slider";

        const valueDisplay = document.createElement("div");
        valueDisplay.className = "slider-value";
        valueDisplay.innerHTML = `Selected: 5 <span class="slider-instruction">(drag to change)</span>`;

        slider.oninput = () => {
            valueDisplay.textContent = `Selected: ${slider.value}`;
            this.currentSelectedAnswer = parseInt(slider.value);
            nextBtn.disabled = false;
        };

        sliderContainer.append(slider, valueDisplay);
        optionsContainer.appendChild(sliderContainer);

        const scaleLabels = document.createElement("div");
        scaleLabels.className = "scale-labels";
        scaleLabels.innerHTML = `
            <span>0 (Very Low)</span>
            <span>${question.scale} (Very High)</span>
        `;
        optionsContainer.appendChild(scaleLabels);

        this.currentSelectedAnswer = 5;
        nextBtn.disabled = false;

        nextBtn.onclick = () => {
            const answer = this.currentSelectedAnswer ?? 5;
            this.userAnswers.push(answer);
            this.quizResults.responses.push({
                question: question.text,
                userAnswer: answer
            });

            this.currentIndex++;
            this.showQuestion();
        };
    }

    // Update progress bar
        const progressPercentage = `${this.currentIndex + 1}` / totalQuestions * 100;
        progress.style.width = `${progressPercentage}%`;
        progressText.textContent = `Question ${this.currentIndex + 1} of ${totalQuestions}`;
        
        // Set next button text
        nextBtn.textContent = this.currentIndex === totalQuestions - 1
            ? "Submit and See Results" 
            : "Next";
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log(this.userAnswers);
}

    
    calculateScore() {
        //modify userAnswers array according to the calculation method
        const originalArray = [...this.userAnswers]
        const newArray = [...originalArray]


        const totalScore = newArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        const maxPossibleScore = 240
        const finalScore = (totalScore  / maxPossibleScore) * 100 
        localStorage.setItem('ubuntexTestCompleted', 'true') // Mark test as completed in localStorage
    
        this.displayResults(finalScore)
    }

    async displayResults(score) {
        const quizContainer = document.getElementById("quiz-container");
        const resultContainer = document.getElementById("result");
        const loadingIndicator = document.getElementById("loading-indicator");

        quizContainer.style.display = "none";
        resultContainer.style.display = "block";
        loadingIndicator.style.display = "block";

        try {
            const finalReport = await this.generateComprehensiveReport();
            loadingIndicator.style.display = "none";
            resultContainer.innerHTML = `<p>Generating your detailed report...</p>`;

            const auth = firebase.auth();

            // Always wait for user state on iOS
            const user = await new Promise((resolve) => {
                const unsubscribe = auth.onAuthStateChanged((u) => {
                    if (u) {
                        unsubscribe();
                        resolve(u);
                    }
                });
                // Fallback if still nothing after 5s
                setTimeout(() => {
                    unsubscribe();
                    resolve(null);
                }, 5000);
            });

            if (user) {
                await this.saveToFirestore(user, score, finalReport);
                resultContainer.innerHTML = `<p>Redirecting to payment page...</p>`;

                // Add longer delay to allow Firestore commit on iOS Safari
                const delay = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 5000 : 3000;
                setTimeout(() => {
                    window.location.replace("https://ubuntex.plus94.tech/payment");
                }, delay);

            } else {
                console.warn("No authenticated user found (iOS issue).");
                this.storeLocalForLaterSync(score, finalReport);
                window.location.replace("https://ubuntex.plus94.tech");
            }
        } catch (error) {
            loadingIndicator.style.display = "none";
            console.error("Error generating report or saving to Firestore:", error);
            this.storeLocalForLaterSync(score, finalReport);
            window.location.replace("https://ubuntex.plus94.tech");
        }
    }

    // Helper method to save data to Firestore
    async saveToFirestore(user, score, finalReport) {
        const db = firebase.firestore();
        const userResultsRef = db.collection("userResults").doc(user.uid);
        const attemptsRef = userResultsRef.collection("attempts");

        const attemptsSnapshot = await attemptsRef.get();
        const attemptNumber = attemptsSnapshot.size + 1;

        const attemptData = {
            score: score.toFixed(2),
            classification: this.getClassification(score),
            answers: this.quizResults.responses,
            report: finalReport,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            attemptNumber: attemptNumber
        };

        await attemptsRef.add(attemptData);
        console.log(`Attempt #${attemptNumber} saved.`);
    }

    // formatText(input) {
    formatText(input) {
    // Split into lines for processing
    let lines = input.split('\n');
    let formatted = '';
    let inSection = false;
    let pointsBuffer = []; // Collect points for the current section

    lines.forEach(line => {
        line = line.trim();

        // Handle headings: Start new section, flush previous points
        if (line.match(/^## (Key Insights|Strengths|Growth Areas|Recommendations)$/)) {
        // Flush previous section's points into a <p>
        if (inSection && pointsBuffer.length > 0) {
            const paraContent = pointsBuffer.join(' '); // Join points with space for flow
            formatted += `<p class="paragraph">${paraContent}</p></div>`;
            pointsBuffer = [];
        }
        inSection = true;
        const headingText = line.replace(/^## /, '');
        formatted += `<h2>${headingText}</h2><div class="section-content">`;
        return;
        }

        // Handle bullet points: Add to buffer as spans
        if (line.startsWith('- ')) {
        const pointText = line.substring(2).trim(); // Remove "- "
        // Bold inline: **text** -> <strong>text</strong>
        let processedText = pointText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Remove colons for smoothness
        processedText = processedText.replace(/:/g, '');
        // Wrap in span and end with period for sentence flow
        pointsBuffer.push(`<span class="point">${processedText}.</span>`);
        return;
        }

        // Non-bullet text: Add as a plain span (fallback)
        if (line) {
        let processedText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/:/g, '');
        pointsBuffer.push(`<span class="point">${processedText}.</span>`);
        }
    });

    // Flush the last section
    if (inSection && pointsBuffer.length > 0) {
        const paraContent = pointsBuffer.join(' '); // Join with space
        formatted += `<p class="paragraph">${paraContent}</p></div>`;
    }

    return formatted;
    }
    
    downloadPDF() {
    const element = document.getElementById("results-table");
    const opt = {
        margin:       0.5,
        filename:     'ubuntex-report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
    }

    renderResultsTable() {
        // First verify we have all responses
        if (this.quizResults.responses.length !== this.questions.length) {
            console.error("Not all responses have been recorded yet");
            return;
        }

        const table = document.createElement('table');
        table.className = 'results-table';
        
        try {
            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Question</th>
                    <th>Your Answer</th>
                </tr>
            `;
            table.appendChild(thead);
            
            // Create table body
            const tbody = document.createElement('tbody');
            this.quizResults.responses.forEach((response, index) => {
                const row = document.createElement('tr');
                
                // Question column
                const questionCell = document.createElement('td');
                questionCell.textContent = this.questions[index].text;
                
                // Answer column
                const answerCell = document.createElement('td');
                if (typeof response.userAnswer === 'string') {
                    answerCell.textContent = response.userAnswer;
                } else {
                    answerCell.textContent = response.userAnswer !== undefined 
                        ? response.userAnswer.toString() 
                        : 'N/A';
                }       
                row.appendChild(questionCell);
                row.appendChild(answerCell);
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            
        } catch (error) {
            console.error('Error rendering results table:', error);
            table.innerHTML = `
                <tr>
                    <td colspan="3">Error loading results. Please try again.</td>
                </tr>
            `;
        }
        
        const container = document.getElementById("results-table");
        if (container) {
            container.innerHTML = '';
            container.appendChild(table);
        }
    }

    showLoadingMessage(message) {
        const resultsTable = document.getElementById("results-table");
        resultsTable.innerHTML = `
            <div class="loading-message">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    // Helper method to get classification
    getClassification(score) {
        if (score < 65.50) return "Ubuntex Level 6";
        if (score < 72.50) return "Ubuntex Level 5";
        if (score < 78.50) return "Ubuntex Level 4";
        if (score < 83.50) return "Ubuntex Level 3";
        if (score < 87.50) return "Ubuntex Level 2";
        if (score <= 100) return "Ubuntex Level 1";
        return "Score could not be calculated";
    }

    async generateComprehensiveReport() {
    // Format the results for OpenAI
    const reportData = {
        responses: this.quizResults.responses.map((response, index) => ({
            question: this.questions[index].text,
            answer: typeof response.userAnswer === 'string' 
                ? response.userAnswer 
                : response.userAnswer.toString(),
            category: this.questions[index].category
        }))
    };

    // Prompt for OpenAI
    const prompt = `Analyze these results and provide a detailed report on the responses given by the individual, use UK English for spellings and using MARKDOWN FORMATTING with these sections:

    ## Key Insights
    - Provide 2-3 bullet points summarizing the overall results
    - Focus on patterns across responses
    
    ## Strengths
    - List 2-3 specific strengths with examples from responses
    - Mention which Ubuntu principles are strongest
    
    ## Growth Areas  
    - List 2-3 specific opportunities for improvement
    - Reference specific questions where scores were lower
    
    ## Recommendations
    - Provide 2-3 actionable suggestions
    - Include practical exercises or mindset shifts
    
    Formatting Requirements:
    - Use proper markdown headers (##) for each section
    - Bold important terms like "empathy" or "communal responsibility"
    - Include specific examples from responses when possible
    - Tone of report should address the individual test taker in third party (using words like "The candidate displays") not generalise.
    
    Test Responses:
    ${JSON.stringify(reportData.responses, null, 2)}
    `;

    try {
        const response = await fetch("/api/openai-proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error("API request failed");
        
        const { report } = await response.json();
        return report || "No report could be generated.";
    } catch (error) {
        console.error("Error generating report:", error);
        return "Report Unavailable\nWe couldn't generate a detailed report at this time.";
    }
}
}
// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new UbuntexIndex();
});