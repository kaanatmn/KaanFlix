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

    public String searchMovies(String query) {
        String encodedQuery = query.replace(" ", "%20");
        String url = baseUrl + "search/movie?api_key=" + apiKey + "&query=" + encodedQuery;
        return restTemplate.getForObject(url, String.class);
    }

    public String getMovieDetails(Long movieId) {
        String url = baseUrl + "movie/" + movieId + "?api_key=" + apiKey + "&append_to_response=credits,videos";
        return restTemplate.getForObject(url, String.class);
    }
}

    









