# MarineGuard AI

## Agentic AI Community-Driven Marine Environmental Monitoring & Decision Support

**Hackathon:** Tanmiyathon 2026 — تنمية ثون 2026  
**Challenge:** Community-Driven Marine Environmental Monitoring  
**Arabic Challenge:** رصد صحة البيئات البحرية بمشاركة مجتمعية

---

## 1. Overview

MarineGuard AI is an agentic platform for community-driven marine environmental monitoring and decision support.

The platform combines:

- Community reports and photos
- Geographic location
- AI image analysis
- IoT-ready sensor data
- Historical observations
- Community report frequency
- GIS
- Explainable priority scoring
- Recommendations
- Human and field verification

The goal is not to diagnose ocean health from a single image.

Instead, MarineGuard AI combines multiple available sources of evidence and helps identify marine areas that deserve further monitoring or field verification.

### Core Message

**Observation → Evidence → Priority → Action**

### Key Question

> **Where should we look next?**

MarineGuard is not just an AI image analyzer.

It combines:

**People + AI + Sensors + History + GIS**

---

# 2. Problem

Marine environmental monitoring can be costly, slow, and difficult to scale when it depends mainly on manual field inspection.

Community observations can also be scattered, while sensor readings, historical observations, images, and geographic information may exist separately.

This makes it difficult to quickly answer:

- Where are unusual observations happening?
- Are multiple people reporting the same area?
- Are there visible indicators that require attention?
- Is there supporting sensor evidence?
- Has the same issue appeared before?
- Which location should be investigated first?
- When is human or field verification needed?

MarineGuard AI addresses this by creating a connected evidence and decision-support workflow.

---

# 3. Proposed Solution

MarineGuard receives:

**Community Reports + Images + Location + IoT/Sensor Data + Historical Observations**

Then an agentic Orchestrator determines what analysis and tools are needed.

The system can:

1. Understand the submitted report.
2. Analyze an image when available.
3. Retrieve sensor data when available.
4. Retrieve historical and community context.
5. Combine available evidence.
6. Calculate an explainable internal priority score.
7. Recommend the next action.
8. Route insufficient or uncertain cases to human review.
9. Display the result through Dashboard and GIS.
10. Preserve evidence and agent execution history for traceability.

---

# 4. Core Positioning

MarineGuard focuses on:

**Continuous Monitoring + Community Participation + Data Fusion + GIS + Decision Support**

The platform is designed to move from isolated observations toward coordinated monitoring.

### Key distinction

A simple image-analysis system asks:

> "What is visible in this image?"

MarineGuard asks:

> "What evidence do we have, how confident are we, and where should we look next?"

---

# 5. Target Users

MarineGuard can support:

- Coastal community members
- Divers and volunteers
- Environmental and regulatory organizations
- Researchers and universities
- Marine protected areas
- Environmental initiatives
- Non-profit organizations interested in marine environments

---

# 6. Main Workflow

```text
Community Report / Image
          ↓
   Orchestrator Agent
          ↓
 ┌─────────────────────────────────────────┐
 │ Vision Agent                            │
 │ Environmental Agent                    │
 │ IoT / Data Agent                       │
 │ Historical / Trend Agent               │
 └─────────────────────────────────────────┘
          ↓
 Data Fusion / Evidence Layer
          ↓
   Risk & Priority Agent
          ↓
   Recommendation Agent
          ↓
 Human / Field Verification
          ↓
 Dashboard + GIS + History
```

---

# 7. Agentic AI Architecture

MarineGuard must demonstrate real agentic behavior.

The Orchestrator does not simply execute every agent in a fixed sequence.

It evaluates the report and available evidence and conditionally decides which agents and tools are needed.

The Orchestrator should:

- Understand the report.
- Select appropriate agents.
- Select appropriate tools.
- Manage workflow state.
- Check evidence completeness.
- Request additional information when necessary.
- Continue with available evidence when some sources are missing.
- Route cases to human review when evidence is insufficient.
- Preserve the important evidence used for the decision.
- Handle agent/tool failures without losing the report.

---

# 8. Agents

## 8.1 Orchestrator Agent

Responsibilities:

