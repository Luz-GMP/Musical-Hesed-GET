mkdir -p .ref/frames

# Vídeo CURTO (Pinterest, Reels, TikTok, Shorts):
yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o ".ref/referencia.mp4" "URL_DA_REFERENCIA"

# Vídeo LONGO do YouTube (baixa apenas o trecho desejado, ex: 01:15 até 01:45):
yt-dlp --download-sections "*00:01:15-00:01:45" --force-keyframes-at-cuts -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o ".ref/referencia.mp4" "URL_DO_YOUTUBE"

# Detectar FPS original da referência:
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 .ref/referencia.mp4

# Extrair frames com timestamp e prancha de Storyboard 4x4:
ffmpeg -i .ref/referencia.mp4 -vf "fps=2,drawtext=text='%{pts\:hms}':x=20:y=20:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.7" .ref/frames/frame_%03d.jpg
ffmpeg -i .ref/referencia.mp4 -vf "fps=1,scale=360:-1,tile=4x4" -frames:v 1 .ref/storyboard_grid.jpg