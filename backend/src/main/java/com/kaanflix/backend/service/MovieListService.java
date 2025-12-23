package com.kaanflix.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.kaanflix.backend.entity.ListLike;
import com.kaanflix.backend.entity.MovieList;
import com.kaanflix.backend.entity.MovieListItem;
import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.repository.ListLikeRepository;
import com.kaanflix.backend.repository.MovieListItemRepository;
import com.kaanflix.backend.repository.MovieListRepository;
import com.kaanflix.backend.repository.UserRepository;

@Service
public class MovieListService {

    private final MovieListRepository movieListRepository;
    private final MovieListItemRepository movieListItemRepository;
    private final ListLikeRepository listLikeRepository;
    private final UserRepository userRepository;

    public MovieListService(
        MovieListRepository movieListRepository,
        MovieListItemRepository movieListItemRepository,
        ListLikeRepository listLikeRepository,
        UserRepository userRepository
    ) {
        this.movieListRepository = movieListRepository;
        this.movieListItemRepository = movieListItemRepository;
        this.listLikeRepository = listLikeRepository;
        this.userRepository = userRepository;
    }

    public MovieList createList(Long userId, String name, String description, Boolean isPublic) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        MovieList list = new MovieList();
        list.setName(name);
        list.setDescription(description);
        list.setIsPublic(isPublic != null ? isPublic : false);
        list.setUser(user);

        return movieListRepository.save(list);
    }

    public List<Map<String, Object>> getUserLists(Long userId) {
        List<MovieList> lists = movieListRepository.findByUserId(userId);
        return lists.stream().map(this::convertToMap).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPublicLists(Long currentUserId) {
        List<MovieList> lists = movieListRepository.findByIsPublicTrue();
        return lists.stream()
            .map(list -> {
                Map<String, Object> listMap = convertToMap(list);
                listMap.put("isLiked", listLikeRepository.existsByUserIdAndMovieListId(currentUserId, list.getId()));
                listMap.put("likeCount", listLikeRepository.countByMovieListId(list.getId()));
                return listMap;
            })
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getLikedLists(Long userId) {
        List<ListLike> likes = listLikeRepository.findByUserId(userId);
        return likes.stream()
            .map(like -> convertToMap(like.getMovieList()))
            .collect(Collectors.toList());
    }

    public Map<String, Object> getListById(Long listId) {
        MovieList list = movieListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("List not found!"));
        
        Map<String, Object> listMap = convertToMap(list);
        listMap.put("movies", list.getItems());
        return listMap;
    }

    public MovieListItem addMovieToList(Long listId, Long tmdbMovieId, String movieTitle, String posterPath) {
        MovieList list = movieListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("List not found!"));

        if (movieListItemRepository.existsByMovieListIdAndTmdbMovieId(listId, tmdbMovieId)) {
            throw new RuntimeException("Movie already in this list!");
        }

        MovieListItem item = new MovieListItem();
        item.setMovieList(list);
        item.setTmdbMovieId(tmdbMovieId);
        item.setMovieTitle(movieTitle);
        item.setPosterPath(posterPath);

        return movieListItemRepository.save(item);
    }

    public void removeMovieFromList(Long itemId, Long userId) {
        MovieListItem item = movieListItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found!"));

        if (!item.getMovieList().getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized!");
        }

        movieListItemRepository.delete(item);
    }

    public void likeList(Long userId, Long listId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found!"));
        
        MovieList list = movieListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("List not found!"));

        if (list.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can't like your own list!");
        }

        if (!list.getIsPublic()) {
            throw new RuntimeException("Can only like public lists!");
        }

        if (listLikeRepository.existsByUserIdAndMovieListId(userId, listId)) {
            throw new RuntimeException("Already liked this list!");
        }

        ListLike like = new ListLike();
        like.setUser(user);
        like.setMovieList(list);
        listLikeRepository.save(like);
    }

    public void unlikeList(Long userId, Long listId) {
        ListLike like = listLikeRepository.findByUserIdAndMovieListId(userId, listId)
            .orElseThrow(() -> new RuntimeException("Like not found!"));
        
        listLikeRepository.delete(like);
    }

    public void deleteList(Long listId, Long userId) {
        MovieList list = movieListRepository.findById(listId)
            .orElseThrow(() -> new RuntimeException("List not found!"));

        if (!list.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized!");
        }

        movieListRepository.delete(list);
    }

    private Map<String, Object> convertToMap(MovieList list) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", list.getId());
        map.put("name", list.getName());
        map.put("description", list.getDescription());
        map.put("isPublic", list.getIsPublic());
        map.put("createdAt", list.getCreatedAt());
        map.put("username", list.getUser().getUsername());
        map.put("userId", list.getUser().getId());
        map.put("movieCount", list.getItems().size());
        return map;
    }
}