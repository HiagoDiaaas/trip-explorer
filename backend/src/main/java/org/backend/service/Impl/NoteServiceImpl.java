package org.backend.service.Impl;
import lombok.RequiredArgsConstructor;
import org.backend.domain.Note;
import org.backend.domain.Trip;
import org.backend.domain.User;
import org.backend.dto.request.CreateNoteRequest;
import org.backend.dto.response.NoteResponse;
import org.backend.repository.NoteRepository;
import org.backend.repository.TripRepository;
import org.backend.repository.UserRepository;
import org.backend.service.NoteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    @Override
    public NoteResponse addNote(CreateNoteRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with id: " + request.getTripId()));

        Note note = new Note();
        note.setUser(user);
        note.setTrip(trip);
        note.setContent(request.getContent());
        Note saved = noteRepository.save(note);

        return NoteResponse.from(saved.getId(), user.getId(), trip.getId(), saved.getContent());
    }

    @Override
    public List<NoteResponse> getNotesByUser(Long userId) {
        List<Note> notes = noteRepository.findByUserId(userId);
        return notes.stream()
                .map(n -> NoteResponse.from(n.getId(), n.getUser().getId(), n.getTrip().getId(), n.getContent()))
                .collect(Collectors.toList());
    }

    @Override
    public List<NoteResponse> getNotesForUserAndTrip(Long userId, Long tripId) {
        List<Note> notes = noteRepository.findByUserIdAndTripId(userId, tripId);
        return notes.stream()
                .map(n -> NoteResponse.from(n.getId(), n.getUser().getId(), n.getTrip().getId(), n.getContent()))
                .collect(Collectors.toList());
    }

    @Override
    public NoteResponse updateNote(Long noteId, Long userId, String newContent) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not the owner of this note");
        }
        note.setContent(newContent);
        Note updated = noteRepository.save(note);
        return NoteResponse.from(updated.getId(), updated.getUser().getId(), updated.getTrip().getId(), updated.getContent());
    }

    @Override
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not the owner of this note");
        }
        noteRepository.delete(note);
    }
}