package org.backend.dto.response;

import lombok.Data;

@Data
public class NoteResponse {
    private Long id;
    private Long userId;
    private Long tripId;
    private String content;

    public static NoteResponse from(Long noteId, Long userId, Long tripId, String content) {
        NoteResponse response = new NoteResponse();
        response.setId(noteId);
        response.setUserId(userId);
        response.setTripId(tripId);
        response.setContent(content);
        return response;
    }
}