- Understand the submitted report.
- Determine the type of analysis required.
- Select agents and tools conditionally.
- Manage state.
- Check evidence completeness.
- Request additional data when needed.
- Route uncertain cases to human review.
- Coordinate the overall workflow.

---

## 8.2 Vision Agent

Responsibilities:

- Analyze marine images.
- Perform marine scene understanding.
- Detect visible debris indicators.
- Analyze visible water appearance or anomaly indicators.
- Optionally identify coral, vegetation, or biodiversity indicators when supported by the model.
- Return structured output.
- Include confidence.
- Explain the visual result.
- Include limitations.

The Vision Agent must not claim laboratory diagnosis.

Example structured result:

```json
{
  "visual_indicators": [
    {
      "type": "marine_debris",
      "status": "detected",
      "confidence": 0.87
    }
  ],
  "summary": "Visible indicators require further monitoring.",
  "limitations": "Visual assessment only; not laboratory diagnosis."
}
```

---

## 8.3 Environmental Agent

Responsibilities:

- Interpret visual indicators in environmental context.
- Determine what may require monitoring or verification.
- Review whether conclusions are scientifically reasonable.
- Prevent overclaiming.
- Explain limitations of visual evidence.
- Help determine whether additional evidence is required.

---

## 8.4 IoT / Data Agent

Responsibilities:

- Retrieve sensor readings.
- Detect possible anomalies.
- Validate timestamp.
- Validate location.
- Validate sensor source.
- Connect readings to the relevant site.
- Clearly distinguish simulated from real sensor data.

---

## 8.5 Historical / Trend Agent

Responsibilities:

- Retrieve previous observations.
- Compare current and previous observations.
- Detect repeated reports.
- Detect changes over time.
- Identify historical trends.
- Provide site context.

---

## 8.6 Risk / Priority Agent

Responsibilities:

- Combine available evidence.
- Calculate an internal operational priority score.
- Determine priority level.
- Explain why the site received that priority.
- Account for uncertainty and evidence quality.

---

## 8.7 Recommendation Agent

Responsibilities:

- Recommend the next action.
- Suggest increased monitoring.
- Suggest expert review.
- Suggest additional data collection.
- Suggest field verification.
- Keep recommendations proportional to available evidence.

Example:

**Field Verification Recommended**

---

## 8.8 Verification / Human Agent

Responsibilities:

- Manage `Needs Review` cases.
- Manage verification status.
- Allow reviewers to add notes.
- Support human verification.
- Preserve verification information.

Typical states include:

- Needs Review
- Under Review
- Verified

---

# 9. Agent Tools

Possible backend tools include:

```text
analyze_image()
get_sensor_data()
get_historical_observations()
get_community_reports()
calculate_priority()
get_map_context()
create_recommendation()
request_human_review()
```

Agents should interact with actual backend tools rather than behaving as chat-only components.

---

# 10. Conditional Agent Routing

The workflow should be conditional.

### Example 1 — Image submitted

```text
Report
  ↓
Orchestrator
  ↓
Image exists?
  ↓ Yes
Vision Agent
  ↓
Environmental Agent
```

### Example 2 — No image

The Vision Agent should be skipped cleanly.

The system can continue using:

- Report information
- Location
- Sensor data
- Historical observations
- Community reports

### Example 3 — Sensor data unavailable

The IoT/Data Agent should skip cleanly.

The system should not invent sensor readings.

### Example 4 — Insufficient evidence

The system should route the case to:

```text
Needs Review
      ↓
Human Verification
```

This is an important part of the agentic behavior.

---

# 11. Data Fusion / Evidence Layer

MarineGuard should not rely on one source when multiple sources are available.

The Evidence Layer combines:

- Community image
- AI visual indicators
- Sensor readings
- Repeated community reports
- Historical observations
- Location
- Timestamp
- Confidence
- Evidence quality
- Source information

This creates an **Evidence Package**.

The Evidence Package is passed to the Risk/Priority Agent.

Example:

```text
Community Image
      +
Visible Debris Indicator
      +
Repeated Community Reports
      +
Elevated Simulated Turbidity
      +
Historical Change
      ↓
Evidence Package
      ↓
Priority Agent
```

---

# 12. AI Image Analysis

Expected visual capabilities:

