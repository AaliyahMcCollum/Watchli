import { createClient } from 'https://esm.sh/@supabase/supabase-js';

export const supabase = createClient(
    'https://ftjnbtexkasfwucengby.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0am5idGV4a2FzZnd1Y2VuZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDI3NjcsImV4cCI6MjA3ODk3ODc2N30.Y9sqNI36ohRTXfDBhhYLKFgrt-PvVkC5ER5-aNxI_0w'
);