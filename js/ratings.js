import { supabase } from "./supabaseClient.js";

export async function rateMovie(movieId, rating) {
    const { data, error } = await supabase 
        .from("ratings")
        .upsert(
            {movie_id: movieId, rating: rating, updated_at: new Date() },
            { onConflict: "movie_id" }
        );

    if (error) {
        console.error(error);
        alert("Error saving rating");
    } else {
        alert("Rating saves!");
    }
}

export async function getRating(movieId) {
    const {data, error } = await supabase  
        .from("ratings")
        .select("rating")
        .eq("movie_id", movieId)
        .single();

    if (error) return null;
    return data.rating;
}