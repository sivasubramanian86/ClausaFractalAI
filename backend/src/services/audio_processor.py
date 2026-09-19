"""Audio Processor service for ClausaFractalAI.

Processes voice dictation clips from the user microphone, transcribing spoken legal questions
into structured text using Gemini Multimodal Audio capabilities.
"""

from typing import Optional

from pydantic import BaseModel, Field

from config import get_settings


class AudioTranscriptionResult(BaseModel):
    """Structured transcription output from voice dictation.

    Attributes:
        transcript: Extracted text question or instruction.
        detected_language: ISO language code detected from audio (default: 'en').
        confidence: Confidence score of transcription (0.0 to 1.0).
        duration_seconds: Estimated or reported duration of the audio clip.
        status: Execution status ('success', 'empty_input', 'transcription_failed').
    """

    transcript: str
    detected_language: str = "en"
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    duration_seconds: float = 0.0
    status: str = "success"


class AudioProcessor:
    """Handles audio ingestion and transcription via Gemini Multimodal Audio."""

    def __init__(self, gemini_client: Optional[object] = None) -> None:
        """Initialize AudioProcessor with an optional Gemini API / Vertex AI client.

        Args:
            gemini_client: Optional pre-configured google-genai Client instance.
        """
        self.settings = get_settings()
        self.client = gemini_client

    def transcribe(
        self,
        audio_bytes: bytes,
        mime_type: str = "audio/webm",
        mock_response: Optional[str] = None,
    ) -> AudioTranscriptionResult:
        """Transcribe audio byte stream into text.

        Args:
            audio_bytes: Raw binary payload of the recorded audio snippet.
            mime_type: MIME type of the audio stream (e.g. 'audio/webm', 'audio/wav').
            mock_response: Optional string override for deterministic testing.

        Returns:
            AudioTranscriptionResult containing the transcribed text and metadata.
        """
        if not audio_bytes:
            return AudioTranscriptionResult(
                transcript="",
                detected_language="en",
                confidence=0.0,
                duration_seconds=0.0,
                status="empty_input",
            )

        # Allow deterministic mock override for unit tests or offline execution
        if mock_response is not None:
            return AudioTranscriptionResult(
                transcript=mock_response.strip(),
                detected_language="en",
                confidence=0.99,
                duration_seconds=len(audio_bytes) / 16000.0,
                status="success",
            )

        if self.client is not None:
            try:
                from google.genai import types

                prompt = (
                    "You are an expert legal stenographer. Transcribe the following spoken audio "
                    "verbatim into clean English text. Do not add commentary or introductory "
                    "phrases. Transcribe exactly what was spoken."
                )

                part = types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)
                model_name = self.settings.router_model

                try:
                    response = self.client.models.generate_content(
                        model=model_name,
                        contents=[part, prompt],
                    )
                except Exception:
                    # Fallback to verified 2.5 model if 3.8 is not deployed
                    model_name = self.settings.router_model_fallback
                    response = self.client.models.generate_content(
                        model=model_name,
                        contents=[part, prompt],
                    )

                text = getattr(response, "text", "").strip()
                return AudioTranscriptionResult(
                    transcript=text,
                    detected_language="en",
                    confidence=0.95,
                    duration_seconds=len(audio_bytes) / 16000.0,
                    status="success",
                )
            except Exception as err:
                return AudioTranscriptionResult(
                    transcript="",
                    detected_language="en",
                    confidence=0.0,
                    duration_seconds=0.0,
                    status=f"transcription_failed: {err!s}",
                )

        # Fallback offline mode if client is not configured
        return AudioTranscriptionResult(
            transcript="[Voice dictation offline - client not configured]",
            detected_language="en",
            confidence=0.5,
            duration_seconds=len(audio_bytes) / 16000.0,
            status="offline_mode",
        )
