import io

import pdfplumber
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = FastAPI()


def calculate_match_score(resume_text: str, job_description: str) -> float:
	"""Return the cosine similarity between resume and job description as a percentage."""
	vectorizer = TfidfVectorizer(stop_words="english")
	vectors = vectorizer.fit_transform([resume_text, job_description])
	similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
	return round(float(similarity * 100), 2)


@app.post("/api/v1/analyze")
async def analyze_resume(
	file: UploadFile = File(...),
	job_description: str = Form(...),
) -> dict[str, object]:
	try:
		file_contents = await file.read()
		with pdfplumber.open(io.BytesIO(file_contents)) as pdf:
			resume_text = "\n".join(page.extract_text() or "" for page in pdf.pages).strip()

		return {
			"status": "success",
			"resume_snippet": resume_text[:100],
			"match_score": calculate_match_score(resume_text, job_description),
		}
	except Exception as error:
		raise HTTPException(status_code=500, detail=str(error)) from error
