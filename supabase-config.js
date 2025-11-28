// Configuração do Supabase
const SUPABASE_URL = 'https://db.acfcilnkegtvbuxkyxvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZmNpbG5rZWd0dmJ1eGt5eHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDE2MjksImV4cCI6MjA3OTUxNzYyOX0.iXI4i3tRXe9qgHeq5kZdrJHn62eEnD47dWOIfiVn3H8';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
