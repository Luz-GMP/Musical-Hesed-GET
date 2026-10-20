from faster_whisper import WhisperModel
import json, sys

model = WhisperModel("small", device="cpu", compute_type="int8")
segments, _ = model.transcribe(sys.argv[1], word_timestamps=True, language="pt")
words = [{"word": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)} for s in segments for w in s.words]

with open("timestamps.json", "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, indent=2)