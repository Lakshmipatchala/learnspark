f = open('App.js', encoding='utf-8')
c = f.read()
f.close()

# Fix using the exact tab character found
old = '\t{!showVideo && (\n  <button onClick={generateVideo} disabled={videoLoading} style={{\n    width: "100%", padding: "14px", borderRadius: 14, border: "none",\n    background: "linear-gradient(135deg,#F59E0B,#EF4444)", color: "white",\n    fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20,\n    boxShadow: "0 4px 20px rgba(239,68,68,0.3)"\n  }}>\n    {videoLoading ? "\U0001f3ac Creating your video..." : "\U0001f3ac Watch AI Video Lesson"}\n  </button>\n)}'

new = '''      {!showVideo && (
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
    print("Fixed!")
else:
    print("Not found - trying another approach")
    # Direct line replacement
    lines = c.split('\n')
    for i, line in enumerate(lines):
        if '\t{!showVideo' in line:
            print(f"Found at line {i+1}: {repr(line)}")

f = open('App.js', 'w', encoding='utf-8')
f.write(c)
f.close()