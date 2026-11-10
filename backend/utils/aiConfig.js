import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

export const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // For Whisper