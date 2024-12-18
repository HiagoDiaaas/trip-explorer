package org.backend.controller;

import lombok.RequiredArgsConstructor;
import org.backend.dto.request.CreateNoteRequest;
import org.backend.dto.response.NoteResponse;
import org.backend.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/notes")
@RestController
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteResponse> addNote(@RequestBody CreateNoteRequest request) {
        NoteResponse note = noteService.addNote(request);
        return new ResponseEntity<>(note, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NoteResponse>> getNotesByUser(@PathVariable Long userId) {
        List<NoteResponse> notes = noteService.getNotesByUser(userId);
        return new ResponseEntity<>(notes, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/trip/{tripId}")
    public ResponseEntity<List<NoteResponse>> getNotesForUserAndTrip(@PathVariable Long userId, @PathVariable Long tripId) {
        List<NoteResponse> notes = noteService.getNotesForUserAndTrip(userId, tripId);
        return new ResponseEntity<>(notes, HttpStatus.OK);
    }

    @PutMapping("/{noteId}/user/{userId}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable Long noteId, @PathVariable Long userId, @RequestBody String newContent) {
        NoteResponse updated = noteService.updateNote(noteId, userId, newContent);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{noteId}/user/{userId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long noteId, @PathVariable Long userId) {
        noteService.deleteNote(noteId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
