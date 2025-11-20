import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Box, Cpu, LineChart, Github, Twitter, ExternalLink, ArrowLeft, Sparkles, Zap, Activity, Hexagon, Terminal, Code, Search, Brain, Fingerprint, Eye, RefreshCw, Lock, Unlock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

// --- 注入全局样式与动画 ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');

  body {
    font-family: 'Inter', sans-serif;
    background-color: #050505;
    color: #e2e8f0;
  }
  
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .neon-text {
    text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
  }

  .grid-bg {
    background-size: 50px 50px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

// --- 样式组件 ---
const OptionButton = ({ children, onClick, delay }) => (
    <button
        onClick={onClick}
        className="group relative w-full text-left p-6 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden mb-4"
        style={{ animation: `fadeIn 0.5s ease-out ${delay}s backwards` }}
    >
        <div className="absolute inset-0 bg-violet-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
        <div className="relative z-10 flex justify-between items-center">
            <span className="text-lg text-slate-300 group-hover:text-white transition-colors font-light tracking-wide">
                {children}
            </span>
            <Zap size={18} className="text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0" />
        </div>
    </button>
);

// ==========================================
//  子项目 1: 赛博玄学 (组件)
// ==========================================
const CyberDivinationComponent = ({ onBack }) => {
    const [step, setStep] = useState('intro'); // intro, loading_questions, quiz, analyzing, result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);

    // 从环境变量获取 API Key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 生成8个动态问题
    const generateQuestions = async () => {
        setStep('loading_questions');

        const questionPrompt = `
    Role: 你是一个创造抽象情境的赛博朋克哲学家。
    Task: 生成8个深邃的、抽象的情境问题,用于探测人的性格和潜意识。
    Style: 结合赛博朋克、哲学、科幻元素,问题应该有想象力和深度。
    
    Requirements:
    - 每个问题有2个选项
    - 问题应该涵盖不同的心理维度
    - 语言风格要神秘、科幻、富有诗意
    - 选项应该代表不同的性格倾向
    
    Output Format (JSON ONLY):
    {
      "questions": [
        {
          "id": 1,
          "text": "问题文本",
          "options": [
            {"label": "选项A的完整描述", "value": "A"},
            {"label": "选项B的完整描述", "value": "B"}
          ]
        },
        // ... 共8个问题
      ]
    }
    `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: questionPrompt }] }]
                })
            });

            if (!response.ok) throw new Error('Failed to generate questions');

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResult = JSON.parse(cleanText);

            setQuestions(jsonResult.questions);
            setStep('quiz');

        } catch (err) {
            console.error("Question Generation Error:", err);
            // 降级方案: 使用预设问题
            const fallbackQuestions = [
                {
                    id: 1,
                    text: "你独自站在无尽的数据荒原中,眼前出现了两道门。",
                    options: [
                        { label: "发光的金色大门,传来嘈杂的欢呼声", value: "A" },
                        { label: "幽静的银色窄门,只有水流的声音", value: "B" },
                    ]
                },
                {
                    id: 2,
                    text: "天空突然裂开,巨大的几何体降临,你的第一反应是?",
                    options: [
                        { label: "分析它的结构、材质和物理法则", value: "A" },
                        { label: "感受它带来的压迫感,思考它是吉兆还是凶兆", value: "B" },
                    ]
                },
                {
                    id: 3,
                    text: "如果要你重写世界的底层代码,你会遵循什么原则?",
                    options: [
                        { label: "绝对的逻辑,消除所有错误和混沌", value: "A" },
                        { label: "极致的和谐,让万物在爱中共生", value: "B" },
                    ]
                },
                {
                    id: 4,
                    text: "旅途即将结束,面对未知的时间线,你通常会...",
                    options: [
                        { label: "制定详细的跃迁计划,按部就班", value: "A" },
                        { label: "随遇而安,相信直觉会指引方向", value: "B" },
                    ]
                },
                {
                    id: 5,
                    text: "在虚拟与现实的边界,你更倾向于相信什么?",
                    options: [
                        { label: "可验证的数据和逻辑推理", value: "A" },
                        { label: "直觉和内心的感知", value: "B" },
                    ]
                },
                {
                    id: 6,
                    text: "面对一个即将崩溃的系统,你会如何选择?",
                    options: [
                        { label: "冷静分析,寻找最优解决方案", value: "A" },
                        { label: "关注受影响的人,优先保护弱者", value: "B" },
                    ]
                },
                {
                    id: 7,
                    text: "在信息的洪流中,你如何定义自己?",
                    options: [
                        { label: "通过理性构建的身份框架", value: "A" },
                        { label: "通过情感和关系网络", value: "B" },
                    ]
                },
                {
                    id: 8,
                    text: "当面临未知的选择时,你更依赖什么?",
                    options: [
                        { label: "已有的经验和计划", value: "A" },
                        { label: "即兴应变和灵活调整", value: "B" },
                    ]
                }
            ];
            setQuestions(fallbackQuestions);
            setStep('quiz');
        }
    };

    // 调用 Gemini API 进行分析
    const analyzeSoul = async (userAnswers) => {
        setStep('analyzing');

        const answerSummary = questions.map((q, idx) =>
            `Q${idx + 1}: ${q.text}\n答案: ${userAnswers[idx].label}`
        ).join('\n\n');

        const systemPrompt = `
    Role: 你是一个来自赛博朋克未来的"灵魂架构师"。
    Task: 基于用户对8个抽象情境的选择,深度分析其性格特质。
    Input Data: 
    ${answerSummary}

    Output Format (JSON ONLY):
    {
      "mbti": "用户的MBTI类型 (如 INTJ)",
      "archetype": "性格原型名称 (4个字,酷炫、玄学,如'虚空行者')",
      "energy_color": "代表色 (Hex code, 如 #8b5cf6)",
      "analysis": "一段不超过100字的性格判词。语言风格结合《易经》的深邃和《黑客帝国》的冷峻。",
      "keyword": "核心频率词 (2字)",
      "strength": "核心优势 (4字)"
    }
    `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }]
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            // 清洗 JSON
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResult = JSON.parse(cleanText);

            setResult(jsonResult);
            setStep('result');

        } catch (err) {
            console.error("AI Connection Error:", err);
            // 降级方案
            const fallbackResult = {
                mbti: "UNKNOWN",
                archetype: "数字游魂",
                energy_color: "#64748b",
                analysis: "与主网的连接暂时中断。这也许是命运的暗示:你的灵魂过于独特,无法被常规算法解析。请检查密钥或稍后重试。",
                keyword: "隐匿",
                strength: "不可观测"
            };
            setResult(fallbackResult);
            setStep('result');
        }
    };

    const handleOptionSelect = (option) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => setCurrentQuestion(prev => prev + 1), 400);
        } else {
            analyzeSoul(newAnswers);
        }
    };

    const reset = () => {
        setStep('intro');
        setCurrentQuestion(0);
        setQuestions([]);
        setAnswers([]);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 p-6 font-mono relative overflow-hidden flex flex-col">
            {/* 背景特效 */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-900/10 via-transparent to-black/80"></div>
            </div>

            {/* 顶部导航 */}
            <nav className="relative z-50 flex justify-between items-center mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors group px-4 py-2 rounded-full border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/10">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="tracking-widest uppercase text-xs">Abort Mission</span>
                </button>
                <div className="flex items-center gap-2 text-[10px] text-violet-400 uppercase tracking-widest border border-violet-500/20 px-3 py-1 rounded-full bg-violet-500/5">
                    <Activity size={12} className="animate-pulse" />
                    System Status: Active
                </div>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full">

                {/* 1. 欢迎界面 */}
                {step === 'intro' && (
                    <div className="text-center animate-fade-in">
                        <div className="relative inline-flex items-center justify-center mb-12 group">
                            <div className="absolute inset-0 bg-violet-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <Hexagon size={100} strokeWidth={0.5} className="text-violet-500/50 animate-[spin_10s_linear_infinite]" />
                            <Hexagon size={100} strokeWidth={0.5} className="text-cyan-500/50 absolute inset-0 animate-[spin_15s_linear_infinite_reverse]" />
                            <Eye size={32} className="text-white absolute z-10" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tighter" style={{ textShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}>
                            CYBER<span className="text-violet-500">SOUL</span>
                        </h1>

                        <p className="text-slate-400 mb-12 max-w-md mx-auto text-sm md:text-base leading-relaxed border-l border-violet-500/30 pl-6">
                            链接 Gemini 认知引擎。<br />
                            解析潜意识代码,重构你的精神图腾。
                        </p>

                        <button
                            onClick={generateQuestions}
                            className="group relative px-10 py-4 bg-white text-black font-bold tracking-[0.2em] uppercase text-sm overflow-hidden hover:bg-cyan-400 transition-colors duration-300"
                        >
                            Initialize
                            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </button>
                    </div>
                )}

                {/* 1.5 生成问题中 */}
                {step === 'loading_questions' && (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-2 border-t-cyan-500 border-r-transparent border-b-violet-500 border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-2 border-t-transparent border-r-white/20 border-b-transparent border-l-white/20 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                            <Sparkles className="absolute inset-0 m-auto text-white animate-pulse" size={32} />
                        </div>
                        <div className="font-mono text-xs text-cyan-400 space-y-2">
                            <p className="animate-pulse">INITIALIZING_AI_CORE...</p>
                            <p>GENERATING_QUANTUM_SCENARIOS...</p>
                            <p>CALIBRATING_PERCEPTION_MATRIX...</p>
                        </div>
                    </div>
                )}

                {/* 2. 答题界面 */}
                {step === 'quiz' && questions.length > 0 && (
                    <div className="w-full max-w-2xl animate-fade-in">
                        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                            <span className="text-4xl font-light text-white/20">0{currentQuestion + 1}</span>
                            <span className="text-xs text-violet-400 font-mono">{currentQuestion + 1} / {questions.length}</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-light text-white mb-12 leading-snug min-h-[100px]">
                            {questions[currentQuestion].text}
                        </h2>

                        <div className="grid gap-2">
                            {questions[currentQuestion].options.map((option, idx) => (
                                <OptionButton key={idx} onClick={() => handleOptionSelect(option)} delay={idx * 0.1}>
                                    {option.label}
                                </OptionButton>
                            ))}
                        </div>

                        {/* 进度条 */}
                        <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500 ease-out"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* 3. 分析中界面 */}
                {step === 'analyzing' && (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-2 border-t-violet-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-2 border-t-transparent border-r-white/20 border-b-transparent border-l-white/20 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                            <Brain className="absolute inset-0 m-auto text-white animate-pulse" size={32} />
                        </div>
                        <div className="font-mono text-xs text-cyan-400 space-y-2">
                            <p className="animate-pulse">UPLOADING_CONSCIOUSNESS...</p>
                            <p>ACCESSING_GEMINI_CORE...</p>
                            <p>DECODING_SOUL_SIGNATURE...</p>
                        </div>
                    </div>
                )}

                {/* 4. 结果界面 */}
                {step === 'result' && result && (
                    <div className="w-full max-w-4xl animate-fade-in">
                        <div className="grid md:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">

                            {/* 左侧:视觉核心 */}
                            <div className="md:col-span-2 bg-black/40 p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10">
                                <div
                                    className="absolute inset-0 opacity-20 mix-blend-screen"
                                    style={{ background: `radial-gradient(circle at center, ${result.energy_color}, transparent 70%)` }}
                                ></div>

                                <div className="relative z-10 text-center">
                                    <Hexagon size={120} className="text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]" />
                                    <div className="text-6xl font-black tracking-tighter text-white mb-4 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                        {result.mbti}
                                    </div>
                                    <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] tracking-[0.2em] text-white uppercase mb-6 bg-white/5">
                                        {result.archetype}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full text-center">
                                        <div className="p-2 bg-white/5 rounded">
                                            <div className="text-[10px] text-slate-500 uppercase mb-1">Energy</div>
                                            <div className="w-4 h-4 rounded-full mx-auto shadow-[0_0_10px]" style={{ background: result.energy_color, boxShadow: `0 0 10px ${result.energy_color}` }}></div>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded">
                                            <div className="text-[10px] text-slate-500 uppercase mb-1">Signal</div>
                                            <div className="text-xs font-bold text-white">{result.keyword}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 右侧:文字分析 */}
                            <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center relative">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Fingerprint size={64} />
                                </div>

                                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                                    Analysis Complete
                                </h3>

                                <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed mb-8">
                                    "{result.analysis}"
                                </p>

                                <div className="mt-auto border-t border-white/10 pt-6 flex justify-between items-center">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase">Core Strength</div>
                                        <div className="text-sm font-bold text-white tracking-wide">{result.strength}</div>
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                                        title="Restart Protocol"
                                    >
                                        <RefreshCw size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
//  子项目 2: Alpha Seeker (组件)
// ==========================================
// ==========================================
//  子项目 2: Alpha Seeker (组件)
// ==========================================

// --- 组件: 情绪仪表盘 ---
const SentimentGauge = ({ score }) => {
    const rotation = (score / 100) * 180 - 90;

    let color = "#3b82f6";
    if (score > 66) color = "#22c55e";
    if (score < 33) color = "#ef4444";

    return (
        <div className="relative w-48 h-24 overflow-hidden mx-auto mt-4">
            <div className="absolute w-48 h-48 rounded-full border-[12px] border-slate-800 box-border top-0 left-0"></div>
            <div className="absolute w-44 h-44 rounded-full border border-slate-700 border-dashed top-2 left-2 opacity-50"></div>

            <div
                className="absolute bottom-0 left-1/2 w-1 h-24 bg-white origin-bottom transition-transform duration-1000 ease-out z-10"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            >
                <div className="w-4 h-4 bg-white rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-[0_0_10px_white]"></div>
            </div>

            <div className="absolute bottom-0 w-full text-center text-xs font-mono font-bold tracking-widest" style={{ color }}>
                SCORE: {score}
            </div>
        </div>
    );
};

const StockAIComponent = ({ onBack }) => {
    const [selectedTicker, setSelectedTicker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [data, setData] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 分析股票
    const analyzeStock = async (ticker) => {
        setLoading(true);
        setSelectedTicker(ticker);
        setTerminalLogs([]);
        setData(null);
        setError(null);

        const logs = [
            "> Initializing secure connection to NASDAQ...",
            "> Handshaking with institutional node...",
            `> Fetching $${ticker} earnings call audio stream...`,
            "> Decrypting transcript...",
            "> Running FinBERT-Tone model...",
            "> Extracting non-verbal cues (Micro-tremors detected)...",
            "> Compiling alpha_report.json..."
        ];

        let delay = 0;
        logs.forEach((log, index) => {
            delay += Math.random() * 500 + 300;
            setTimeout(() => {
                setTerminalLogs(prev => [...prev, log]);
            }, delay);
        });

        const systemPrompt = `
    Role: You are a quantitative analyst specializing in sentiment analysis of earnings calls.
    Task: Analyze the latest earnings call for ${ticker} and provide detailed insights.
    
    Requirements:
    - Estimate current stock price if you don't know the exact value
    - Create realistic-sounding CEO remarks simulating an earnings call
    - Include both bullish and bearish perspectives
    - Use financial terminology appropriately
    
    Output Format (JSON ONLY):
    {
      "name": "Full company name",
      "price": "Stock price as string (e.g., '148.50')",
      "change": "Daily change percentage (e.g., '+4.2%' or '-1.5%')",
      "sentiment": 75,
      "keywords": ["Keyword1", "Keyword2", "Keyword3"],
      "transcript_snippet": "A realistic 150-word excerpt simulating CEO remarks from an earnings call. Include specific metrics, product names, and forward-looking statements. Make it sound authentic with CEO language patterns.",
      "ai_analysis": [
        {"type": "bull", "text": "First bullish point with specific reasoning"},
        {"type": "bull", "text": "Second bullish point"},
        {"type": "bear", "text": "First bearish point with concerns"},
        {"type": "bear", "text": "Second bearish point"}
      ]
    }
    `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }]
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResult = JSON.parse(cleanText);

            setTimeout(() => {
                setLoading(false);
                setData(jsonResult);
            }, delay + 500);

        } catch (err) {
            console.error("Analysis Error:", err);
            setTimeout(() => {
                setLoading(false);
                setError(`Failed to analyze ${ticker}. This could be an invalid ticker or API issue. Please try again.`);
            }, delay + 500);
        }
    };

    const handleSearch = (ticker) => {
        if (!ticker || ticker.trim().length === 0) return;
        analyzeStock(ticker.toUpperCase().trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(inputValue);
        }
    };

    const reset = () => {
        setSelectedTicker(null);
        setData(null);
        setError(null);
        setInputValue('');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-green-500 p-4 md:p-6 font-mono relative overflow-hidden flex flex-col">

            {/* 背景装饰 */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                <div className="absolute top-0 left-0 w-full h-32 bg-green-900/10 blur-3xl"></div>
            </div>

            {/* 顶部导航 */}
            <header className="relative z-20 flex justify-between items-center mb-8 border-b border-green-900/30 pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="hover:text-white hover:bg-green-900/30 p-2 rounded transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
                            <Terminal size={20} />
                            ALPHA_SEEKER
                        </h1>
                        <span className="text-[10px] text-green-700 uppercase tracking-[0.2em]">Ver 0.9.2 [Beta]</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-green-800">
                    <div className="flex items-center gap-2">
                        <Lock size={12} />
                        <span>GEMINI CORE</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </header>

            {/* 主要内容区域 */}
            <main className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col">

                {/* 1. 搜索界面 */}
                {!data && !loading && !error && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-full max-w-2xl border border-green-800/50 bg-black/50 p-8 rounded-xl shadow-[0_0_50px_rgba(0,255,0,0.05)] backdrop-blur-sm">
                            <label className="block text-xs text-green-700 mb-2 uppercase tracking-widest">Target Asset</label>
                            <div className="relative mb-8 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 group-focus-within:text-green-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="ENTER TICKER (e.g. NVDA, AAPL, TSLA)"
                                    className="w-full bg-black border border-green-800 rounded-lg py-4 pl-12 pr-4 text-xl text-green-400 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(0,255,0,0.2)] transition-all placeholder-green-900 uppercase"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-green-900/20 border border-green-800 rounded text-xs text-green-600">
                                    ENTER
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {['NVDA', 'AAPL', 'TSLA'].map(ticker => (
                                    <button
                                        key={ticker}
                                        onClick={() => handleSearch(ticker)}
                                        className="flex items-center justify-between p-4 border border-green-900/30 hover:border-green-500 hover:bg-green-500/10 rounded transition-all group"
                                    >
                                        <span className="font-bold">{ticker}</span>
                                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="mt-8 text-xs text-green-800 max-w-md text-center">
                            WARNING: AI-generated analysis for educational purposes only.<br />
                            Not financial advice. Use at your own risk.
                        </p>
                    </div>
                )}

                {/* 2. 加载终端特效 */}
                {loading && (
                    <div className="flex-1 flex flex-col justify-end pb-20 max-w-2xl mx-auto w-full font-mono text-sm">
                        <div className="border-l-2 border-green-800 pl-4 space-y-2">
                            {terminalLogs.map((log, idx) => (
                                <div key={idx} className="animate-fade-in">
                                    <span className="text-green-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="text-green-400">{log}</span>
                                </div>
                            ))}
                            <div className="animate-pulse text-green-500">_</div>
                        </div>
                    </div>
                )}

                {/* 2.5 错误界面 */}
                {error && !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="border border-red-800/50 bg-black/50 p-8 rounded-xl max-w-md text-center">
                            <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
                            <p className="text-red-400 mb-6">{error}</p>
                            <button
                                onClick={reset}
                                className="px-6 py-3 border border-green-700 text-green-500 hover:bg-green-500 hover:text-black transition-all uppercase text-xs font-bold tracking-widest rounded"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. 数据仪表盘 */}
                {data && !loading && (
                    <div className="animate-fade-in space-y-6 h-full flex flex-col">

                        <div className="grid md:grid-cols-2 gap-6 shrink-0">
                            <div className="border border-green-800/50 bg-black/40 p-6 rounded-xl flex justify-between items-center backdrop-blur-sm">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl font-bold text-green-400">${data.price}</span>
                                        <span className={`px-2 py-1 rounded text-sm font-bold ${data.change.startsWith('+') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {data.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-green-700 uppercase mb-1">Sentiment</div>
                                    <SentimentGauge score={data.sentiment} />
                                </div>
                            </div>

                            <div className="border border-green-800/50 bg-black/40 p-6 rounded-xl backdrop-blur-sm flex flex-col justify-center">
                                <h3 className="text-xs text-green-700 uppercase mb-4 flex items-center gap-2">
                                    <Cpu size={14} /> Detected Signals
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.keywords.map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-300">
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 grow min-h-0">

                            <div className="md:col-span-2 border border-green-800/50 bg-black/40 rounded-xl p-6 backdrop-blur-sm relative flex flex-col overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Activity size={48} />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 border-b border-green-900/50 pb-2 shrink-0">
                                    <Zap size={16} className="text-yellow-400" />
                                    EARNINGS CALL EXCERPT
                                </h3>

                                <div className="font-mono text-lg leading-relaxed text-green-100/80 overflow-y-auto custom-scrollbar pr-2 grow">
                                    <span className="text-green-700 text-sm block mb-2 sticky top-0 bg-black/80 backdrop-blur-md py-1">// AI-Generated Transcript:</span>
                                    "
                                    {data.transcript_snippet.split(' ').map((word, i) => {
                                        const isHighlight = word.length > 7 || ['growth', 'revenue', 'profit', 'innovation', 'demand', 'strong', 'bullish'].some(kw => word.toLowerCase().includes(kw));
                                        return (
                                            <span key={i} className={isHighlight ? "bg-green-500/20 text-white px-1 rounded mx-0.5" : "mx-0.5"}>
                                                {word}{' '}
                                            </span>
                                        )
                                    })}
                                    "
                                </div>

                                <div className="mt-6 flex gap-4 text-xs text-green-600 bg-green-900/10 p-3 rounded shrink-0">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500/50 rounded"></div> Highlighted: High Conviction</div>
                                    <div className="flex items-center gap-1"><AlertTriangle size={10} /> AI-Generated Content</div>
                                </div>
                            </div>

                            <div className="border border-green-800/50 bg-black/40 rounded-xl p-6 backdrop-blur-sm flex flex-col overflow-hidden">
                                <h3 className="text-sm font-bold text-white mb-4 border-b border-green-900/50 pb-2 shrink-0">
                                    AI ANALYST NOTES
                                </h3>

                                <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                                    {data.ai_analysis.map((item, idx) => (
                                        <div key={idx} className={`p-3 rounded border ${item.type === 'bull' ? 'border-green-900/50 bg-green-900/10' : 'border-red-900/50 bg-red-900/10'}`}>
                                            <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${item.type === 'bull' ? 'text-green-400' : 'text-red-400'}`}>
                                                {item.type === 'bull' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {item.type === 'bull' ? 'BULL CASE' : 'BEAR CASE'}
                                            </div>
                                            <p className="text-sm text-slate-300 leading-tight">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={reset}
                                    className="mt-4 w-full py-3 border border-green-700 text-green-500 hover:bg-green-500 hover:text-black transition-all uppercase text-xs font-bold tracking-widest rounded shrink-0"
                                >
                                    NEW SEARCH
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </main>

            <footer className="mt-8 pt-4 border-t border-green-900/30 flex justify-between text-[10px] text-green-800 uppercase tracking-widest relative z-20">
                <div>System: Online</div>
                <div>Powered by: Gemini AI</div>
                <div>Model: FinBERT-Tone</div>
            </footer>

        </div>
    );
};


// ==========================================
//  主网站 (母基金页面 - 升级版)
// ==========================================

export default function PortfolioApp() {
    const [currentView, setCurrentView] = useState('home');

    if (currentView === 'project1') return <CyberDivinationComponent onBack={() => setCurrentView('home')} />;
    if (currentView === 'project2') return <StockAIComponent onBack={() => setCurrentView('home')} />;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
            <style>{globalStyles}</style>

            {/* 背景网格特效 */}
            <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>
            <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-[#050505]/80 backdrop-blur-md z-50 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tighter flex items-center gap-2 text-white">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded flex items-center justify-center">
                            <span className="font-mono text-xs">AI</span>
                        </div>
                        <span>LAB_</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-xs font-mono text-slate-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-cyan-400 transition-colors">About</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Alpha Notes</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-40 pb-20 px-6 max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-8">
                            <Cpu size={12} />
                            Fund Manager x AI Engineer
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
                            REDEFINING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 animate-pulse">
                                VALUE
                            </span> WITH <br />
                            INTELLIGENCE.
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-light border-l border-slate-800 pl-6">
                            我是<span className="text-slate-200 font-medium">混合策略基金经理</span>。这里是我的数字实验室,我利用 AI 重构对市场的认知,将金融逻辑编译为可执行的代码。
                        </p>
                    </div>

                    {/* 右侧的数据面板装饰 */}
                    <div className="hidden md:block glass-card p-6 rounded-xl w-72 animate-[float_6s_ease-in-out_infinite]">
                        <div className="flex justify-between text-xs text-slate-500 font-mono mb-4 border-b border-white/10 pb-2">
                            <span>MARKET_SENTIMENT</span>
                            <span className="text-green-400">BULLISH</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-white">NAS100</span>
                                <span className="text-xs font-mono text-green-400">+1.24%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[70%]"></div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-bold text-white">HSI</span>
                                <span className="text-xs font-mono text-red-400">-0.45%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[40%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Projects Grid */}
            <section className="py-20 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-gradient-to-r from-cyan-500 to-transparent w-16"></div>
                        <h2 className="text-xl font-mono text-cyan-400 uppercase tracking-widest">
                            Deployed Protocols
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Project Card 1: Cyber Divination */}
                        <div
                            onClick={() => setCurrentView('project1')}
                            className="group glass-card rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-500 cursor-pointer relative"
                        >
                            {/* 悬停时的光效 */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="p-8 relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform">
                                        <Hexagon size={24} className="text-violet-400" />
                                    </div>
                                    <span className="font-mono text-xs text-slate-500 border border-slate-800 px-2 py-1 rounded">v2.0.1</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Cyber Soul Observer</h3>
                                <p className="text-sm font-mono text-violet-400/80 mb-4">React / Gemini API / Canvas</p>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    一个反传统的性格分析实验。结合道家哲学与赛博朋克美学,通过抽象情境模拟解析潜意识数据。
                                </p>

                                <div className="flex items-center text-xs font-bold text-white uppercase tracking-wider">
                                    Execute <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform text-violet-400" />
                                </div>
                            </div>
                        </div>

                        {/* Project Card 2: Stock AI */}
                        <div
                            onClick={() => setCurrentView('project2')}
                            className="group glass-card rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-500 cursor-pointer relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="p-8 relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform">
                                        <LineChart size={24} className="text-green-400" />
                                    </div>
                                    <span className="font-mono text-xs text-green-500/50 border border-green-900/50 px-2 py-1 rounded animate-pulse">DEV</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Alpha Seeker</h3>
                                <p className="text-sm font-mono text-green-400/80 mb-4">Python / LLM / Data Analysis</p>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    针对美股与港股科技板块的自动财报分析工具。利用 LLM 提取财报电话会情绪,捕捉 Alpha 信号。
                                </p>

                                <div className="flex items-center text-xs font-bold text-white uppercase tracking-wider">
                                    Access Protocol <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform text-green-400" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center relative z-10">
                <div className="flex items-center justify-center gap-6 mb-8">
                    <a href="https://x.com/awodias" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all"><Twitter size={18} /></a>
                    <a href="https://github.com/jacksu4" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all"><Github size={18} /></a>
                </div>
                <p className="text-slate-600 text-xs font-mono">
                    © 2025 AI LAB. SYSTEM_OPTIMIZED.
                </p>
            </footer>

        </div>
    );
}
