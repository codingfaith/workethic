
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
                type: "multiple-choice"
            },{
                text: "I feel most satisfied when:", //2
                choices: {
                    A: ["I complete something thoroughly"],
                    B: ["I make significant progress quickly"],
                },
                type: "multiple-choice"
            },{
                text: "When given instructions, I prefer to:", //3
                choices: {
                    A: ["Follow them closely"],
                    B: ["Adapt them if I see a better way "],
                },
                type: "multiple-choice"
            },{
                text: " I review my work before submitting it", //4
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice"
            },{ 
                text: "I begin tasks ahead of deadlines", //5
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice"
            },{ 
                text: "I continue working on tasks even when I lose interest", //6
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice"
            },{ 
                text: "I track my own progress without being asked", //7
                choices: {
                    A: ["Never "],
                    B: ["Rarely"],
                    C: ["Sometimes "],
                    D: ["Almost Always"]
                },
                type: "multiple-choice"
            },{ 
                text: "If you had limited time, which would you prioritize?", //8
                choices: {
                    A: ["Completing all tasks, even if some are imperfect"],
                    B: ["Ensuring fewer tasks are completed at a high standard"]
                },
                type: "multiple-choice"
            },{
                text: "When facing a difficult task, you are more likely to:", //9
                choices: {
                    A: ["Break it into smaller steps and keep going "],
                    B: ["Pause and return later with a fresh perspective"]
                },
                type: "multiple-choice"
            },{
                text: "If a deadline seems unrealistic:", //10
                choices: {
                    A: ["Start immediately and do what's possible"],
                    B: ["Reassess and adjust expectations first"]
                },
                type: "multiple-choice"
            },{
                text: "When a project doesn't go as planned, my first thought is:", //11
                choices: {
                    A: ["What could I have done differently"],
                    B: ["What factors affected the outcome"]
                },
                type: "multiple-choice"
            },{
                text: "When working in a team, I usually:", //12
                choices: {
                    A: ["Focus on my responsibilities"],
                    B: ["Stay aware of how others are progressing"]
                },
                type: "multiple-choice"
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
                type: "multiple-choice"
            },{
                text: "After completing a task, I typically:", //15
                choices: {
                    A: ["Move on to the next task"],
                    B: ["Think about how it could be improved"]
                },
                type: "multiple-choice"
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
                type: "multiple-choice"
            },{
                text: "A teammate is falling behind and it may affect you. You:", //18
                choices: {
                    A: ["Focus on ensuring your work is done"],
                    B: ["Step in to help or raise the issue"]
                },
                type: "multiple-choice"
            },{
                text: "You finish a task earlier than expected. You:", //19
                choices: {
                    A: ["Move on to the next assigned task"],
                    B: ["Review or improve what you've done"]
                },
                type: "multiple-choice"
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
                expectations: "Score 0-10 based on work ethic, creativity, productivity, and growth mindset. 0=no action, 10=consistent proactive improvement",
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

    async fetchScoreFromOpenAI(userResponse, expectations) {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const apiUrl = '/api/openai-proxy';
        const fallbackScore = 5;
        
        // 1. Check connectivity first
        if (isIOS && !navigator.onLine) {
            console.warn('iOS offline detected - returning fallback');
            return fallbackScore;
        }

        try {
            const payload = {
                userResponse: typeof userResponse === 'string' ? userResponse.trim() : '',
                expectations: typeof expectations === 'string' ? expectations.trim() : ''
            };

            // 2. Configure with iOS-specific settings
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), isIOS ? 20000 : 10000);
            
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Device-Type': isIOS ? 'iOS' : 'other'
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
                cache: 'no-store',
                keepalive: isIOS // Important for iOS background requests
            };

            // 3. Attempt fetch with offline detection
            let response;
            try {
                response = await fetch(apiUrl, fetchOptions);
                clearTimeout(timeout);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.warn('Request timeout');
                }
                throw error;
            }

            // 4. Handle successful response
            if (response.ok) {
                const data = await response.json();
                return data?.score ?? fallbackScore;
            }

            throw new Error(`HTTP ${response.status}`);
            
        } catch (error) {
            console.error('Scoring error:', {
                error: error.message,
                type: error.name,
                isIOS,
                onlineStatus: navigator.onLine,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });

            // 5. Special offline handling
            if (!navigator.onLine) {
                // Can implement offline storage here if needed
                return fallbackScore;
            }

            // 6. Final fallback for other errors
            return fallbackScore;
        }
    }

    startQuiz() {
        this.showQuestion();
    }

    showQuestion() {
        const questionContainer = document.getElementById("question");
        const optionsContainer = document.getElementById("options");
        const nextBtn = document.getElementById("next-btn");
        const charCounter = document.getElementById("char-counter");

        if (this.currentIndex >= totalQuestions) {
            // this.calculateScore();
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
                <textarea id="user-response" placeholder="Type your answer..." maxlength="150"></textarea>
            `;
            charCounter.textContent = `0/150 characters`;
            // Add input event listener for character counting
            const textarea = document.getElementById("user-response");
            textarea.addEventListener('input', (e) => {
                const currentLength = e.target.value.length;
                charCounter.textContent = `${currentLength}/150 characters`;
                
                // Change color when approaching limit
                if (currentLength >= 145) {
                    charCounter.style.color = currentLength === 150 ? '#d32f2f' : '#ff9800';
                } else {
                    charCounter.style.color = '#666';
                }
            });

            nextBtn.onclick = async () => {
                const userResponse = textarea.value.trim();
                if (!userResponse) {
                    alert("Please enter your response before proceeding.");
                    return;
                }
                
                nextBtn.disabled = true;
                nextBtn.textContent = "Scoring...";
                charCounter.innerText = ""
                
                try {
                    const score = await this.fetchScoreFromOpenAI(userResponse, question.expectations);
                        this.userAnswers.push(score);
                        this.quizResults.responses.push({
                            question: question.text,
                            userAnswer:userResponse,
                        })
                        this.currentIndex++;
                        this.showQuestion();
                    } finally {
                        nextBtn.textContent = this.currentIndex === this.questions.length - 1 
                            ? "Submit and See Results" 
                            : "Next";
                        nextBtn.disabled = false;
                }
                
            }
        } else if (question.type === "multiple-choice") {
            // Multiple choice question UI
            Object.entries(question.choices).forEach(([key, value]) => {
                const button = document.createElement("button");
                button.textContent = `${key}: ${value[0]}`;
                button.className = "option-button";
                button.onclick = () => {
                    // Remove active class from all buttons
                    document.querySelectorAll('.option-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    // Add active class to clicked button
                    button.classList.add('active');
                    this.currentSelectedAnswer = value[1];
                    nextBtn.disabled = false;
                };
                optionsContainer.appendChild(button);
            });

            nextBtn.onclick = () => {
                if (this.currentSelectedAnswer === null) {
                    alert("Please select an option before proceeding.");
                    return;
                }
                this.userAnswers.push(this.currentSelectedAnswer);
                this.quizResults.responses.push({
                    question: question.text,
                    userAnswer: Object.entries(question.choices).find(([_, v]) => v[1] === this.currentSelectedAnswer)[1][0]
                });
                this.currentIndex++;
                this.showQuestion();
            };

        }else if (question.type === "scale") {
            // Scale question UI
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
            valueDisplay.innerHTML = `
                Selected: 5 <span class="slider-instruction">(drag slider to change default)</span>`;
            
            slider.oninput = () => {
                valueDisplay.textContent = `Selected: ${slider.value}`;
                this.currentSelectedAnswer = parseInt(slider.value);
                nextBtn.disabled = false;
            };
            
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(valueDisplay);
            optionsContainer.appendChild(sliderContainer);
            
            // Add scale labels
            const scaleLabels = document.createElement("div");
            scaleLabels.className = "scale-labels";
            scaleLabels.innerHTML = `
                <span>0 (Very Low)</span>
                <span>${question.scale} (Very High)</span>
            `;
            optionsContainer.appendChild(scaleLabels);

            nextBtn.onclick = () => {
                const answer = this.currentSelectedAnswer || 5; // Default to 5 if not moved
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
        const progressPercentage = (this.currentIndex / totalQuestions) * 100;
        console.log(`Progress: ${progressPercentage}%`);
        progress.style.width = `${progressPercentage}%`;
        progressText.textContent = `Question ${this.currentIndex + 1} of ${totalQuestions}`;
        
        // Set next button text
        nextBtn.textContent = this.currentIndex === this.questions.length - 1 
            ? "Submit and See Results" 
            : "Next";
        //nextBtn.disabled = question.type !== "open-ended"; Disable for non-open-ended until selection
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    calculateScore() {
        //modify userAnswers array according to the calculation method
        const originalArray = [...this.userAnswers]
        const newArray = [...originalArray]

        // Apply transformations based on array[5]
        const base5 = originalArray[5] / 2
        newArray[6] = originalArray[6] - base5
        newArray[7] = originalArray[7] - base5
        newArray[8] = originalArray[8] - base5
        newArray[9] = originalArray[9] - base5

        // Apply transformations based on array[13]
        const base14 = originalArray[14] / 2
        newArray[15] = originalArray[15] - base14
        newArray[16] = originalArray[16] - base14
        newArray[17] = originalArray[17] - base14
        newArray[18] = originalArray[18] - base14
        newArray[19] = originalArray[19] - base14

        // Apply transformation based on array[22]
        const base27 = originalArray[27] / 2
        newArray[28] = originalArray[28] - base27

        console.log(newArray)

        const totalScore = newArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        const maxPossibleScore = 315
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