- Marine scene understanding
- Visible pollution/debris indication
- Visible water appearance/anomaly indication
- Optional coral indicators
- Optional vegetation indicators
- Optional biodiversity indicators when supported

The output should be structured and should contain:

- Indicator
- Status
- Confidence
- Explanation
- Limitations

### Important

A visual indicator is not automatically a confirmed environmental condition.

For example:

**Correct:**

> Visible debris indicators detected. Further monitoring or field verification may be appropriate.

**Incorrect:**

> The ocean is polluted.

---

# 13. IoT / Sensor System

Physical sensors are not required for the MVP.

A Sensor Simulator can be used.

The simulator may generate:

- Temperature
- Salinity
- Turbidity

Every simulated reading must be clearly labeled:

```text
source = simulated
```

Example:

```json
{
  "source": "simulated",
  "site_id": "SITE-001",
  "timestamp": "2026-11-18T10:30:00",
  "temperature_c": 29.4,
  "salinity_psu": 38.1,
  "turbidity_ntu": 14.2,
  "latitude": 21.55,
  "longitude": 39.17
}
```

The sensor pipeline should be designed so the simulator can later be replaced with:

- ESP32
- Real sensors
- MQTT
- Real REST ingestion

The MVP does not require physical IoT hardware.

---

# 14. Priority Score

The Priority Score is an **internal operational prioritization index**.

It is used to rank areas that may deserve further monitoring or verification.

It is **not**:

- An official environmental standard.
- A laboratory measurement.
- A regulatory threshold.
- A diagnosis of ocean health.

### Conceptual Formula

```text
Priority Score =
Visual Evidence Weight
+ Sensor Anomaly Weight
+ Community Frequency Weight
+ Historical Change Weight
- Uncertainty Adjustment
```

Potential inputs:

- AI visual indicators
- Sensor anomalies
- Frequency of community reports
- Historical changes
- Evidence quality
- Confidence
- Uncertainty

### Example

```text
Visible debris
+
Repeated community reports
+
Elevated simulated turbidity
=
High Priority
```

The system should explain the reasons behind the score.

---

# 15. GIS

Recommended GIS stack:

- Leaflet
- OpenStreetMap

GIS features:

- Report markers
- Observation markers
- Priority layers
- Site popups
- Priority score
- Visual indicators
- Historical information
- Filters
- Date filtering
- Priority filtering
- Indicator-type filtering
- Site history

Selecting a location should provide relevant site information and historical context.

---

# 16. Dashboard

The Dashboard should include:

### KPI Cards

- Total Reports
- Active Areas
- High Priority
- Verified Reports

### Monitoring

- Priority map
- Recent reports
- Trend chart
- Site/area details
- Recommendations

### Agent Evidence

- Agent activity
- Evidence summary
- Workflow status
- Important evidence used for the decision

---

# 17. Frontend Pages

Recommended pages:

## Home

- Project introduction
- MarineGuard concept
- Report submission CTA

## Submit Report

- Image upload
- Location
- Description

## Analysis Result

- Visual indicators
- Confidence
- Limitations
- Priority
- Evidence summary
- Recommendation

## Map

- Interactive GIS
- Reports
- Sites
- Priority areas
- Filters

## Site Details

- Site information
- Historical observations
- Trends
- Reports
- Sensor readings
- Priority history

## Dashboard

- KPIs
- Map
- Trends
- Priority areas
- Recent reports
- Agent evidence

## Review Queue

- Needs Review cases
- Verification status
- Reviewer notes
- Verification actions

## Agent Trace

- Agents used
- Tools used
- Workflow steps
- Evidence
- Status
- Outputs

---

# 18. Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet
- Recharts

## Backend

- Python
- FastAPI
- Uvicorn

## Database

- SQLite for MVP
- PostgreSQL for production

## Agent Orchestration

- Stateful Python orchestration
- Conditional agent/tool routing
- Persisted agent runs
- LangGraph or another suitable agentic framework can be used

## AI / Vision

- Gemini Vision
- Or suitable local vision model
- Ollama for local deployment

## Maps

- Leaflet
- OpenStreetMap

## IoT

- REST API
- MQTT-ready architecture
- Sensor Simulator for MVP

