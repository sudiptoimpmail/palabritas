import json,subprocess,os,sys
from multiprocessing import Pool
L=json.load(open("cliplist.json"))
jobs=[(k,v[0],v[1],v[2]) for k,v in L.items()]
K=None
def init():
    global K
    from kokoro_onnx import Kokoro
    K=Kokoro("kokoro-v1.0.onnx","voices-v1.0.bin")
def run(j):
    import soundfile as sf
    k,text,speed,fn=j
    out="../audio/"+fn
    if os.path.exists(out):return fn
    s,sr=K.create(text,voice="ef_dora",speed=speed,lang="es")
    w=f"wav/{fn}.wav";sf.write(w,s,sr)
    af="silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,apad=pad_dur=0.06"
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",w,"-af",af,"-ac","1","-ar","24000","-c:a","libmp3lame","-b:a","48k",out],check=True)
    return fn
if __name__=="__main__":
    with Pool(4,initializer=init) as p:
        for i,_ in enumerate(p.imap_unordered(run,jobs),1):
            if i%50==0:print(i,flush=True)
    print("done",len(os.listdir("../audio")))
