# ========== Institution Dashboard Models ==========

class Institution(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    cached_stats: dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Event(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    institution_id: str
    title: str
    description: str

    # Classification
    category: str  # Hackathon, Coding Competition, Design Challenge
    event_type: str  # Online, Offline, Hybrid
    status: str = "DRAFT"

    # Timeline
    start_date: datetime
    end_date: datetime
    registration_deadline: datetime
    submission_deadline: Optional[datetime] = None

    # Participation
    participation_mode: str = "BOTH"  # INDIVIDUAL, TEAM, BOTH
    max_participants: Optional[int] = None
    min_team_size: int = 1
    max_team_size: int = 5

    # Prizes & Rules
    prize_pool: Optional[str] = None
    number_of_prizes: Optional[int] = None
    rules_guidelines: Optional[str] = None

    # Features
    has_submission: bool = True
    requires_github: bool = False
    requires_demo_video: bool = False
    requires_file_upload: bool = False
    has_judging: bool = True
    is_blind_judging: bool = False
    judging_criteria: List[dict] = []

    # Metadata
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class DashboardStats(BaseModel):
    total_participants: int = 0
    active_events: int = 0
    total_submissions: int = 0
    upcoming_deadlines: int = 0
    engagement_rate: float = 0.0


class Participant(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    event_id: str
    institution_id: str
    college_name: Optional[str] = None
    year: Optional[str] = None
    department: Optional[str] = None
    skills: List[str] = []
    registration_status: str = "Registered"
    team_id: Optional[str] = None
    registered_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Team(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    team_name: str
    team_leader_id: str
    members: List[dict] = []
    status: str = "Pending"
    formed_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Submission(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    team_id: Optional[str] = None
    participant_id: Optional[str] = None
    project_title: str
    project_description: str
    github_url: Optional[str] = None
    demo_video_url: Optional[str] = None
    attachments: List[str] = []
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "Submitted"
    average_score: float = 0.0
    plagiarism_score: float = 0.0
    plagiarism_report: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Judge(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    expertise_areas: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Score(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    submission_id: str
    judge_id: str
    event_id: str
    criteria_scores: dict
    total_score: float
    comments: Optional[str] = None
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class LeaderboardEntry(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    team_id: Optional[str] = None
    participant_id: Optional[str] = None
    total_score: float
    rank: int
    points: int = 0
    final_status: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Certificate(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    user_id: str
    team_id: Optional[str] = None
    participant_name: str
    team_name: Optional[str] = None
    rank: Optional[int] = None
    issued_date: datetime = Field(default_factory=datetime.utcnow)
    verification_code: str
    verification_url: str
    qr_code: Optional[str] = None
    immutable_flag: bool = True


class AuditLog(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    actor_id: str
    action: str
    resource_type: str
    resource_id: str
    details: dict = {}
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)