## Analytics

- Python
- Pandas
- Rule-based scoring

## Storage

- Local storage for MVP
- Object storage for production

---

# 19. Database

Suggested database tables:

```text
users
reports
images
ai_results
sensor_readings
sites
observations
scores
agent_runs
verifications
```

### Suggested Fields

#### users

```text
id
role
created_at
```

#### reports

```text
id
user_id
description
latitude
longitude
status
created_at
```

#### images

```text
id
report_id
file_path/url
analysis_status
```

#### ai_results

```text
id
image_id
agent_name
indicators_json
confidence
created_at
```

#### sensor_readings

```text
id
site_id
source
sensor_type
value
unit
timestamp
lat
lon
```

#### sites

```text
id
name
latitude
longitude
```

#### observations

```text
id
site_id
source
type
evidence_json
created_at
```

#### scores

```text
id
site_id
score
level
reasons_json
created_at
```

#### agent_runs

```text
id
report_id
agent_name
input_ref
output_json
status
created_at
```

#### verifications

```text
id
report_id
reviewer
status
notes
verified_at
```

---

# 20. API

Core API endpoints:

```text
GET    /api/health

POST   /api/reports
POST   /api/reports/{report_id}/image
POST   /api/reports/{report_id}/analyze

GET    /api/reports
GET    /api/reports/{report_id}

GET    /api/sites
GET    /api/sites/{site_id}
GET    /api/sites/{site_id}/history

POST   /api/sensors/simulate
GET    /api/sensors/readings

GET    /api/map/observations

GET    /api/dashboard/summary
GET    /api/dashboard/trends

GET    /api/verification
PATCH  /api/verification/{verification_id}

GET    /api/agent-runs/{report_id}
```

The API supports the community reporting flow, image analysis, sensor simulation, historical context, GIS, dashboard, verification, and agent traceability.

---

# 21. Windows PowerShell Setup

## Backend

```powershell
cd backend

python -m venv .venv

.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

Copy-Item .env.example .env

uvicorn app.main:app --reload
```

Backend API:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# 22. AI Configuration

Edit:

```text
backend/.env
```

Gemini configuration:

```text
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_key_here
```

Local Ollama configuration:

```text
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5vl:7b
```

If the selected provider is unavailable, MarineGuard must not fabricate visual findings.

The system should return a:

```text
Needs Review
```

result while preserving the submitted report.

---

# 23. Frontend Setup

```powershell
cd frontend

npm install

Copy-Item .env.example .env

npm run dev
```

Frontend:

```text
http://localhost:5173
```

If the backend uses another URL, configure:

```text
VITE_API_URL
```

inside:

```text
frontend/.env
```

---

# 24. Reviewer Authorization

For local demonstration, reviewer authorization can be optional.

To enable it:

Backend `.env`:

```text
REVIEWER_TOKEN=replace-with-a-local-token
```

Frontend `.env`:

```text
VITE_REVIEWER_TOKEN=replace-with-the-same-local-token
```

The frontend should send the token only to reviewer API endpoints.

Production deployment should use proper authentication and role-based access control.

---

# 25. Sample Marine Imagery

The repository can contain:

```text
backend/data/sample_images_sources.txt
backend/download_sample_images.py
backend/data/sample_images/
```

The download script can retrieve public-domain marine imagery from Wikimedia Commons.

Run:

```powershell
cd backend

python download_sample_images.py
```

If internet access is unavailable, users can place their own:

- JPG
- JPEG
- PNG
- WebP

images in:

```text
backend/data/sample_images/
```

or upload community images through the UI.

The project must not fabricate environmental images or present fabricated images as real observations.

---

# 26. IoT Simulator

Open **Sensors** in the application.

Then:

1. Select a site.
2. Choose a normal or anomaly scenario.
3. Generate sensor readings.
4. Store the readings.
5. Display the source clearly as:

```text
simulated
```

The simulator can use:

- Temperature
- Salinity
- Turbidity

The simulated pipeline is designed to be replaced by real sensors later.

---

# 27. Data Strategy

## Community Images

Images can be collected through the platform during testing and demonstration.

## AI Training

Do not claim that MarineGuard uses a custom-trained model unless a model has actually been trained and evaluated.

