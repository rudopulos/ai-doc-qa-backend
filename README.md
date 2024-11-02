# AI Document Q&A Backend

## Description
This project implements a document processing and question-answering system using Node.js (Express) for the backend and React for the frontend. It integrates with Pinecone for vector storage and retrieval, and utilizes the Claude 3.5 API or GPT-4 API for text analysis and question answering.

## Features
- Document upload and processing
- Integration with Pinecone for vector storage
- RAG (Retrieval-Augmented Generation) system implementation
- Basic error handling and input validation

## Requirements
- Node.js (version X.X.X)
- npm (or yarn)
- API keys for Pinecone and the chosen AI API (Claude 3.5 or GPT-4)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rudopulos/ai-doc-qa-backend.git
   cd ai-doc-qa-backend

Install dependencies:

npm install
Set up environment variables: Create a .env file in the root of the project with the following content:

PINECONE_API_KEY=pcsk_7AXiKW_2NUh1S394w6knh9cuRM8nSHBXJG8fYrpKbTQBzRTiVEh7MYgmCjQqVNJ5h4cQoT
PINECONE_ENVIRONMENT=aped-4627-b74a
OPENAI_API_KEY=ysk-proj-6ftSnV94bUBS83Jvx9ckRjjs_ER5FxQ0ebH3Z9hgj0C2Kh0njALWHmvm1Kg8zbrW1_Dv9EWO2ET3BlbkFJuCVPcEf2glP5pGg-tATL5dKGuN34pgVSvmCwfQA751j1lrgBgqezBJmcA3gM0Iun6_HerUpn8A
