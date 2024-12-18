package org.backend.dto.request;
import lombok.Data;

@Data
public class CreateNoteRequest {
    private Long tripId;
    private Long userId;
    private String content;
}
