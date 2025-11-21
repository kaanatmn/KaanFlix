package com.kaanflix.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TmdbService {

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getPopularMovies() {
        String url = baseUrl + "movie/popular?api_key=" + apiKey;
        return restTemplate.getForObject(url, String.class);
    }

    /**
     * Searches for movies matching the user's query.
     * @param query The movie title to search for (e.g., "Batman")
     * @return JSON response from TMDB
     */
    public String searchMovies(String query) {
        // API requires spaces to be encoded (e.g., "Batman%20Begins")
        String encodedQuery = query.replace(" ", "%20");
        String url = baseUrl + "search/movie?api_key=" + apiKey + "&query=" + encodedQuery;
        return restTemplate.getForObject(url, String.class);
    }
}








