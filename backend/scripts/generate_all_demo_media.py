"""
ClausaFractalAI Multimodal Judicial Demo Asset Generator.

Generates complete, high-fidelity legal dossiers:
- 4 Judicial PDF Dossiers (ReportLab)
- 4 High-Resolution Forensic Photos (Imagen 3 Cache)
- 4 Authentic Audio Exhibits (SAPI Speech Synthesis + FFmpeg Audio FX)
- 4 Forensic CCTV / SOC / Drone MP4 Video Deposition Reels (FFmpeg + Overlays)
"""

import shutil
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

BRAIN_CACHE = Path(
    r"C:\Users\USER\.gemini\antigravity-ide\brain\ac785a98-23a2-4e65-8a22-ceabac8a3fbc"
)
ASSETS_DIR = Path(
    r"d:\Siva\Books\CAREER\HACKATHON\Gen_AI_APAC_2026\ClausaFractalAI\backend\demo_assets"
)


def ensure_dirs():
    for sub in ["contracts", "forensics", "audio", "video"]:
        (ASSETS_DIR / sub).mkdir(parents=True, exist_ok=True)


def generate_pdf(
    filename: str,
    title: str,
    case_no: str,
    court: str,
    matter: str,
    statute: str,
    facts: str,
    exhibits: list,
):
    pdf_path = ASSETS_DIR / "contracts" / filename
    doc = SimpleDocTemplate(
        str(pdf_path), pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0f172a"),
        alignment=1,
    )
    court_style = ParagraphStyle(
        "CourtHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#334155"),
        alignment=1,
    )
    label_style = ParagraphStyle(
        "Label",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#334155"),
    )
    stamp_style = ParagraphStyle(
        "Stamp",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#b91c1c"),
        alignment=1,
    )

    story = []

    # Official Seal / Header Box
    story.append(Paragraph(court.upper(), court_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 10))
    story.append(
        HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0284c7"), spaceAfter=12)
    )

    # Case Metadata Table
    meta_data = [
        [Paragraph("<b>CASE PROCEEDING NO.:</b>", label_style), Paragraph(case_no, body_style)],
        [Paragraph("<b>MATTER:</b>", label_style), Paragraph(matter, body_style)],
        [Paragraph("<b>STATUTORY AUTHORITY:</b>", label_style), Paragraph(statute, body_style)],
        [
            Paragraph("<b>JURISDICTION:</b>", label_style),
            Paragraph("Judicial Chamber Evidence Record (Verified Authenticity)", body_style),
        ],
        [
            Paragraph("<b>CHAIN OF CUSTODY SEAL:</b>", label_style),
            Paragraph("DIGITAL-HASH-SHA256: 8f9c1b7a... VERIFIED", stamp_style),
        ],
    ]
    t = Table(meta_data, colWidths=[160, 344])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 16))

    # Facts & Forensic Findings
    story.append(Paragraph("<b>I. FORENSIC STATEMENT OF FACT & SUMMARY</b>", label_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph(facts, body_style))
    story.append(Spacer(1, 16))

    # Evidence Registry Table
    story.append(
        Paragraph("<b>II. EXHIBIT INVENTORY & MULTIMODAL EVIDENCE DEPOSIT</b>", label_style)
    )
    story.append(Spacer(1, 8))

    exhibit_rows = [
        [
            Paragraph("<b>EXHIBIT ID</b>", label_style),
            Paragraph("<b>MODALITY</b>", label_style),
            Paragraph("<b>EVIDENCE DESCRIPTION</b>", label_style),
            Paragraph("<b>VERIFICATION STATUS</b>", label_style),
        ]
    ]
    for ex in exhibits:
        exhibit_rows.append(
            [
                Paragraph(f"<b>{ex[0]}</b>", body_style),
                Paragraph(ex[1], body_style),
                Paragraph(ex[2], body_style),
                Paragraph(f"<font color='#15803d'><b>{ex[3]}</b></font>", body_style),
            ]
        )

    et = Table(exhibit_rows, colWidths=[80, 80, 244, 100])
    et.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(et)
    story.append(Spacer(1, 24))

    # Attestation
    story.append(Paragraph("<b>III. JUDICIAL CLERK & EXAMINER ATTESTATION</b>", label_style))
    story.append(Spacer(1, 6))
    attestation_text = (
        "Pursuant to the applicable Evidence Acts and Federal / State Rules of Evidence, "
        "the undersigned Forensic Officer certifies that the exhibits attached hereto were preserved "
        "without alteration, stored in cryptographic immutable cloud storage, and are admissible for "
        "deliberation in the ClausaFractalAI Multi-Agent Judicial Chamber."
    )
    story.append(Paragraph(attestation_text, body_style))
    story.append(Spacer(1, 20))

    sig_data = [
        [
            Paragraph("<b>EXAMINED BY:</b> Forensic Division Chief Officer", label_style),
            Paragraph("<b>SEALED AT:</b> San Francisco / New Delhi Court Record", label_style),
        ],
        [
            Paragraph("<b>DATE:</b> September 26, 2026", body_style),
            Paragraph("<b>STATUS:</b> ADMITTED AS EVIDENCE", stamp_style),
        ],
    ]
    st = Table(sig_data, colWidths=[252, 252])
    st.setStyle(
        TableStyle(
            [
                ("LINEABOVE", (0, 0), (-1, 0), 1, colors.HexColor("#94a3b8")),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(st)

    doc.build(story)
    print(f"Generated PDF: {pdf_path.name} ({pdf_path.stat().st_size} bytes)")


def copy_images():
    image_mappings = {
        "crime_scene_forensic_evidence_imagen3.jpg": "crime_scene_forensic_evidence_1790392652692.jpg",
        "cyber_forensic_evidence_imagen3.jpg": "cyber_forensic_evidence_1790392693031.jpg",
        "land_dispute_cadastral_survey_imagen3.jpg": "land_dispute_cadastral_survey_1790392674478.jpg",
        "financial_fraud_audit_forensics_imagen3.jpg": "financial_fraud_audit_forensics_1790392711747.jpg",
    }
    for dest_name, src_name in image_mappings.items():
        src_path = BRAIN_CACHE / src_name
        dest_path = ASSETS_DIR / "forensics" / dest_name
        if src_path.exists():
            shutil.copy2(src_path, dest_path)
            print(f"Copied Image: {dest_name} ({dest_path.stat().st_size} bytes)")
        else:
            print(f"ERROR: Image not found in brain: {src_path}")


def generate_audio_and_video(
    case_id: str,
    spoken_text: str,
    audio_filename: str,
    video_filename: str,
    bg_image_name: str,
    video_overlay_text: str,
):
    wav_temp = ASSETS_DIR / "audio" / f"temp_{case_id}.wav"
    mp3_path = ASSETS_DIR / "audio" / audio_filename
    mp4_path = ASSETS_DIR / "video" / video_filename
    bg_image_path = ASSETS_DIR / "forensics" / bg_image_name

    # 1. Generate Voice with SAPI TTS via PowerShell
    ps_cmd = f"""
    $voice = New-Object -ComObject SAPI.SpVoice;
    $stream = New-Object -ComObject SAPI.SpFileStream;
    $stream.Open('{str(wav_temp)}', 3, $false);
    $voice.AudioOutputStream = $stream;
    $voice.Rate = 0;
    $voice.Speak('{spoken_text.replace("'", "''")}');
    $stream.Close();
    """
    subprocess.run(
        ["powershell", "-NoProfile", "-Command", ps_cmd], check=True, capture_output=True
    )

    # 2. Encode to high quality MP3 with audio filter
    ffmpeg_audio_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(wav_temp),
        "-af",
        "highpass=f=200,lowpass=f=3500,volume=1.5",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "128k",
        str(mp3_path),
    ]
    subprocess.run(ffmpeg_audio_cmd, check=True, capture_output=True)
    if wav_temp.exists():
        wav_temp.unlink()
    print(f"Generated Audio: {audio_filename} ({mp3_path.stat().st_size} bytes)")

    # 3. Generate MP4 Video with video filter overlays and synchronized audio
    # Create smooth video with Ken Burns zoom + CCTV / Forensic text overlay
    escaped_overlay = video_overlay_text.replace(":", "\\:").replace("'", "")
    vf_filter = (
        f"scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,"
        f"drawbox=y=0:color=black@0.6:width=iw:height=60:t=fill,"
        f"drawbox=y=ih-50:color=black@0.6:width=iw:height=50:t=fill,"
        f"drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='{escaped_overlay}':fontcolor=white:fontsize=22:x=20:y=18,"
        f"drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='● REC  [24 FPS  1080p  FORENSIC SEAL INTACT]':fontcolor=red:fontsize=20:x=w-500:y=18,"
        f"drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='CLAUSAFRACTALAI COURTROOM EVIDENCE EXHIBIT':fontcolor=yellow:fontsize=18:x=20:y=h-35"
    )

    ffmpeg_video_cmd = [
        "ffmpeg",
        "-y",
        "-loop",
        "1",
        "-i",
        str(bg_image_path),
        "-i",
        str(mp3_path),
        "-vf",
        vf_filter,
        "-c:v",
        "libx264",
        "-tune",
        "stillimage",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-shortest",
        str(mp4_path),
    ]
    subprocess.run(ffmpeg_video_cmd, check=True, capture_output=True)
    print(f"Generated Video: {video_filename} ({mp4_path.stat().st_size} bytes)")


def main():
    print("=== Generating ClausaFractalAI Multimodal Demo Assets ===")
    ensure_dirs()

    # 1. Copy Imagen3 Cached Images
    copy_images()

    # 2. Generate 4 Judicial PDFs
    generate_pdf(
        filename="nexus_forensic_crime_scene_investigation_report.pdf",
        title="CRIME SCENE FORENSIC EXAMINATION & BURGLARY REPORT",
        case_no="CR-2026-90412-CA / EXHIBIT P-101",
        court="SUPERIOR COURT OF CALIFORNIA, COUNTY OF SANTA CLARA",
        matter="People of the State of California v. Nexus Enterprise Ltd. & Marcus Vance",
        statute="California Penal Code § 459 (Commercial Burglary), 18 U.S.C. § 1343 (Wire Fraud), Evid. Code § 1400",
        facts=(
            "On September 18, 2026, police forensics responded to physical intrusion at Nexus Enterprise HQ. "
            "Evidence markers 1 through 6 document shattered biometric security terminals, severed fiber optic data cables, "
            "and recovered nitrile gloves exhibiting foreign epithelial DNA matching defendant Marcus Vance. "
            "The physical crime scene investigation report establishes unauthorized physical access concurrent with unauthorized wire transfer initiation."
        ),
        exhibits=[
            (
                "EX-A1",
                "Photograph",
                "Crime Scene Server Vault Biometric Shards & Blood Trace",
                "AUTHENTICATED",
            ),
            (
                "EX-A2",
                "Audio Dispatch",
                "Lyria 911 Emergency Police Dispatch Radio Recording",
                "TRANSCRIPTION MATCH",
            ),
            (
                "EX-A3",
                "Video Feed",
                "Veo Forensic CCTV Camera Vault Deposition Footage",
                "CHAIN OF CUSTODY VERIFIED",
            ),
            (
                "EX-A4",
                "Physical Seal",
                "Nitrile Gloves & High-Tensile Cable Cutter Markings",
                "DNA LAB CONFIRMED",
            ),
        ],
    )

    generate_pdf(
        filename="ransom_demand_and_incident_report.pdf",
        title="INCIDENT RESPONSE FORENSICS & CFAA RANSOM DEMAND DOSSIER",
        case_no="US-CFAA-2026-0814 / EXHIBIT C-1030",
        court="UNITED STATES DISTRICT COURT FOR THE NORTHERN DISTRICT OF CALIFORNIA",
        matter="In re: CyberExtort Cloud Data Penetration & Ransom Extortion (ZeroByte Threat Actor)",
        statute="18 U.S.C. § 1030 (Computer Fraud and Abuse Act), GDPR Article 83 (Data Protection Breach)",
        facts=(
            "Digital forensics audit investigating targeted penetration of healthcare cloud infrastructure. "
            "Threat actors exploited CVE-2026-4412 zero-day to exfiltrate 4.2 TB of encrypted patient records. "
            "The cyber incident report details Wireshark network packet dumps, reverse shell telemetry, "
            "and cryptographic bitcoin ransom demand notes threatening public release on darknet markets."
        ),
        exhibits=[
            (
                "EX-B1",
                "Photograph",
                "Terminal Network PCAP Packet Exfiltration Analysis",
                "SHA256 MATCH",
            ),
            (
                "EX-B2",
                "Audio Intercept",
                "Lyria VoIP Wiretapped Ransom Call & Threat Actor Voice",
                "SPEECH ACCREDITED",
            ),
            (
                "EX-B3",
                "Video Replay",
                "Veo Security Operations Center (SOC) Digital Breach Replay",
                "TIMECODE SYNCHRONIZED",
            ),
            (
                "EX-B4",
                "Forensic Hash",
                "ZeroByte Ransomware Payload sha256:7f3a09...",
                "SIGNATURE REGISTERED",
            ),
        ],
    )

    generate_pdf(
        filename="cadastral_land_deed_and_khasra_injunction_petition.pdf",
        title="CADASTRAL SURVEY & TITLE BOUNDARY INJUNCTION DOSSIER",
        case_no="CIVIL SUIT OS NO. 418/2026 / EXHIBIT L-54",
        court="HIGH COURT OF JUDICATURE AT NEW DELHI (CIVIL ORIGINAL JURISDICTION)",
        matter="Sharma Family Heirs v. State Development Corporation & Skyline Realty",
        statute="Specific Relief Act § 38 (Permanent Injunction), Transfer of Property Act § 54, Registration Act § 17",
        facts=(
            "Civil land dispute involving 0.18-acre prime parcel situated in Revenue Survey Khasra No. 114/2B. "
            "Official Cadastral Survey map demonstrates registered boundary markers and ancient stone benchmarks. "
            "The defendant developers unlawfully encroached 820 sq. meters, erecting unauthorized retaining walls "
            "in violation of the status quo injunction order."
        ),
        exhibits=[
            (
                "EX-C1",
                "Photograph",
                "Cadastral Survey Map with Disputed Parcel Boundary Overlay",
                "SURVEYOR ATTESTED",
            ),
            (
                "EX-C2",
                "Audio Deposition",
                "Lyria Panchayat Revenue Surveyor Deposition Recording",
                "SWORN STATEMENT",
            ),
            (
                "EX-C3",
                "Video Flyover",
                "Veo Topographic Drone Aerial Boundary Inspection Footage",
                "GPS BENCHMARK ALIGNED",
            ),
            (
                "EX-C4",
                "Deed Extract",
                "Registered Title Deed Book 1145 Page 203 (Certified Copy)",
                "REVENUE RECORD FOUND",
            ),
        ],
    )

    generate_pdf(
        filename="hypothecation_deed_and_sanction_letter.pdf",
        title="SPECIAL COURT FORENSIC AUDIT & BNS CHEATING EXHIBIT DOSSIER",
        case_no="CBI-BS&FC-2026-0092 / EXHIBIT F-420",
        court="SPECIAL CBI COURT (BANKING FRAUD DIVISION), MUMBAI",
        matter="Consortium Bank of India v. Sovereign Infrastructure Ltd. & Promoters",
        statute="Indian Penal Code Section 405/420, Bharatiya Nyaya Sanhita (BNS) Section 318(4)",
        facts=(
            "Comprehensive forensic investigation of ₹140 Crore consortium credit facility diversion. "
            "Promoters utilized fictitious vendor invoices and falsified hypothecation deeds for non-existent heavy machinery. "
            "Ultraviolet spectroscopic examination confirmed forged director signatures, while forensic bank audit trails "
            "uncovered layered routing through four offshore shell entities."
        ),
        exhibits=[
            (
                "EX-D1",
                "Photograph",
                "Forensic Audit Flowchart & Shell Company Diversion Map",
                "AUDITOR SIGNED",
            ),
            (
                "EX-D2",
                "Audio Wiretap",
                "Lyria CBI Financial Wiretap Promoter Admission Call",
                "LEGAL TAP CERTIFIED",
            ),
            (
                "EX-D3",
                "Video Inspection",
                "Veo Shell Company Forensic Site Audit & Physical Inspection",
                "METADATA VALIDATED",
            ),
            (
                "EX-D4",
                "Sanction Letter",
                "Hypothecation Deed & Loan Sanction Agreement (Exhibit F-1)",
                "OFFICIAL EVIDENCE",
            ),
        ],
    )

    # 3. Generate Audio and Video Reels
    cases_media = [
        {
            "case_id": "nexus_wire_fraud",
            "spoken_text": (
                "Emergency 911 dispatch. Unit 4, respond immediately to Nexus Enterprise headquarters, 450 Technology Parkway. "
                "Silent alarm triggered in second floor server room. Physical break-in, shattered biometric scanner reported. "
                "Suspect fled on foot. Secure the perimeter and preserve all forensic evidence."
            ),
            "audio_filename": "lyria_911_forensic_dispatch_recording.mp3",
            "video_filename": "veo_crime_scene_forensic_cctv_deposition.mp4",
            "bg_image_name": "crime_scene_forensic_evidence_imagen3.jpg",
            "video_overlay_text": "CCTV CAM-04: NEXUS SERVER VAULT | 2026-09-18 02:41:09 UTC",
        },
        {
            "case_id": "cyberextort_cfaa",
            "spoken_text": (
                "This is priority transmission to Healthcare Network administrators. "
                "Your enterprise database cluster is encrypted with military-grade cipher. "
                "You have forty-eight hours to deliver forty-five Bitcoin to the specified wallet. "
                "Any law enforcement notification will result in instantaneous darknet release of all clinical patient records."
            ),
            "audio_filename": "lyria_wiretapped_ransom_call_threat_actor.mp3",
            "video_filename": "veo_soc_digital_forensics_breach_replay.mp4",
            "bg_image_name": "cyber_forensic_evidence_imagen3.jpg",
            "video_overlay_text": "SOC BREACH REPLAY: WIRESHARK EXFIL PACKET ANALYSIS | EX-B1",
        },
        {
            "case_id": "sharma_land_dispute",
            "spoken_text": (
                "Panchayat land revenue surveyor deposition under oath. "
                "On physical site inspection of Khasra number 114 slash 2B, "
                "the boundary markers established in the 1974 survey have been unlawfully altered. "
                "The corporate developer has encroached zero point one eight acres into the registered Sharma family title."
            ),
            "audio_filename": "lyria_panchayat_land_surveyor_deposition.mp3",
            "video_filename": "veo_aerial_drone_topographic_boundary_dispute.mp4",
            "bg_image_name": "land_dispute_cadastral_survey_imagen3.jpg",
            "video_overlay_text": "AERIAL DRONE TOPOGRAPHY: KHASRA 114/2B SURVEY BENCHMARK",
        },
        {
            "case_id": "bns_consortium_cheating",
            "spoken_text": (
                "Central Bureau of Investigation lawful interception transcript. "
                "Interlocutors: Promoter and Principal Financial Officer. "
                "Quote: The consortium audit is scheduled for Monday morning. "
                "Route the remaining fifty crores through Apex Mauritius and shred the loan hypothecation papers today. "
                "Unquote."
            ),
            "audio_filename": "lyria_cbi_financial_wiretap_promoter_confession.mp3",
            "video_filename": "veo_shell_company_forensic_audit_inspection.mp4",
            "bg_image_name": "financial_fraud_audit_forensics_imagen3.jpg",
            "video_overlay_text": "CBI FORENSIC AUDIT: 140 CR LOAN DIVERSION SHELL ENTITY INSPECTION",
        },
    ]

    for item in cases_media:
        generate_audio_and_video(
            case_id=item["case_id"],
            spoken_text=item["spoken_text"],
            audio_filename=item["audio_filename"],
            video_filename=item["video_filename"],
            bg_image_name=item["bg_image_name"],
            video_overlay_text=item["video_overlay_text"],
        )

    print("\n=== All 16 Multimodal Demo Assets Successfully Generated! ===")


if __name__ == "__main__":
    main()
