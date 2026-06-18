f = open('App.js', encoding='utf-8')
c = f.read()
f.close()

old = '''      </div>
        {!showVideo && (
  <button onClick={generateVideo} disabled={videoLoading} style={{
    width: "100%", padding: "14px", borderRadius: 14, border: "none",
    background: "linear-gradient(135deg,#F59E0B,#EF4444)", color: "white",
    fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20,
    boxShadow: "0 4px 20px rgba(239,68,68,0.3)"
  }}>
    {videoLoading ? "🎬 Creating your video..." : "🎬 Watch AI Video Lesson"}
  </button>
)}'''

new = '''      </div>
      {!showVideo && (
        <button onClick={generateVideo} disabled={videoLoading} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#F59E0B,#EF4444)", color: "white",
          fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20,
          boxShadow: "0 4px 20px rgba(239,68,68,0.3)"
        }}>
          {videoLoading ? "🎬 Creating your video..." : "🎬 Watch AI Video Lesson"}
        </button>
      )}'''

if old in c:
    c = c.replace(old, new)
    print("Fixed JSX structure!")
else:
    print("Not found")

f = open('App.js', 'w', encoding='utf-8')
f.write(c)
f.close()