The system can use an existing vision-capable model.

## Sensor Data

For the MVP:

```text
source = simulated
```

must be clearly shown.

## Historical Data

Use available historical observations.

Example or historical data must be clearly identified when applicable.

## Reference Ranges

If reference ranges are used in scoring:

- Document their source.
- Keep the source traceable.
- Do not present them as official regulatory thresholds unless verified.

---

# 28. Scientific & Product Guardrails

These rules are non-negotiable.

### 1. No diagnosis from one image

MarineGuard does not diagnose ocean health from a single image.

### 2. Visual AI is not laboratory testing

Visual indicators do not replace:

- Laboratory water-quality testing
- Professional field assessment
- Approved environmental measurements

### 3. Simulated sensors must be labeled

Simulated data must never be presented as real sensor data.

### 4. Priority Score is internal

Priority Score is an operational prioritization index.

It is not an official environmental standard.

### 5. Confidence and limitations

AI results should include:

- Confidence
- Explanation
- Limitations

### 6. Insufficient evidence

If evidence is insufficient or uncertain:

```text
Needs Review
```

should be used.

### 7. Official decisions

Official environmental decisions require appropriate approved data and verification.

### 8. No unlabelled mock data

There should be no user-facing mock environmental data presented as real.

---

# 29. Security Requirements

The system should:

- Validate uploaded image type.
- Validate image size.
- Never expose API keys in frontend code.
- Store secrets in environment variables.
- Use authentication/authorization for reviewer/admin functions.
- Sanitize user-provided text.
- Restrict review/admin functions.
- Protect sensitive agent traces.
- Log errors without exposing secrets.

---

# 30. Error Handling

The workflow should continue safely when possible.

If an Agent or Tool fails:

- Do not delete the report.
- Preserve the submitted data.
- Record the failed step.
- Avoid fabricating missing evidence.
- Retry analysis when appropriate.
- Route to `Needs Review` when necessary.

The user should be informed when an important source is unavailable.

---

# 31. Agent Execution Trace

MarineGuard should preserve a trace of the agent workflow.

The trace can show:

```text
Orchestrator
    ↓
Vision Agent
    ↓
Environmental Agent
    ↓
IoT/Data Agent
    ↓
Historical Agent
    ↓
Data Fusion
    ↓
Priority Agent
    ↓
Recommendation Agent
    ↓
Human Review
```

The trace should communicate:

- Which agents ran.
- Which tools were used.
- Which evidence was retrieved.
- Which agents were skipped.
- Why an agent was selected.
- Workflow status.
- Important outputs.

This demonstrates that the system is actually agentic rather than simply using multiple names for a fixed pipeline.

---

# 32. MVP Scope

The MVP should include:

- Community report flow
- Image upload
- Location
- Description
- AI image analysis
- Structured AI output
- Confidence
- Limitations
- Agentic Orchestrator
- Conditional agent routing
- Sensor simulator
- Data fusion
- Explainable Priority Score
- GIS map
- Dashboard
- Historical site view
- Verification workflow
- Recommendation
- Agent execution trace
- Error handling
- Clearly labeled simulated data

---

# 33. Out of MVP Scope

Do not attempt to build all of the following for the MVP:

- Large-scale physical IoT deployment
- Lab-grade water-quality diagnosis
- Large-scale satellite monitoring
- Government system integrations
- Autonomous drones
- Autonomous marine robots
- Full ocean digital twin

These can be future extensions.

---

# 34. Implementation Phases

## Phase 1 — Foundation

- React application
- FastAPI backend
- Database
- Basic report model

## Phase 2 — Community Flow

- Image upload
- Location
- Description
- Report storage

## Phase 3 — Agentic Core

- Orchestrator
- State
- Tool calling
- Conditional routing

## Phase 4 — Vision Agent

- Image analysis
- Structured result
- Confidence
- Limitations

## Phase 5 — IoT

- Sensor simulator
- REST/MQTT-ready ingestion
- Sensor storage

## Phase 6 — Historical / Community Context

- Context retrieval
- Previous reports
- Trends
- Repeated observations

## Phase 7 — Data Fusion

- Evidence package
- Multiple evidence sources
- Uncertainty handling

