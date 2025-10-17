import { createClient } from '[https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm](https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm)';

// Cole a URL e a Chave Anon do seu projeto Supabase aqui
const SUPABASE_URL = 'https://fxqmvqyxayuhcjfkodms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cW12cXl4YXl1aGNqZmtvZG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTUwNTIsImV4cCI6MjA3NTA5MTA1Mn0.mQV7rjk5vTYf8_A3lTrbhfJMIXG38-ZKbsWAfbqb3tg';

// Exporta o cliente inicializado para que outros arquivos possam usá-lo
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
