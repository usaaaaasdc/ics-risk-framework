"""Version 1.0-p0: capture-scoped observations, deliberately NOT durable inventory."""

from typing import Literal, TypedDict

JobState = Literal[
    "QUEUED", "PROCESSING", "COMPLETED", "PARTIAL", "FAILED", "CANCELLED"
]
Classification = Literal["unvalidated_capture", "synthetic_fixture"]


class EvidenceRef(TypedDict):
    captureSha256: str
    analysisProfileSha256: str
    nativeLog: str
    nativeRow: int
    nativeFlowId: str
    packetOrdinals: None


class Endpoint(TypedDict):
    ip: str
    port: int


class ProtocolObservation(TypedDict):
    id: str
    basis: Literal["observed"]
    protocol: Literal["modbus/tcp"]
    decoder: dict
    observedAt: str
    timestampSemantics: Literal["pdu-observed"]
    sourceEpochSeconds: float
    source: Endpoint
    destination: Endpoint
    flowId: str
    transactionId: int | None
    unitId: int | None
    functionCode: int | None
    functionName: str | None
    direction: Literal["request", "response", "unknown"]
    operation: Literal["read", "write", "unknown"]
    authorization: Literal["not_evaluated"]
    identityVerified: Literal[False]
    evidence: EvidenceRef
    uncertainty: list[str]


class AnalysisResult(TypedDict):
    schemaVersion: Literal["1.0-p0"]
    siteId: str
    sensorId: None
    dataClassification: Classification
    sourceMode: Literal["pcap-import"]
    analysisProfile: dict
    captureJob: dict
    assets: list[dict]  # capture-scoped endpoints; unknown physical identity
    flows: list[dict]
    protocolObservations: list[ProtocolObservation]
    transactions: list[dict]
    findings: list  # always empty; P0 applies no detection policy
    alerts: list
    quality: dict


class JobSnapshot(TypedDict):
    id: str
    state: JobState
    history: list[JobState]
    diagnostics: list[str]
    result: AnalysisResult | None
    exitCode: int | None
    artifacts: list[dict]
