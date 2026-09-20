import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
});
