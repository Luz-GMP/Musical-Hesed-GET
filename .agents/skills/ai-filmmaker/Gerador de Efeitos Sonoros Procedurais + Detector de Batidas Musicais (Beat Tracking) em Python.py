import numpy as np
import wave
import json
import subprocess

SAMPLE_RATE = 44100

def generate_pop(duration=0.08, freq_start=380, freq_end=90):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    freqs = np.linspace(freq_start, freq_end, len(t))
    envelope = np.exp(-t * 35)
    signal = np.sin(2 * np.pi * freqs * t) * envelope * 0.5
    return signal

def generate_whoosh(duration=0.28):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    noise = np.random.normal(0, 1, len(t))
    envelope = np.sin(np.pi * (t / duration)) ** 2
    smooth_noise = np.convolve(noise, np.ones(18)/18, mode='same')
    return smooth_noise * envelope * 0.35

def generate_chime(duration=0.6, freq=880):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    envelope = np.exp(-t * 6)
    signal = (np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * (freq * 1.5) * t)) * envelope * 0.25
    return signal

def build_sfx_track(total_duration_sec, events, output_wav="sfx_track.wav"):
    """
    events: lista de tuplas (tempo_em_segundos, tipo_de_som)
    Ex: [(0.2, 'pop'), (2.8, 'whoosh'), (3.1, 'pop'), (8.0, 'chime')]
    """
    master = np.zeros(int(SAMPLE_RATE * total_duration_sec))
    for time_sec, sfx_type in events:
        if sfx_type == 'pop': sfx = generate_pop()
        elif sfx_type == 'whoosh': sfx = generate_whoosh()
        elif sfx_type == 'chime': sfx = generate_chime()
        else: continue
        start_idx = int(time_sec * SAMPLE_RATE)
        end_idx = min(start_idx + len(sfx), len(master))
        master[start_idx:end_idx] += sfx[:end_idx - start_idx]

    master = np.clip(master, -1.0, 1.0)
    pcm = (master * 32767).astype(np.int16)
    with wave.open(output_wav, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(pcm.tobytes())

def extract_music_beats(audio_path, output_json="beats.json", min_interval_sec=0.35):
    """
    Converte qualquer arquivo de música (.mp3/.wav) via FFmpeg e detecta os picos de batida (onsets)
    para sincronizar cortes de cena e entradas de elementos exatamente no ritmo da música.
    """
    temp_wav = "_temp_beat_analysis.wav"
    subprocess.run([
        "ffmpeg", "-y", "-i", audio_path, "-ac", "1", "-ar", str(SAMPLE_RATE), temp_wav
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    with wave.open(temp_wav, 'rb') as wf:
        raw = wf.readframes(wf.getnframes())
        audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

    # Calcula energia em janelas de 20ms e detecta subidas bruscas de energia (Onset Flux)
    hop = int(SAMPLE_RATE * 0.02)
    num_frames = len(audio) // hop
    energies = np.array([np.sum(audio[i*hop:(i+1)*hop] ** 2) for i in range(num_frames)])
    flux = np.maximum(0, np.diff(energies, prepend=0))

    threshold = np.mean(flux) + 1.65 * np.std(flux)
    beats = []
    last_beat = -min_interval_sec

    for i, val in enumerate(flux):
        t_sec = round(i * 0.02, 2)
        if val > threshold and (t_sec - last_beat) >= min_interval_sec:
            beats.append(t_sec)
            last_beat = t_sec

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump({"beats_seconds": beats, "total_beats": len(beats)}, f, indent=2)
    return beats