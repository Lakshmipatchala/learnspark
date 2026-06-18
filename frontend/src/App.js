import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const API = "https://learnspark-backend-u8px.onrender.com";

const supabase = createClient(
  "https://rtbttuuzaioustbugkkq.supabase.co",
	"sb_publishable_JnVNtHN3Ysr5JVZozC9-SQ_cjKjioR-",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);const GRADES = ["PreK","Kindergarten","1st Grade","2nd Grade","3rd Grade","4th Grade","5th Grade","6th Grade","7th Grade","8th Grade","9th Grade","10th Grade","11th Grade","12th Grade"];
const SUBJECTS = {
  Math: ["Numbers & Counting","Addition & Subtraction","Multiplication & Division","Fractions","Decimals","Algebra Basics","Geometry","Statistics"],
  English: ["Alphabet & Phonics","Sight Words","Reading Comprehension","Grammar","Writing Skills","Vocabulary","Poetry","Essay Writing"],
  Science: ["Plants & Animals","Human Body","Weather & Seasons","Solar System","Forces & Motion","Chemistry Basics","Biology","Physics"],
  "Social Studies": ["My Community","Maps & Geography","US History","World Cultures","Government & Civics","Economics Basics"],
};
const COLORS = {
  Math: { bg: "#FFF7ED", accent: "#EA580C", light: "#FED7AA" },
  English: { bg: "#F0FDF4", accent: "#16A34A", light: "#BBF7D0" },
  Science: { bg: "#EFF6FF", accent: "#2563EB", light: "#BFDBFE" },
  "Social Studies": { bg: "#FDF4FF", accent: "#9333EA", light: "#E9D5FF" },
};
const ICONS = { Math: "🔢", English: "📚", Science: "🔬", "Social Studies": "🌍" };

