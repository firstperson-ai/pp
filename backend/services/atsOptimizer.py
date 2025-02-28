# backend/services/atsOptimizer.py
import sys
import json
import os
import spacy
from sentence_transformers import SentenceTransformer, util
import nltk
from nltk.corpus import wordnet
import numpy as np
from functools import lru_cache
import time
import logging
from multiprocessing import Pool
import torch
from fuzzywuzzy import fuzz
from textblob import TextBlob
from typing import Tuple, List

# Configure logging for production and local with advanced formatting
logging.basicConfig(
  level=logging.INFO,
  format='%(asctime)s - %(levelname)s - %(process)d - %(pathname)s:%(lineno)d - %(message)s',
  filename='ats_optimizer.log' if os.environ.get('NODE_ENV') == 'production' else None,
  handlers=[
    logging.FileHandler('ats_optimizer.log') if os.environ.get('NODE_ENV') == 'production' else logging.StreamHandler(),
    logging.StreamHandler()  # Ensure console logging locally
  ]
)
logger = logging.getLogger(__name__)

# Load models with CPU/GPU optimization, retry logic, and health checks
@lru_cache(maxsize=1)
def load_models() -> Tuple[spacy.language.Language, SentenceTransformer]:
  try:
    max_retries = 3
    node_env = os.environ.get('NODE_ENV', 'development')
    device = 'cuda' if torch.cuda.is_available() and node_env != 'development' else 'cpu'
    for attempt in range(max_retries):
      try:
        logger.info(f"Attempt {attempt + 1}/{max_retries} - Loading models on device: {device} in {node_env} environment")
        nlp = spacy.load("en_core_web_sm")
        model = SentenceTransformer('all-MiniLM-L6-v2', device=device)
        nltk.download('wordnet', quiet=True)
        # Health check: Verify models are loaded correctly
        assert nlp and model, "Model loading failed health check"
        return nlp, model
      except Exception as e:
        if attempt < max_retries - 1:
          logger.warning(f"Model loading retry {attempt + 1}/{max_retries} failed: {e}")
          time.sleep(2)  # Wait before retry
        else:
          logger.error(f"Model loading failed after {max_retries} attempts: {e}")
          raise
  except Exception as e:
    logger.critical(f"Critical failure loading models: {e}")
    raise

nlp, model = load_models()

def extract_text_from_resume(resume: str) -> str:
  """Extract and clean text from resume (handles plain text, extendable for PDFs)."""
  try:
    # For now, assume plain text input (extend with PyMuPDF for PDFs later)
    cleaned_text = resume.strip()
    if not cleaned_text:
      raise ValueError("Resume text is empty or invalid")
    doc = nlp(cleaned_text)
    return cleaned_text
  except Exception as e:
    logger.error(f"Text extraction failed for resume: {e}")
    return ""

@lru_cache(maxsize=1000)
def extract_skills_and_keywords(text: str) -> Tuple[List[str], List[str]]:
  """Extract skills and keywords with error handling, optimized for local/production."""
  try:
    if not text.strip():
      return [], []
    doc = nlp(text)
    skills = [ent.text for ent in doc.ents if ent.label_ in ["SKILL", "ORG", "PRODUCT"]]
    # Enhanced sentence extraction for better context
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip() and len(sent.text.strip()) > 5]
    return skills, sentences
  except Exception as e:
    logger.error(f"Skill extraction failed for text length {len(text)}: {e}")
    return [], []