## Phase 8 — Risk & Recommendation

- Explainable priority
- Priority levels
- Next action

## Phase 9 — GIS & Dashboard

- Map
- KPIs
- Trends
- Priority areas
- Agent evidence

## Phase 10 — Verification & Demo

- Human review
- Error handling
- Final UX polish
- End-to-end demo

---

# 35. End-to-End Example

A community user submits:

```text
Image:
Marine environment with visible debris

Location:
SITE-001

Description:
"I noticed debris near the coral."
```

## Step 1 — Orchestrator

The Orchestrator understands the report and decides which agents/tools are needed.

Because an image exists, it calls the Vision Agent.

It can also request:

- Sensor data
- Historical observations
- Community reports

---

## Step 2 — Vision Agent

The Vision Agent identifies:

```text
Visible marine debris indicator
Confidence: 0.87
```

and returns limitations.

---

## Step 3 — Environmental Agent

The Environmental Agent interprets the visual indicator.

It does not claim:

```text
Confirmed pollution
```

Instead, it may say:

```text
Visible debris requires further monitoring or verification.
```

---

## Step 4 — IoT Agent

The IoT Agent retrieves sensor information for the same site.

Example:

```text
Turbidity: elevated
Source: simulated
```

---

## Step 5 — Historical Agent

The Historical Agent checks previous observations.

Example:

```text
Multiple community reports were previously recorded at the site.
```

---

## Step 6 — Data Fusion

The Evidence Layer combines:

```text
Visible debris
+
Repeated reports
+
Elevated simulated turbidity
+
Historical observations
+
Location
+
Confidence
```

---

## Step 7 — Priority Agent

The Priority Agent calculates an internal operational priority.

Example:

```text
Priority: High
```

Reasons:

```text
- Visible debris
- Repeated community reports
- Elevated simulated turbidity
- Supporting historical observations
```

---

## Step 8 — Recommendation Agent

The Recommendation Agent may return:

```text
Field Verification Recommended
```

---

## Step 9 — GIS

The site appears on the map with its priority information.

---

## Step 10 — Human Verification

A reviewer can move the case through:

```text
Needs Review
      ↓
Under Review
      ↓
Verified
```

and add notes.

---

# 36. Demo Flow — 3 to 5 Minutes

1. Open MarineGuard Dashboard.
2. Show KPIs.
3. Show the priority map.
4. Submit a marine community report.
5. Upload a marine image.
6. Add location.
7. Add a description.
8. Run the AI workflow.
9. Show the Vision Agent result.
10. Show confidence.
11. Show limitations.
12. Open Sensors.
13. Generate a clearly labeled simulated anomaly.
14. Show Data Fusion.
15. Show Priority Score.
16. Show reasons behind the score.
17. Open Site Details.
18. Show history/trend.
19. Show Recommendation.
20. Open GIS.
21. Show the site and priority.
22. Open Agent Trace.
23. Show which agents/tools ran.
24. Open Verification Queue.
25. Move the case through review.
26. Explain the scientific guardrails.

### Final explanation

> MarineGuard supports prioritization and monitoring. It does not replace laboratory testing or professional field verification.

---

# 37. Testing

Backend tests:

```powershell
cd backend

.\.venv\Scripts\Activate.ps1

python -m pytest -q
```

Testing should cover:

- Report creation
- Image upload
- Analysis workflow
- Conditional routing
- Sensor simulation
- Data fusion
- Priority scoring
- Recommendations
- Verification
- API behavior
- Error handling

---

# 38. Success Metrics

Potential success metrics include:

### Report Completion Rate

Measures how easily users can create a report.

### AI Response Success Rate

Measures the percentage of images that receive a structured analysis.

### Average Analysis Time

Measures workflow speed.

### Agent Routing Efficiency

Measures whether the correct agents are selected based on the available evidence.

### Priority Explainability

Measures whether the system can explain why an area received its priority.

### Map Coverage

Measures the number of locations represented on the map.

### Repeat Observation Rate

Measures whether the system can build a time-based observation record.

### Verification Workflow Rate

Measures how reports move into monitoring or verification.

---