function Spinner({ text = "Loading..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 0" }}>
      <div style={{ width: 48, height: 48, border: "4px solid #E5E7EB", borderTop: "4px solid #6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#6B7280", fontSize: 14 }}>{text}</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ProgressBar({ value, max, color = "#6366F1" }) {
  return (
    <div style={{ background: "#E5E7EB", borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 99, background: color, width: `${Math.round((value / max) * 100)}%`, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;
        setMessage("Account created! You can now log in.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>LearnSpark AI</h1>
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>AI-powered learning for every child</p>
      </div>
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E5E7EB" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>
          {mode === "login" ? "Welcome back!" : "Create account"}
        </h2>
        {error && <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        {message && <div style={{ background: "#F0FDF4", color: "#15803D", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{message}</div>}
        {mode === "signup" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={inputStyle} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={inputStyle} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", margin: 0 }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ color: "#6366F1", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Sign up free" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── PARENT DASHBOARD ──────────────────────────────────────
function DashboardScreen({ user, progress, onStartLesson, onLogout }) {
  const totalLessons = progress.length;
  const avgScore = totalLessons > 0 ? Math.round(progress.reduce((a, b) => a + b.score, 0) / totalLessons) : 0;
  const subjects = [...new Set(progress.map(p => p.subject))];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>Welcome back! 👋</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{user.email}</p>
        </div>
        <button onClick={onLogout} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: "white", color: "#374151", fontSize: 13, cursor: "pointer" }}>Log out</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Lessons completed", value: totalLessons, emoji: "📚" },
          { label: "Average quiz score", value: `${avgScore}%`, emoji: "🎯" },
          { label: "Subjects explored", value: subjects.length, emoji: "🌟" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Start new lesson */}
      <button onClick={onStartLesson} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", marginBottom: 24 }}>
        Start New Lesson ✨
      </button>

      {/* Recent activity */}
      {progress.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {progress.slice(0, 5).map((p, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{p.topic}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{p.grade} · {p.subject}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: p.score >= 80 ? "#16A34A" : p.score >= 60 ? "#D97706" : "#DC2626" }}>{p.score}%</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>quiz score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {progress.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "#6B7280" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎒</div>
          <p style={{ margin: 0 }}>No lessons yet — start your first one above!</p>
        </div>
      )}
    </div>
  );
}

// ── SETUP SCREEN ──────────────────────────────────────────
function SetupScreen({ onStart, onBack }) {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const canStart = grade && subject && topic;
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px" }}>
      <button onClick={onBack} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#374151", fontSize: 13, marginBottom: 24 }}>← Dashboard</button>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📖</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Choose your lesson</h2>
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Select a grade, subject, and topic to begin</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 8, fontSize: 14 }}>Select Grade</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {GRADES.map(g => <button key={g} onClick={() => setGrade(g)} style={{ padding: "8px 4px", borderRadius: 10, border: "2px solid", borderColor: grade === g ? "#6366F1" : "#E5E7EB", background: grade === g ? "#EEF2FF" : "white", color: grade === g ? "#4338CA" : "#374151", fontSize: 12, fontWeight: grade === g ? 600 : 400, cursor: "pointer" }}>{g}</button>)}
          </div>
        </div>
        {grade && (
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 8, fontSize: 14 }}>Choose Subject</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.keys(SUBJECTS).map(subj => {
                const c = COLORS[subj]; const selected = subject === subj;
                return <button key={subj} onClick={() => { setSubject(subj); setTopic(""); }} style={{ padding: "14px 16px", borderRadius: 12, border: "2px solid", borderColor: selected ? c.accent : "#E5E7EB", background: selected ? c.bg : "white", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{ICONS[subj]}</div>
                  <div style={{ fontWeight: 600, color: selected ? c.accent : "#374151", fontSize: 14 }}>{subj}</div>
                </button>;
              })}
            </div>
          </div>
        )}
        {subject && (
          <div>
            <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 8, fontSize: 14 }}>Pick a Topic</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUBJECTS[subject].map(t => { const c = COLORS[subject]; const selected = topic === t; return <button key={t} onClick={() => setTopic(t)} style={{ padding: "8px 14px", borderRadius: 99, border: "2px solid", borderColor: selected ? c.accent : "#E5E7EB", background: selected ? c.bg : "white", color: selected ? c.accent : "#374151", fontWeight: selected ? 600 : 400, fontSize: 13, cursor: "pointer" }}>{t}</button>; })}
            </div>
          </div>
        )}
        <button disabled={!canStart} onClick={() => onStart({ grade, subject, topic })} style={{ padding: "16px", borderRadius: 14, border: "none", background: canStart ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "#E5E7EB", color: canStart ? "white" : "#9CA3AF", fontSize: 16, fontWeight: 700, cursor: canStart ? "pointer" : "not-allowed", marginTop: 8, boxShadow: canStart ? "0 4px 20px rgba(99,102,241,0.35)" : "none" }}>
          {canStart ? `Start Lesson: ${topic} ✨` : "Select grade, subject & topic to begin"}
        </button>
      </div>
    </div>
  );
}

