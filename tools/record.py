import json,subprocess,os
from multiprocessing import Pool
L=json.load(open("cliplist3.json"))
OUT="../audio/"
jobs=[(lang,v[0],v[1],v[2]) for lang in L for v in L[lang].values()]
K=None
def init():
    global K
    from kokoro_onnx import Kokoro
    K=Kokoro("kokoro/kokoro-v1.0.onnx","kokoro/voices-v1.0.bin")
def run(j):
    import soundfile as sf
    lang,text,speed,fn=j
    out=OUT+fn
    if os.path.exists(out):return 0
    s,sr=K.create(text,voice="ef_dora" if lang=="es" else "af_heart",speed=speed,lang="es" if lang=="es" else "en-us")
    w=f"wav/{fn}.wav";sf.write(w,s,sr)
    af="silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,apad=pad_dur=0.06"
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",w,"-af",af,"-ac","1","-ar","24000","-c:a","libmp3lame","-b:a","48k",out],check=True)
    os.remove(w)
    return 1
if __name__=="__main__":
    os.makedirs("wav",exist_ok=True)
    with Pool(4,initializer=init) as p: n=sum(p.imap_unordered(run,jobs))
    keep={v[2] for lang in L for v in L[lang].values()}|{"silence.mp3"}
    stale=[f for f in os.listdir(OUT) if f not in keep]
    for f in stale: os.remove(OUT+f)
    print("recorded",n,"| removed stale",len(stale),"| total",len(os.listdir(OUT)))
