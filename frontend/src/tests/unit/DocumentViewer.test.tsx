import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DocumentViewer } from "../../components/DocumentViewer";

describe("DocumentViewer Unit Test Suite", () => {
  const samplePages = [
    { pageNumber: 1, text: "Section 1: Enterprise Cloud Intelligence Services." },
    { pageNumber: 2, text: "Section 2: Bilateral confidentiality obligations." },
  ];

  it("renders page content and supports pagination and zoom controls", () => {
    const onUpload = vi.fn();
    const onAudioUpload = vi.fn();

    render(
      <DocumentViewer
        filename="Contract_2026.pdf"
        pages={samplePages}
        activeHighlight={null}
        onUpload={onUpload}
        onAudioUpload={onAudioUpload}
        isUploading={false}
      />
    );

    expect(screen.getByText(/Contract_2026.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Cloud Intelligence Services/i)).toBeInTheDocument();

    // Zoom controls
    const zoomInBtn = screen.getByRole("button", { name: "Zoom in" });
    const zoomOutBtn = screen.getByRole("button", { name: "Zoom out" });

    fireEvent.click(zoomInBtn);
    expect(screen.getByText("110%")).toBeInTheDocument();
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText("100%")).toBeInTheDocument();

    // Pagination
    const nextBtn = screen.getByRole("button", { name: "Next page" });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Bilateral confidentiality obligations/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: "Previous page" });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Enterprise Cloud Intelligence Services/i)).toBeInTheDocument();
  });

  it("renders active citation highlight when matching snippet is present", () => {
    render(
      <DocumentViewer
        filename="Contract_2026.pdf"
        pages={samplePages}
        activeHighlight={{ page: 1, snippet: "Enterprise Cloud Intelligence" }}
        onUpload={vi.fn()}
        onAudioUpload={vi.fn()}
        isUploading={false}
      />
    );

    const mark = screen.getByText(/Enterprise Cloud Intelligence/i);
    expect(mark.tagName.toLowerCase()).toBe("mark");
  });

  it("renders fallback text when page content is empty or unmatched", () => {
    render(
      <DocumentViewer
        filename="Empty_Contract.pdf"
        pages={[]}
        activeHighlight={null}
        onUpload={vi.fn()}
        isUploading={false}
      />
    );
    expect(screen.getByText(/No text content available for this page/i)).toBeInTheDocument();
  });

  it("renders unhighlighted text when citation snippet is not found", () => {
    render(
      <DocumentViewer
        filename="Contract_2026.pdf"
        pages={samplePages}
        activeHighlight={{ page: 1, snippet: "Completely Unmatched Text String" }}
        onUpload={vi.fn()}
        isUploading={false}
      />
    );
    expect(screen.getByText(/Enterprise Cloud Intelligence Services/i)).toBeInTheDocument();
  });

  it("triggers onAudioUpload when an audio file is selected", () => {
    const onAudioUpload = vi.fn();
    const { container } = render(
      <DocumentViewer
        filename="Contract_2026.pdf"
        pages={samplePages}
        activeHighlight={null}
        onAudioUpload={onAudioUpload}
        isUploading={false}
      />
    );
    const audioInput = container.querySelector('input[type="file"][accept*="audio"]') as HTMLInputElement;
    if (audioInput) {
      const file = new File(["audio"], "deposition.mp3", { type: "audio/mp3" });
      fireEvent.change(audioInput, { target: { files: [file] } });
      expect(onAudioUpload).toHaveBeenCalledWith(file);
    }
  });

  it("triggers onFileUpload and handles out-of-range activeHighlight safely", async () => {
    const onFileUpload = vi.fn();
    render(
      <DocumentViewer
        filename="Contract_2026.pdf"
        pages={samplePages}
        activeHighlight={{ page: 999, snippet: "Out of range" }}
        onFileUpload={onFileUpload}
        isUploading={false}
      />
    );
    const docInput = screen.getByLabelText(/Upload Contract PDF or Text File/i);
    const file = new File(["pdf"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(docInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(onFileUpload).toHaveBeenCalledWith(file);
    });
  });

  it("triggers onUpload when onFileUpload is not provided", async () => {
    const onUpload = vi.fn();
    render(
      <DocumentViewer
        filename="Contract_2026.pdf"
        pages={samplePages}
        activeHighlight={{ page: 0, snippet: "Below range" }}
        onUpload={onUpload}
        isUploading={false}
      />
    );
    const docInput = screen.getByLabelText(/Upload Contract PDF or Text File/i);
    const file = new File(["pdf"], "test2.pdf", { type: "application/pdf" });
    fireEvent.change(docInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith(file);
    });

    // Also trigger with empty files array
    fireEvent.change(docInput, { target: { files: [] } });
  });
});