// ── LESSON SCREEN ─────────────────────────────────────────
function LessonScreen({ config, lesson, onTakeQuiz, onBack }) {
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [videoSegments, setVideoSegments] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateVideo = async () => {
    setVideoLoading(true);
    try {
      const res = await fetch(`${API}/generate-video-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: config.grade, subject: config.subject, topic: config.topic, lesson })
      });
      const data = await res.json();
      setVideoSegments(data.segments);
      setShowVideo(true);
      setCurrentSegment(0);
    } catch {
      alert("Could not generate video. Try again!");
    }
    setVideoLoading(false);
  };

const playSegment = (index) => {
  if (!videoSegments || index >= videoSegments.length) {
    setIsPlaying(false);
    return;
  }
  const seg = videoSegments[index];
  if (!seg.audio_base64) {
    playSegment(index + 1);
    return;
  }
  const audio = new Audio(`data:audio/mp3;base64,${seg.audio_base64}`);
  setCurrentSegment(index);
  setIsPlaying(true);
  audio.play();
  audio.onended = () => playSegment(index + 1);
};
  const c = COLORS[config.subject];
  const askQuestion = async () => {
    if (!question.trim()) return; setAsking(true);
    try {
      const res = await fetch(`${API}/ask-question`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grade: config.grade, subject: config.subject, topic: config.topic, question, lesson_content: lesson.summary }) });
      const data = await res.json(); setAnswer(data.answer);
    } catch { setAnswer("Sorry, couldn't get an answer. Try again!"); }
    setAsking(false);
  };
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#374151", fontSize: 13 }}>← Back</button>
        <div style={{ padding: "4px 12px", borderRadius: 99, background: c.bg, color: c.accent, fontWeight: 600, fontSize: 13 }}>{config.grade} · {config.subject}</div>
      </div>
      <div style={{ background: c.bg, borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${c.light}` }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{lesson.emoji}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{lesson.title}</h2>
	
        <p style={{ color: "#4B5563", margin: 0, lineHeight: 1.6 }}>{lesson.introduction}</p>
      </div>
	{!showVideo && (
  <button onClick={generateVideo} disabled={videoLoading} style={{
    width: "100%", padding: "14px", borderRadius: 14, border: "none",
    background: "linear-gradient(135deg,#F59E0B,#EF4444)", color: "white",
    fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20,
    boxShadow: "0 4px 20px rgba(239,68,68,0.3)"
  }}>
    {videoLoading ? "🎬 Creating your video..." : "🎬 Watch AI Video Lesson"}
  </button>
)}

{showVideo && videoSegments && (
  <div style={{
    background: "#111827", borderRadius: 16, padding: 24, marginBottom: 24,
    minHeight: 280, display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", position: "relative"
  }}>
    <div style={{ textAlign: "center", color: "white" }}>
      {videoSegments[currentSegment]?.type === "intro" && (
        <>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{videoSegments[currentSegment].emoji}</div>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>{videoSegments[currentSegment].title}</h2>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 480 }}>{videoSegments[currentSegment].text}</p>
        </>
      )}
      {videoSegments[currentSegment]?.type === "section" && (
        <>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📘</div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>{videoSegments[currentSegment].heading}</h3>
          <p style={{ fontSize: 15, opacity: 0.9, maxWidth: 480 }}>{videoSegments[currentSegment].text}</p>
        </>
      )}
      {videoSegments[currentSegment]?.type === "fun_fact" && (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <h3 style={{ fontSize: 20, marginBottom: 10 }}>Fun Fact!</h3>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 480 }}>{videoSegments[currentSegment].text}</p>
        </>
      )}
      {videoSegments[currentSegment]?.type === "summary" && (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <h3 style={{ fontSize: 20, marginBottom: 10 }}>Summary</h3>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 480 }}>{videoSegments[currentSegment].text}</p>
        </>
      )}
    </div>

    <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
      {videoSegments.map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: i === currentSegment ? "#F59E0B" : "rgba(255,255,255,0.3)"
        }} />
      ))}
    </div>

    {!isPlaying ? (
      <button onClick={() => playSegment(0)} style={{
        marginTop: 20, padding: "10px 24px", borderRadius: 99, border: "none",
        background: "#F59E0B", color: "white", fontWeight: 700, cursor: "pointer"
      }}>▶ Play Video Lesson</button>
    ) : (
      <p style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>🔊 Playing...</p>
    )}
  </div>
)}
      {lesson.sections.map((sec, i) => (
        <div key={i} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, marginBottom: 14 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>{sec.heading}</h3>
          <p style={{ color: "#374151", lineHeight: 1.7, margin: "0 0 12px" }}>{sec.content}</p>
          <div style={{ background: "#F9FAFB", borderLeft: `4px solid ${c.accent}`, borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: c.accent }}>EXAMPLE  </span>
            <span style={{ fontSize: 14, color: "#4B5563" }}>{sec.example}</span>
          </div>
        </div>
      ))}
      <div style={{ background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", borderRadius: 14, padding: 18, marginBottom: 20, border: "1px solid #FCD34D" }}>
        <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 6 }}>⭐ Fun Fact!</div>
        <p style={{ color: "#78350F", margin: 0, lineHeight: 1.6 }}>{lesson.fun_fact}</p>
      </div>
      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 14, padding: 18, marginBottom: 24, border: "1px solid #C7D2FE" }}>
        <div style={{ fontWeight: 700, color: "#3730A3", marginBottom: 6 }}>📝 Summary</div>
        <p style={{ color: "#312E81", margin: 0, lineHeight: 1.6 }}>{lesson.summary}</p>
      </div>
      <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>🙋 Have a question?</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && askQuestion()} placeholder="Ask anything about this lesson..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none" }} />
          <button onClick={askQuestion} disabled={asking || !question.trim()} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: c.accent, color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{asking ? "..." : "Ask"}</button>
        </div>
        {answer && <div style={{ marginTop: 12, background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", color: "#374151", lineHeight: 1.6, fontSize: 14 }}><strong>🤖 Tutor:</strong> {answer}</div>}
      </div>
      <button onClick={onTakeQuiz} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>Take the Quiz 🎯</button>
    </div>
  );
}

// ── QUIZ SCREEN ───────────────────────────────────────────
function QuizScreen({ quiz, onFinish, onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const q = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;
  const handleSelect = (opt) => { if (selected) return; setSelected(opt); };
  const handleNext = () => {
    const correct = selected?.charAt(0) === q.correct;
    const newAnswers = [...answers, correct];
    if (isLast) { onFinish(newAnswers); }
    else { setAnswers(newAnswers); setCurrent(c => c + 1); setSelected(null); }
  };
  const correct = selected?.charAt(0) === q.correct;
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#374151", fontSize: 13 }}>← Back</button>
        <span style={{ color: "#6B7280", fontSize: 14 }}>Question {current + 1} of {quiz.questions.length}</span>
      </div>
      <ProgressBar value={current + 1} max={quiz.questions.length} />
      <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, marginTop: 20, marginBottom: 16 }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 20px", lineHeight: 1.5 }}>{q.question}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map(opt => {
            const letter = opt.charAt(0); const isCorrect = letter === q.correct; const isSelected = selected === opt;
            let bg = "white", border = "#E5E7EB", color = "#374151";
            if (selected) { if (isCorrect) { bg = "#F0FDF4"; border = "#16A34A"; color = "#15803D"; } else if (isSelected) { bg = "#FEF2F2"; border = "#DC2626"; color = "#B91C1C"; } }
            return <button key={opt} onClick={() => handleSelect(opt)} style={{ padding: "12px 16px", borderRadius: 12, border: `2px solid ${border}`, background: bg, color, textAlign: "left", fontSize: 14, cursor: selected ? "default" : "pointer", fontWeight: isSelected || (selected && isCorrect) ? 600 : 400 }}>{opt}{selected && isCorrect && " ✓"}{selected && isSelected && !isCorrect && " ✗"}</button>;
          })}
        </div>
        {selected && <div style={{ marginTop: 16, background: correct ? "#F0FDF4" : "#FEF2F2", borderRadius: 10, padding: "12px 14px", color: correct ? "#14532D" : "#7F1D1D", fontSize: 14, lineHeight: 1.6 }}><strong>{correct ? "✅ Correct! " : "❌ Not quite. "}</strong>{q.explanation}</div>}
      </div>
      {selected && <button onClick={handleNext} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{isLast ? "See Results 🏆" : "Next Question →"}</button>}
    </div>
  );
}