def calculate_ats_score(resume_text: str, jd_text: str) -> float:
  """Compute ATS score with optimized multiprocessing, fuzzy matching, and local/production tuning."""
  start_time = time.time()
  try:
    node_env = os.environ.get('NODE_ENV', 'development')
    pool_size = 4 if node_env == 'production' else 2  # Fewer processes locally
    with Pool(processes=pool_size) as pool:
      resume_result = pool.apply_async(extract_skills_and_keywords, (resume_text,))
      jd_result = pool.apply_async(extract_skills_and_keywords, (jd_text,))
      resume_skills, resume_sents = resume_result.get(timeout=30)
      jd_skills, jd_sents = jd_result.get(timeout=30)

    # Batch encode with dynamic batch size and health check
    batch_size = 128 if node_env == 'production' else 32
    all_sents = resume_sents + jd_sents
    if not all_sents:
      logger.warning("No sentences extracted for ATS scoring, returning 0")
      return 0.0
    embeddings = model.encode(
      all_sents,
      batch_size=batch_size,
      show_progress_bar=False,
      convert_to_tensor=True,
      device=model.device
    )
    resume_embeddings = embeddings[:len(resume_sents)]
    jd_embeddings = embeddings[len(resume_sents):]

    # Cosine similarity with optimized tensor operations and validation
    similarity_matrix = util.cos_sim(resume_embeddings, jd_embeddings)
    if similarity_matrix.numel() == 0:
      logger.warning("Similarity matrix empty, returning 0")
      return 0.0
    max_similarities = similarity_matrix.max(dim=1)[0].cpu().numpy()
    base_score = np.mean(max_similarities) * 100 if max_similarities.size > 0 else 0

    # Enhanced fuzzy matching with threshold tuning and logging
    skill_matches = sum(1 for r_skill in resume_skills for j_skill in jd_skills if fuzz.ratio(r_skill.lower(), j_skill.lower()) > 85)  # Increased threshold for precision
    skill_bonus = min(skill_matches * 5, 30)  # Slightly higher bonus for competitiveness
    ats_score = min(base_score + skill_bonus, 100)

    logger.info(f"ATS score calculated in {time.time() - start_time:.2f} seconds: {ats_score} in {node_env} environment")
    return round(ats_score, 2)
  except Exception as e:
    logger.error(f"ATS score calculation failed: {e}")
    return 0.0

def generate_suggestions(resume_skills: List[str], jd_skills: List[str]) -> str:
  """Generate actionable suggestions with sentiment analysis, enhanced for competitiveness."""
  try:
    missing_skills = set(jd_skills) - set(resume_skills)
    if not missing_skills:
      return "Your resume is exceptionally aligned! Consider showcasing quantifiable achievements or soft skills like 'communication' for recruiters."
    suggestions = f"Boost your score by adding keywords like {', '.join(list(missing_skills)[:3])}. These align with the job description for optimal ATS performance."
    sentiment = TextBlob(suggestions).sentiment.polarity
    if sentiment < 0 and os.environ.get('NODE_ENV') == 'production':
      suggestions += " These enhancements will significantly strengthen your application!"
    return suggestions
  except Exception as e:
    logger.error(f"Suggestion generation failed: {e}")
    return "No suggestions generated due to an error. Please review your inputs."

def optimize_resume(resume_text: str, jd_text: str) -> str:
  """Optimize resume text with advanced rephrasing, structure, and ATS-specific formatting."""
  try:
    resume_skills, _ = extract_skills_and_keywords(resume_text)
    jd_skills, _ = extract_skills_and_keywords(jd_text)
    missing_skills = set(jd_skills) - set(resume_skills)
    
    optimized = resume_text.strip()
    if missing_skills:
      optimized += f"\n\n**ATS-Optimized Skills:** {', '.join(missing_skills)} (Critical for alignment with job requirements)"
    lines = optimized.split('\n')
    optimized = '\n'.join([f"- {line.strip()}" if not line.startswith('-') else line for line in lines if line.strip()]).strip()
    # Add ATS-friendly formatting (single-column, no special chars)
    optimized = optimized.replace('\t', ' ').replace('\r', '').replace('*', '-')
    return optimized
  except Exception as e:
    logger.error(f"Resume optimization failed: {e}")
    return resume_text

def main():
  try:
    start_time = time.time()
    resume = sys.argv[1]
    job_description = sys.argv[2]

    resume_text = extract_text_from_resume(resume)
    ats_score = calculate_ats_score(resume_text, job_description)
    suggestions = generate_suggestions(*extract_skills_and_keywords(resume_text), *extract_skills_and_keywords(job_description))
    optimized_resume = optimize_resume(resume_text, job_description)

    result = {
      "optimizedResume": optimized_resume,
      "atsScore": ats_score,
      "suggestions": suggestions,
      "processingTime": time.time() - start_time,
      "cacheHit": False
    }
    print(json.dumps(result, ensure_ascii=False))  # Ensure UTF-8 compatibility
  except Exception as e:
    logger.error(f"Main execution failed: {e}")
    print(json.dumps({"error": "Optimization failed. Please try again.", "atsScore": 0, "suggestions": "", "processingTime": 0, "cacheHit": False}, ensure_ascii=False))

if __name__ == "__main__":
  main()