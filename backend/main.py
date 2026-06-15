from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json

app = FastAPI(title="K-12 AI Learning Platform")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

import os
from dotenv import load_dotenv
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class LessonRequest(BaseModel):
    grade: str
    subject: str
    topic: str

class QuizRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    lesson_content: str

class ChatRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    question: str
    lesson_content: str

def grade_to_age(grade):
    ages = {"PreK":"4-5 years old","Kindergarten":"5-6 years old","1st Grade":"6-7 years old","2nd Grade":"7-8 years old","3rd Grade":"8-9 years old","4th Grade":"9-10 years old","5th Grade":"10-11 years old","6th Grade":"11-12 years old","7th Grade":"12-13 years old","8th Grade":"13-14 years old","9th Grade":"14-15 years old","10th Grade":"15-16 years old","11th Grade":"16-17 years old","12th Grade":"17-18 years old"}
    return ages.get(grade, "school-age")

@app.post("/generate-lesson")
async def generate_lesson(req: LessonRequest):
    age = grade_to_age(req.grade)
    prompt = f'You are a friendly teacher for a {req.grade} student ({age}). Create a lesson about "{req.topic}" in {req.subject}. Return ONLY valid JSON: {{"title":"lesson title","emoji":"emoji","introduction":"intro text","sections":[{{"heading":"heading","content":"content","example":"example"}}],"fun_fact":"fact","summary":"summary"}}'
    try:
        response = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=[{"role":"user","content":prompt}], temperature=0.7)
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-quiz")
async def generate_quiz(req: QuizRequest):
    age = grade_to_age(req.grade)
    prompt = f'Create a 5-question quiz for {req.grade} ({age}) on {req.topic} in {req.subject}. Return ONLY valid JSON: {{"questions":[{{"question":"text","options":["A) opt","B) opt","C) opt","D) opt"],"correct":"A","explanation":"why"}}]}}'
    try:
        response = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=[{"role":"user","content":prompt}], temperature=0.5)
        content = response.choices[0].message.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask-question")
async def ask_question(req: ChatRequest):
    age = grade_to_age(req.grade)
    prompt = f'You are a kind tutor for a {req.grade} student ({age}). They learned about {req.topic}. Question: {req.question}. Answer in 2-4 simple encouraging sentences.'
    try:
        response = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=[{"role":"user","content":prompt}], temperature=0.7)
        return {"answer": response.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/grades")
def get_grades():
    return {"grades":["PreK","Kindergarten","1st Grade","2nd Grade","3rd Grade","4th Grade","5th Grade","6th Grade","7th Grade","8th Grade","9th Grade","10th Grade","11th Grade","12th Grade"]}

@app.get("/subjects")
def get_subjects():
    return {"subjects":{"Math":["Numbers & Counting","Fractions","Algebra Basics","Geometry"],"English":["Reading Comprehension","Grammar","Writing Skills","Vocabulary"],"Science":["Human Body","Solar System","Forces & Motion","Biology"],"Social Studies":["Maps & Geography","US History","World Cultures","Government & Civics"]}}