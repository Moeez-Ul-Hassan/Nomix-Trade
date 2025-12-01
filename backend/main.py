from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"Project": "Nomix Trade", "Status": "Backend Running"}