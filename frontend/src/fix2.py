f = open('App.js', encoding='utf-8')
c = f.read()
f.close()

# Remove the old audio button
old_button = '''<button onClick={playLessonAudio} disabled={loadingAudio} style={{
  padding: "8px 16px", borderRadius: 10, border: "none",
  background: c.accent, color: "white", fontWeight: 600,
  cursor: "pointer", fontSize: 13, marginTop: 8, marginBottom: 8
}}>
  {loadingAudio ? "Loading audio..." : "🔊 Listen to Lesson"}
</button>'''

if old_button in c:
    c = c.replace(old_button, '')
    print("Removed old button!")
else:
    # Show lines around 293
    lines = c.split('\n')
    for i, l in enumerate(lines[288:300], 289):
        print(f"{i}: {l}")

f = open('App.js', 'w', encoding='utf-8')
f.write(c)
f.close()