# 39. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Agent over-interprets evidence | Structured outputs, confidence, evidence and human review |
| AI visual result is wrong | Limit claims and use Needs Review |
| No physical IoT | Use simulator with clear labeling |
| Noisy community reports | Frequency, confidence, duplicate checks and verification |
| Agentic workflow becomes complex | Small number of focused agents and explicit tools |
| API/model quota limits | Local model, fallback or controlled demo path |
| Map/API issues | Keep core report and dashboard functionality available |

---

# 40. Diver / Field Role

The diver represents the field side of MarineGuard.

Responsibilities:

- Provide real marine images.
- Photograph coral, marine life and visible observations.
- Record location, time and depth when available.
- Add simple notes.
- Help identify what the AI should focus on.
- Compare AI results with actual field observations.
- Test the platform from a field-user perspective.
- Help with field verification when necessary.

### Important

The diver does not need to go to sea multiple times.

One well-planned dive can provide enough images and observations for MVP testing.

Additional field verification should happen only when necessary.

---

# 41. Microbiology / Scientific Reviewer Role

The microbiologist acts mainly as a Scientific Reviewer.

## Before Building

- Help identify relevant environmental indicators.
- Explain what can and cannot be inferred from images.
- Help define cases that should become `Needs Review`.

## During Building

- Review AI outputs scientifically.
- Review recommendations.
- Ensure the system does not overclaim laboratory diagnosis.

## During Testing

- Test different scenarios.
- Check whether outputs are scientifically reasonable.
- Identify cases requiring field verification or additional testing.
- Provide feedback.

## Before the Pitch

- Review scientific wording.
- Review results.
- Review limitations.

### Important

The microbiologist is not required to perform laboratory tests for the MVP.

---

# 42. Marine Engineer Role

If a marine engineer is part of the team, especially someone focused on ships:

- Help identify useful marine data.
- Help validate sensor-data realism.
- Suggest how marine data could be collected.
- Help design future sensor/boat integration.
- Review engineering feasibility.

Physical hardware is not required for the MVP.

---

# 43. Team Roles

Potential team roles:

- AI Engineer
- Software Engineer
- Biology graduate
- Marine Science specialist
- Diver
- GIS specialist
- Environmental Science specialist
- Microbiology / Water Science specialist
- Marine Engineer

The exact team structure can depend on the team's available expertise.

---

# 44. Security & Production Considerations

For a production deployment, MarineGuard should eventually add:

- Production authentication
- Role-based access control
- Secure secret management
- PostgreSQL
- Object storage
- Secure image handling
- Audit logging
- Stronger API protection
- Rate limiting
- Secure reviewer permissions
- Monitoring and observability
- Privacy controls
- Backup and recovery

---

# 45. Limitations

Current MVP limitations include:

- Real sensor hardware is not required.
- Sensor simulation is used when physical hardware is unavailable.
- Vision quality depends on the selected provider/model and image quality.
- OpenStreetMap tiles require internet access during map use.
- Public-domain sample images may be downloaded separately.
- Authentication can remain lightweight for hackathon demonstration.
- Visual analysis cannot replace laboratory testing.
- Priority scoring is an internal operational index.
- Environmental conclusions require appropriate verification.

---

# 46. Future Improvements

Potential post-MVP improvements:

## Real IoT

- ESP32
- Real marine sensors
- MQTT ingestion
- Continuous sensor streams

## Production Infrastructure

- PostgreSQL
- Object storage
- Cloud deployment
- Scalable backend

## Authentication

- Production identity provider
- Role-based access control
- Reviewer/admin roles

## Scientific Intelligence

- Expert-reviewed datasets
- Better environmental reference data
- More marine indicators
- Improved uncertainty handling

## Geospatial Intelligence

- Stronger GIS context
- More spatial analysis
- Area-level trends
- Site-specific environmental profiles

## Advanced Environmental Intelligence

MarineGuard could eventually evolve toward an Ocean Environmental Intelligence platform that maintains an evolving digital profile for each marine site.

Future data sources could include:

- Real sensors
- Expert reports
- Satellite imagery
- Scientific datasets
- Environmental reference sources

The system could then run proactive workflows to detect changes and continuously improve monitoring priorities.

---

# 47. Final Build Checklist

