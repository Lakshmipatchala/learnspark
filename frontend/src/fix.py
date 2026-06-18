f = open('App.js', encoding='utf-8')
c = f.read()
f.close()

# Find and remove the broken leftover code
start = c.find('\n    const data = await res.json();\n    const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);\n    setAudioUrl(audio);\n    audio.play();\n  } catch {\n    alert("Could not play audio. Try again!");\n  }\n  setLoadingAudio(false);\n};')

if start != -1:
    end = start + len('\n    const data = await res.json();\n    const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);\n    setAudioUrl(audio);\n    audio.play();\n  } catch {\n    alert("Could not play audio. Try again!");\n  }\n  setLoadingAudio(false);\n};')
    c = c[:start] + c[end:]
    print("Found and removed!")
else:
    print("Not found - checking line numbers...")
    lines = c.split('\n')
    for i, l in enumerate(lines[265:285], 266):
        print(f"{i}: {l}")

f = open('App.js', 'w', encoding='utf-8')
f.write(c)
f.close()