// ── RESULTS SCREEN ────────────────────────────────────────
function ResultsScreen({ answers, config, onDashboard, onNewLesson }) {
  const score = answers.filter(Boolean).length;
  const total = answers.length;
  const pct = Math.round((score / total) * 100);
  const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : 1;
  const message = pct >= 80 ? "Excellent work! 🎉" : pct >= 60 ? "Good job! Keep practicing! 💪" : "Keep going! You're learning! 🌱";
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>{"⭐".repeat(stars)}</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{score}/{total} Correct!</h2>
      <p style={{ color: "#6B7280", marginBottom: 24 }}>{message}</p>
      <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <ProgressBar value={score} max={total} color={pct >= 80 ? "#16A34A" : pct >= 60 ? "#D97706" : "#DC2626"} />
        <p style={{ fontSize: 32, fontWeight: 700, color: "#111827", margin: "8px 0 0" }}>{pct}%</p>
        <p style={{ color: "#6B7280", fontSize: 14, margin: "4px 0 0" }}>{config.grade} · {config.subject} · {config.topic}</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onDashboard} style={{ flex: 1, padding: 14, borderRadius: 12, border: "2px solid #E5E7EB", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Dashboard</button>
        <button onClick={onNewLesson} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", fontWeight: 700, cursor: "pointer" }}>New Lesson ✨</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth");
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState("");

  const loadProgress = async (userId) => {
    const { data } = await supabase.from("progress").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setProgress(data);
  };

  const handleAuth = async (u) => {
    setUser(u);
    await loadProgress(u.id);
    setScreen("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProgress([]); setScreen("auth");
  };

  const handleStart = async (cfg) => {
    setConfig(cfg); setError(""); setScreen("loading");
    try {
      const res = await fetch(`${API}/generate-lesson`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg) });
      if (!res.ok) throw new Error("Failed");
      setLesson(await res.json()); setScreen("lesson");
    } catch { setError("Could not connect. Make sure backend is running."); setScreen("setup"); }
  };

  const handleTakeQuiz = async () => {
    setScreen("loading");
    try {
      const res = await fetch(`${API}/generate-quiz`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...config, lesson_content: lesson.summary + " " + lesson.sections.map(s => s.content).join(" ") }) });
      setQuiz(await res.json()); setScreen("quiz");
    } catch { setScreen("lesson"); }
  };

  const handleFinishQuiz = async (ans) => {
    setQuizAnswers(ans);
    const score = Math.round((ans.filter(Boolean).length / ans.length) * 100);
    if (user) {
      await supabase.from("progress").insert({ user_id: user.id, grade: config.grade, subject: config.subject, topic: config.topic, score });
      await loadProgress(user.id);
    }
    setScreen("results");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F8FAFF 0%, #F3F0FF 100%)", fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🎓</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#4338CA" }}>LearnSpark</span>
        <span style={{ marginLeft: "auto", fontSize: 12, background: "#EEF2FF", color: "#4338CA", padding: "4px 10px", borderRadius: 99, fontWeight: 600 }}>AI-Powered · PreK–12th Grade</span>
      </div>
      {error && <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "12px 24px", textAlign: "center", fontSize: 14 }}>{error}</div>}
      {screen === "auth" && <AuthScreen onAuth={handleAuth} />}
      {screen === "loading" && <Spinner text="Generating your lesson..." />}
      {screen === "dashboard" && <DashboardScreen user={user} progress={progress} onStartLesson={() => setScreen("setup")} onLogout={handleLogout} />}
      {screen === "setup" && <SetupScreen onStart={handleStart} onBack={() => setScreen("dashboard")} />}
      {screen === "lesson" && lesson && <LessonScreen config={config} lesson={lesson} onTakeQuiz={handleTakeQuiz} onBack={() => setScreen("setup")} />}
      {screen === "quiz" && quiz && <QuizScreen quiz={quiz} onBack={() => setScreen("lesson")} onFinish={handleFinishQuiz} />}
      {screen === "results" && <ResultsScreen answers={quizAnswers} config={config} onDashboard={() => setScreen("dashboard")} onNewLesson={() => { setLesson(null); setQuiz(null); setScreen("setup"); }} />}
    </div>
  );
}