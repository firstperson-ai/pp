// app/api/optimize-resume/route.js
import { PythonShell } from 'python-shell';
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('optimize-resume route.js POST called in', process.env.NODE_ENV || 'development');
  try {
    const { resume, jobDescription } = await req.json();
    console.log('Request body:', { resume, jobDescription });

    if (!resume || !jobDescription) {
      console.log('Missing resume or job description');
      return NextResponse.json({ error: 'Resume and job description are required' }, { status: 400 });
    }

    // Configure Python script options
    const options = {
      scriptPath: 'app/services', // Path to Python script
      args: [resume, jobDescription],
    };

    // Run Python script and get response
    const result = await new Promise((resolve, reject) => {
      PythonShell.run('atsOptimizer.py', options, (err, results) => {
        if (err) reject(err);
        resolve(results ? results[0] : null);
      });
    });

    const parsedResult = JSON.parse(result);
    console.log('Python response:', parsedResult);

    return NextResponse.json({
      atsScore: parsedResult.atsScore,
      suggestions: parsedResult.suggestions,
    }, { status: 200 }); // Return only score and suggestions for original workflow
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Optimization failed. Please try again.' }, { status: 500 });
  }
}