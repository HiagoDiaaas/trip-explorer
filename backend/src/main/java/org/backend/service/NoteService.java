package org.backend.service;
import org.backend.dto.request.CreateNoteRequest;
import org.backend.dto.response.NoteResponse;

import java.util.List;

public interface NoteService {
    NoteResponse addNote(CreateNoteRequest request);
    List<NoteResponse> getNotesByUser(Long userId);
    List<NoteResponse> getNotesForUserAndTrip(Long userId, Long tripId);
    NoteResponse updateNote(Long noteId, Long userId, String newContent);
    void deleteNote(Long noteId, Long userId);
}
