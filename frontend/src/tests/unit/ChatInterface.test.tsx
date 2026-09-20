import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInterface, ChatMessage } from "../../components/ChatInterface";

describe("ChatInterface Unit Test Suite", () => {
  const sampleMessages: ChatMessage[] = [
    {
      id: "msg-1",
      sender: "user",
      text: "Is liability capped?",
    },
    {
      id: "msg-2",
      sender: "agent",
      text: "Yes, aggregate liability is strictly capped at $50,000.",
      qualityScore: 9.9,
      citations: [
        {
          clause: "Section 4 Limitation of Liability",
          page: 2,
          snippet: "TOTAL CUMULATIVE AGGREGATE LIABILITY SHALL BE STRICTLY LIMITED TO $50,000",
        },
      ],
    },
    {
      id: "msg-3",
      sender: "agent",
      text: "I cannot determine this based on the provided document.",
    },
    {
      id: "msg-4",
      sender: "agent",
      text: "Generating analysis...",
      isStreaming: true,
    },
  ];

  it("renders empty state with instructions", () => {
    const onSendMessage = vi.fn();
    render(
      <ChatInterface
        documentId="doc_1"
        documentFilename="contract.pdf"
        messages={[]}
        onSendMessage={onSendMessage}
        isGenerating={false}
        complexity="standard"
        onComplexityChange={vi.fn()}
        onCitationClick={vi.fn()}
      />
    );

    expect(screen.getByText(/Ask anything about this agreement/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Grounded with multi-agent reasoning, strict citations/i)
    ).toBeInTheDocument();
  });

  it("renders messages, handles complexity buttons, citation clicks, and question submission", () => {
    const onSendMessage = vi.fn();
    const onComplexityChange = vi.fn();
    const onCitationClick = vi.fn();

    render(
      <ChatInterface
        documentId="doc_1"
        documentFilename="contract.pdf"
        messages={sampleMessages}
        onSendMessage={onSendMessage}
        isGenerating={false}
        complexity="standard"
        onComplexityChange={onComplexityChange}
        onCitationClick={onCitationClick}
      />
    );

    // Complexity button
    const counselBtn = screen.getByRole("button", { name: /Counsel/i });
    fireEvent.click(counselBtn);
    expect(onComplexityChange).toHaveBeenCalledWith("counsel");

    // Citation click
    const citationBtn = screen.getByText(/Section 4 Limitation of Liability/i);
    fireEvent.click(citationBtn);
    expect(onCitationClick).toHaveBeenCalledWith(sampleMessages[1].citations![0]);

    // Negative verification notice
    expect(screen.getByText(/Deterministic Verification: Strict uncertainty rule triggered/i)).toBeInTheDocument();

    // Form submit
    const input = screen.getByLabelText(/Ask a legal question/i);
    fireEvent.change(input, { target: { value: "What about indemnification?" } });
    const sendBtn = screen.getByRole("button", { name: /Send Question/i });
    fireEvent.click(sendBtn);
    expect(onSendMessage).toHaveBeenCalledWith("What about indemnification?");
  });
});