```text
[ ] React/Vite frontend
[ ] FastAPI backend
[ ] Database
[ ] Community report flow
[ ] Image upload
[ ] Location
[ ] Description
[ ] Agentic Orchestrator
[ ] Conditional agent routing
[ ] Vision Agent
[ ] Environmental Agent
[ ] IoT/Data Agent
[ ] Historical/Trend Agent
[ ] Risk/Priority Agent
[ ] Recommendation Agent
[ ] Human verification
[ ] Sensor simulator
[ ] source=simulated labeling
[ ] Data fusion/evidence layer
[ ] Explainable Priority Score
[ ] GIS map
[ ] Dashboard
[ ] Site history
[ ] Agent execution trace
[ ] No unlabelled mock data
[ ] Error handling
[ ] API keys protected
[ ] End-to-end demo tested
```

---

# 48. Core Project Rules

These rules must remain true throughout development:

- Do not claim one image diagnoses ocean health.
- Do not present visual AI as laboratory testing.
- Do not present simulated sensor data as real.
- Do not present Priority Score as an official environmental standard.
- Include confidence and/or limitations in AI results.
- Insufficient evidence must lead to `Needs Review`.
- Official environmental decisions require appropriate approved data and verification.
- Do not use user-facing mock data.
- Agentic behavior must be real.
- Do not simply name multiple agents while executing a fixed workflow.
- The Orchestrator must be able to select agents/tools conditionally.
- The system should be able to request additional data.
- The system should be able to request human review.
- Important evidence used for decisions should be preserved.
- Agent/tool failures must not cause the report to disappear.
- AI should not fabricate missing sensor or environmental evidence.

---

# 49. Pitch

## One-Liner

> MarineGuard AI is an agentic platform that continuously turns community observations, marine imagery, IoT-ready data, and geospatial history into evidence-based priorities for marine monitoring.

## Arabic Pitch

> MarineGuard AI منصة Agentic تجمع ملاحظات المجتمع، وتحليل الصور، وبيانات الحساسات والموقع والتاريخ، ثم تستخدم وكلاء أذكياء لتحديد الأدلة المناسبة، وترتيب المناطق حسب الأولوية للرصد والتحقق الميداني.

## Short Pitch

> المستخدم يرسل بلاغًا، والـ Orchestrator يقرر ما يحتاجه للتحليل، ثم يستدعي الوكلاء والأدوات المناسبة، يجمع الأدلة من الصور والحساسات والموقع والتاريخ، يحدد الأولوية، ويقترح الخطوة التالية، مع إبقاء التحقق البشري جزءًا من العملية عند الحاجة.

## Arabic Short Explanation

> بدل أن ننتظر حتى تظهر المشكلة بشكل واضح أو نعتمد على الفحص الميداني وحده، يجمع MarineGuard الإشارات من المجتمع والصور والحساسات، يحللها بالذكاء الاصطناعي، يربطها بالموقع والتاريخ، ثم يحدد أين نحتاج أن ننظر أولًا.

---

# 50. Core Message for Judges

MarineGuard is **not just an AI image analyzer**.

It turns:

```text
Observation
     ↓
Evidence
     ↓
Priority
     ↓
Action
```

It combines:

```text
People
+
AI
+
Sensors
+
History
+
GIS
```

The key question is:

> **Where should we look next?**

---

# 51. Repository Structure

A typical implementation can follow this structure:

```text
MarineGuard_AI/
│
├── backend/
│   ├── app/
│   ├── data/
│   │   └── sample_images/
│   ├── download_sample_images.py
│   ├── requirements.txt
│   ├── .env.example
│   └── tests/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── vite.config.*
│
├── README.md
└── .gitignore
```

The exact structure may vary according to the implemented codebase, but project architecture should remain aligned with the documented backend, frontend, agent, data, and verification responsibilities.

---

# 52. License

Add the project's chosen license here before public release.

Example:

```text
MIT License
```

if the team chooses MIT.

---

# 53. Acknowledgment

MarineGuard AI was developed as a solution for:

**Tanmiyathon 2026 — تنمية ثون 2026**

Challenge:

**Community-Driven Marine Environmental Monitoring**

---

# MarineGuard AI

**Observation → Evidence → Priority → Action**

**Where should we look next?**
