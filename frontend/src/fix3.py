f = open('App.js', encoding='utf-8')
c = f.read()
f.close()

# Fix: add proper indentation to generateVideo function
old = '''const generateVideo = async () => {
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
};'''

new = '''  const generateVideo = async () => {
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
  };'''

if old in c:
    c = c.replace(old, new)
    print("Fixed generateVideo indentation!")
else:
    print("Not found - checking...")
    idx = c.find('const generateVideo')
    print(c[idx-50:idx+300])

f = open('App.js', 'w', encoding='utf-8')
f.write(c)
f.close()