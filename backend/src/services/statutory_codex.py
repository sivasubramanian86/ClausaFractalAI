"""Statutory Codex Service for global penal, commercial, civil, and cyber law sections.

Provides a structured, searchable catalog of statutory provisions across multiple
jurisdictions (Indian Penal Code/Bharatiya Nyaya Sanhita, US Code/UCC, UK Common Law,
and EU Regulations) with required legal elements, tests, precedents, and penalties.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class StatutorySection(BaseModel):
    """Data model representing a codified statutory provision."""

    code_id: str = Field(description="Unique code identifier e.g. IPC-420, BNS-318, USC-18-1343")
    title: str = Field(description="Short title or offense name")
    jurisdiction: str = Field(description="Governing jurisdiction")
    category: str = Field(description="Legal domain e.g. Criminal, Contract, Cyber, IP")
    elements: List[str] = Field(description="Mandatory legal elements that must be proven")
    penalties: str = Field(description="Statutory sentencing or damage threshold")
    precedents: List[str] = Field(description="Landmark precedent cases interpreting the section")
    statutory_test: str = Field(description="Core legal test e.g. Mens Rea + Actus Reus")


class StatutoryCodexService:
    """In-memory indexed codex providing global legal and criminal sections at fingertips."""

    def __init__(self) -> None:
        """Initialize the statutory codex catalog with curated global statutory provisions."""
        self._catalog: List[StatutorySection] = [
            StatutorySection(
                code_id="IPC-420 / BNS-318(4)",
                title="Cheating and Dishonestly Inducing Delivery of Property",
                jurisdiction="India (IPC / BNS)",
                category="Criminal / Fraud",
                elements=[
                    "Deception of any person",
                    (
                        "Fraudulent or dishonest inducement to deliver property or make/alter a"
                        " valuable security"
                    ),
                    (
                        "Intentional causation of damage or harm in body, mind, reputation, or"
                        " property"
                    ),
                ],
                penalties="Imprisonment up to 7 years and fine",
                precedents=[
                    "Hridaya Ranjan Prasad Verma v. State of Bihar (2000)",
                    "S.W. Palanitkar v. State of Bihar (2002)",
                ],
                statutory_test=(
                    "Fraudulent intention must exist at the inception of the transaction."
                ),
            ),
            StatutorySection(
                code_id="IPC-405 / BNS-316",
                title="Criminal Breach of Trust",
                jurisdiction="India (IPC / BNS)",
                category="Criminal / Breach of Trust",
                elements=[
                    "Entrustment with property or dominion over property",
                    "Dishonest misappropriation or conversion to own use",
                    "Dishonest use or disposal in violation of legal direction or contract",
                ],
                penalties=(
                    "Imprisonment up to 3 years, or fine, or both (aggravated up to 7 or 10 years)"
                ),
                precedents=[
                    "Jaswantrai Manilal Akhaney v. State of Bombay (1956)",
                    "Chelloor Mankkal Narayan v. Travancore (1952)",
                ],
                statutory_test=(
                    "Existence of fiduciary entrustment followed by dishonest conversion."
                ),
            ),
            StatutorySection(
                code_id="IPC-463 / BNS-336",
                title="Forgery and Fraudulent Record Alteration",
                jurisdiction="India (IPC / BNS)",
                category="Criminal / Forgery",
                elements=[
                    "Making any false document or electronic record or part thereof",
                    "Intent to cause damage or injury to the public or any person",
                    (
                        "Intent to support any claim or title or induce any person to part with"
                        " property"
                    ),
                ],
                penalties="Imprisonment up to 2 years, or fine, or both (aggravated up to 7 years)",
                precedents=[
                    "Sheila Sebastian v. R. Jawaharaj (2018)",
                    "Ram Narayan Popli v. CBI (2003)",
                ],
                statutory_test=(
                    "Document must be made with intent to deceive and cause legal injury."
                ),
            ),
            StatutorySection(
                code_id="USC-18-1343",
                title="Federal Wire Fraud",
                jurisdiction="United States (Federal)",
                category="Criminal / Federal Fraud",
                elements=[
                    (
                        "Participation in a scheme to defraud or obtain money/property by false"
                        " pretenses"
                    ),
                    "Knowing and willful intent to defraud",
                    (
                        "Transmission of wire, radio, or television communications in interstate"
                        " commerce"
                    ),
                ],
                penalties=(
                    "Up to 20 years imprisonment (up to 30 years if affecting financial"
                    " institution) and fines"
                ),
                precedents=[
                    "Neder v. United States (1999)",
                    "Kelly v. United States (2020)",
                ],
                statutory_test=(
                    "Scheme requires material misrepresentation transmitted via interstate wire."
                ),
            ),
            StatutorySection(
                code_id="USC-18-1030",
                title="Computer Fraud and Abuse Act (CFAA) - Unauthorized Access",
                jurisdiction="United States (Federal)",
                category="Cybercrime & Privacy",
                elements=[
                    "Intentionally accessing a protected computer",
                    "Access without authorization or exceeding authorized access",
                    "Obtaining information, causing damage, or furthering fraud",
                ],
                penalties="Fine and imprisonment up to 1 to 10 years (aggravated up to 20 years)",
                precedents=[
                    "Van Buren v. United States (2021)",
                    "hiQ Labs, Inc. v. LinkedIn Corp. (2022)",
                ],
                statutory_test=(
                    "Gates-up vs gates-down: Accessing unauthorized folders or databases."
                ),
            ),
            StatutorySection(
                code_id="UCC-2-302",
                title="Unconscionable Contract or Clause",
                jurisdiction="United States (Uniform Commercial Code)",
                category="Contracts / Commercial",
                elements=[
                    "Procedural unconscionability: absence of meaningful choice or unfair surprise",
                    "Substantive unconscionability: terms unreasonably favorable to one party",
                    "Gross inequality of bargaining power at time of contract formation",
                ],
                penalties=(
                    "Court may refuse to enforce contract, sever clause, or limit application"
                ),
                precedents=[
                    "Williams v. Walker-Thomas Furniture Co. (1965)",
                    "Zapatha v. Dairy Mart, Inc. (1980)",
                ],
                statutory_test=(
                    "Dual requirement: procedural defect plus overly one-sided substantive"
                    " oppression."
                ),
            ),
            StatutorySection(
                code_id="GDPR-Article-83",
                title="General Conditions for Imposing Administrative Fines (Data Breach)",
                jurisdiction="European Union (GDPR)",
                category="Cybercrime & Privacy",
                elements=[
                    "Infringement of fundamental principles relating to processing (Art 5, 6, 9)",
                    "Failure to implement technical and organizational measures (Art 25, 32)",
                    "Intentional or negligent character of the infringement",
                ],
                penalties=(
                    "Up to 20,000,000 EUR or 4% of total worldwide annual turnover of previous"
                    " financial year"
                ),
                precedents=[
                    "Meta Ireland Penalty Decisions (EDPB 2023)",
                    "Amazon Europe Core Decision (CNPD 2021)",
                ],
                statutory_test=(
                    "Proportionality, dissuasiveness, and degree of responsibility test."
                ),
            ),
            StatutorySection(
                code_id="UK-CRA-2015-S62",
                title="Requirement for Contract Terms and Notices to be Fair",
                jurisdiction="United Kingdom (Common Law)",
                category="Contracts / Commercial",
                elements=[
                    "Term contrary to requirement of good faith",
                    (
                        "Causes a significant imbalance in parties' rights and obligations to"
                        " consumer detriment"
                    ),
                    "Term is non-negotiated and opaque or ambiguous",
                ],
                penalties="Unfair term is non-binding on the consumer",
                precedents=[
                    "Director General of Fair Trading v. First National Bank (2001)",
                    "ParkingEye Ltd v. Beavis (2015)",
                ],
                statutory_test="Good faith assessment and consumer detriment balance test.",
            ),
            StatutorySection(
                code_id="IPC-300 / BNS-101",
                title="Murder and Culpable Homicide",
                jurisdiction="India (IPC / BNS)",
                category="Homicide / Violent Crimes",
                elements=[
                    "Act done with intention of causing death",
                    (
                        "Act done with intention of causing bodily injury sufficient in ordinary"
                        " course of nature to cause death"
                    ),
                    (
                        "Knowledge that act is so imminently dangerous that it must in all"
                        " probability cause death"
                    ),
                ],
                penalties="Death or imprisonment for life, and liability to fine",
                precedents=[
                    "Virsa Singh v. State of Punjab (1958)",
                    "K.M. Nanavati v. State of Maharashtra (1962)",
                ],
                statutory_test=(
                    "Virsa Singh four-point test for bodily injury sufficient in ordinary course."
                ),
            ),
            StatutorySection(
                code_id="USC-17-501",
                title="Copyright Infringement",
                jurisdiction="United States (Federal / IP)",
                category="Intellectual Property",
                elements=[
                    "Ownership of a valid copyright",
                    "Copying of constituent elements of the work that are original",
                    "Substantial similarity between protected elements and accused work",
                ],
                penalties=(
                    "Statutory damages up to $150,000 per willful work, injunction, actual"
                    " damages/profits"
                ),
                precedents=[
                    "Feist Publications, Inc. v. Rural Tel. Serv. Co. (1991)",
                    "Campbell v. Acuff-Rose Music, Inc. (1994)",
                ],
                statutory_test=(
                    "Extrinsic and intrinsic tests for substantial similarity + fair use defense."
                ),
            ),
            StatutorySection(
                code_id="TORT-NEGLIGENCE-COMMON-LAW",
                title="Actionable Tort of Negligence & Breach of Duty of Care",
                jurisdiction="General Common Law (UK / US / Commonwealth)",
                category="Tort / Negligence",
                elements=[
                    "Existence of a legal duty of care owed by defendant to plaintiff",
                    "Breach of that duty by falling below reasonable person standard",
                    "Causation: 'But for' factual cause and proximate legal cause",
                    "Actual legally recognized damages suffered",
                ],
                penalties="Compensatory, special, and punitive damages",
                precedents=[
                    "Donoghue v. Stevenson (1932)",
                    "Caparo Industries plc v. Dickman (1990)",
                    "Palsgraf v. Long Island Railroad Co. (1928)",
                ],
                statutory_test=(
                    "Caparo tripartite test: foreseeability, proximity, and fair/just/reasonable."
                ),
            ),
            StatutorySection(
                code_id="IPC-499 / BNS-356",
                title="Defamation and Libel",
                jurisdiction="India (IPC / BNS)",
                category="Criminal / Reputation",
                elements=[
                    "Making or publishing any imputation concerning any person",
                    "Imputation made by words, signs, or visible representations",
                    "Intending to harm or knowing/having reason to believe it will harm reputation",
                ],
                penalties="Simple imprisonment up to 2 years, or fine, or both",
                precedents=[
                    "Subramanian Swamy v. Union of India (2016)",
                    "Chaman Lal v. State of Punjab (1970)",
                ],
                statutory_test=(
                    "Publication of derogatory statement without recognized statutory exceptions."
                ),
            ),
        ]

    def list_all_sections(self) -> List[StatutorySection]:
        """Retrieve all codified sections in the catalog.

        Returns:
            List of all StatutorySection objects.
        """
        return list(self._catalog)

    def get_section_by_id(self, code_id: str) -> Optional[StatutorySection]:
        """Look up a specific statutory section by its code identifier.

        Args:
            code_id: Section identifier such as 'IPC-420 / BNS-318(4)' or 'USC-18-1343'.

        Returns:
            The matching StatutorySection, or None if not found.
        """
        clean_id = code_id.strip().lower()
        for sec in self._catalog:
            if clean_id in sec.code_id.lower():
                return sec
        return None

    def search_sections(
        self,
        query: str,
        category: Optional[str] = None,
        jurisdiction: Optional[str] = None,
    ) -> List[StatutorySection]:
        """Search sections by free text, category, and jurisdiction filters.

        Args:
            query: Free text keyword to search in titles, descriptions, elements, and tests.
            category: Optional category filter.
            jurisdiction: Optional jurisdiction filter.

        Returns:
            Filtered list of matching StatutorySection instances.
        """
        q = query.strip().lower()
        results: List[StatutorySection] = []

        for sec in self._catalog:
            if category and category.lower() not in sec.category.lower():
                continue
            if jurisdiction and jurisdiction.lower() not in sec.jurisdiction.lower():
                continue

            if not q:
                results.append(sec)
                continue

            match = (
                q in sec.code_id.lower()
                or q in sec.title.lower()
                or q in sec.category.lower()
                or q in sec.statutory_test.lower()
                or any(q in elem.lower() for elem in sec.elements)
                or any(q in prec.lower() for prec in sec.precedents)
            )
            if match:
                results.append(sec)

        return results

    def match_evidence_to_sections(self, evidence_text: str) -> List[Dict[str, Any]]:
        """Analyze evidence text and identify potential statutory violations or sections.

        Args:
            evidence_text: Description of facts, charges, breach, or evidence transcript.

        Returns:
            List of dictionaries containing matched section details and confidence score.
        """
        if not evidence_text or not evidence_text.strip():
            return []

        text_lower = evidence_text.lower()
        matches: List[Dict[str, Any]] = []

        heuristics: List[Dict[str, Any]] = [
            {
                "keywords": [
                    "cheat",
                    "dishonest",
                    "induce",
                    "deceive",
                    "delivery of property",
                    "swindle",
                ],
                "code_id": "IPC-420 / BNS-318(4)",
            },
            {
                "keywords": [
                    "entrust",
                    "breach of trust",
                    "misappropriat",
                    "conversion",
                    "fiduciary",
                ],
                "code_id": "IPC-405 / BNS-316",
            },
            {
                "keywords": [
                    "forg",
                    "false document",
                    "alter document",
                    "counterfeit",
                    "fake signature",
                ],
                "code_id": "IPC-463 / BNS-336",
            },
            {
                "keywords": [
                    "wire fraud",
                    "interstate",
                    "scheme to defraud",
                    "false pretenses",
                    "email scam",
                ],
                "code_id": "USC-18-1343",
            },
            {
                "keywords": [
                    "unauthorized access",
                    "computer fraud",
                    "cfaa",
                    "hacked",
                    "stolen credentials",
                    "data breach",
                ],
                "code_id": "USC-18-1030",
            },
            {
                "keywords": [
                    "unconscionable",
                    "one-sided",
                    "unequal bargaining",
                    "oppressive clause",
                    "ucc",
                ],
                "code_id": "UCC-2-302",
            },
            {
                "keywords": [
                    "gdpr",
                    "personal data",
                    "data protection",
                    "unlawful processing",
                    "fine",
                ],
                "code_id": "GDPR-Article-83",
            },
            {
                "keywords": [
                    "unfair term",
                    "consumer rights",
                    "cra 2015",
                    "good faith",
                    "consumer contract",
                ],
                "code_id": "UK-CRA-2015-S62",
            },
            {
                "keywords": ["murder", "death", "bodily injury", "homicide", "fatal", "killed"],
                "code_id": "IPC-300 / BNS-101",
            },
            {
                "keywords": [
                    "copyright",
                    "infringement",
                    "substantial similarity",
                    "copied work",
                    "fair use",
                ],
                "code_id": "USC-17-501",
            },
            {
                "keywords": [
                    "negligence",
                    "duty of care",
                    "breach of duty",
                    "proximate cause",
                    "damages",
                    "tort",
                ],
                "code_id": "TORT-NEGLIGENCE-COMMON-LAW",
            },
            {
                "keywords": [
                    "defamation",
                    "slander",
                    "libel",
                    "reputation",
                    "imputation",
                    "defame",
                ],
                "code_id": "IPC-499 / BNS-356",
            },
        ]

        for item in heuristics:
            matching_kw = [kw for kw in item["keywords"] if kw in text_lower]
            if matching_kw:
                sec = self.get_section_by_id(item["code_id"])
                if sec:
                    confidence = min(0.95, 0.50 + (len(matching_kw) * 0.15))
                    matches.append(
                        {
                            "section": sec.model_dump(),
                            "confidence": round(confidence, 2),
                            "matched_keywords": matching_kw,
                            "statutory_test": sec.statutory_test,
                        }
                    )

        matches.sort(key=lambda x: x["confidence"], reverse=True)
        return matches
