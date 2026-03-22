import re
import json

text = """
Stripo
for Email Marketing Software
Verified Free Tool
Design responsive emails faster, collaborate instantly, use modular templates, and export effortlessly to any ESP with Stripo.

#email #email marketing +1

	
RepoClip
for Product Demo Automation
Verified Free Tool
AI-powered tool that turns any GitHub repository into a professional promotional video with narration, visuals, and music — in under 5 minutes.

#AI #Developer Tools +1
	
Scalify.ai
for Website Builder Software
Verified
Scalify.ai is the world's first website ordering platform, where you can order your own website in under 10 minutes.

#SaaS #web development +1
	
Flowstep
for UI/UX Designing Software
Verified Free Tool
Flowstep is an AI design assistant. It generates UI designs from text prompts. Users can copy their designs into Figma or export clean code.

#design #UI +1
	
LLMboost
for SEO Software
Verified
LLMBoost helps SEO and SEM agencies track and improve how AI tools like Gemini, ChatGPT, Perplexity recommend their clients, turning AI insights into GEO action

#geo #llm +1
	
Blink
for Team Communication Software
Verified
Blink is a messaging platform for private and group communication, offering text messaging, file sharing, and an organised, easy-to-use interface.

#digital workplace #Engagement +1

	
Wellows
for Content Automation Software
Verified
Wellows helps brands track citations, sentiment, and visibility across AI search engines like ChatGPT, Gemini, and Perplexity.

#AI Search Visibility #Brand Monitoring +1
	
Clym
for Governance, Risk and Compliance Software
Verified
Clym is an all-in-one digital compliance solution that simplifies data privacy, accessibility, and governance with easy-to-manage tools.

#Accessibility #Privacy +1
	
Ace.me
for Website Builder Software
Verified Free Tool
Your new website, email address & cloud storage. Simple. Fast. Secure.

#email #storage +1
	
PDF Candy Desktop
for Productivity Tools
Verified
Powerful and easy to use software with full-featured PDF editor. Convert, split, merge, protect, crop, rotate, compress & much more.

#pdf #pdf convertor +1
	
Sliptree
for Billing and Invoicing Software
Verified
Create and send professional, branded invoices in minutes. Sliptree keeps invoicing simple, fast, and flexible for freelancers and small businesses.

#electronic invoices #Freelancers +1

	
Crypto5.app
for AI Crypto Research
Verified
AI crypto research assistant for real‑time data, news, on‑chain, tokenomics, and risk—actionable insights in 2 minutes.

#AI #crypto +1
	
Notiondesk
for Customer Service Software
Verified
Turn your Notion pages into a branded help center with SEO, analytics, and AI-powered search.

#Customer Support #knowledge base +1
	
Valifi.ai
for Startup Launch Tools
Verified Free Tool
Instant idea validation, live competitor insights, and deep market analysis. Valifi.ai is everything you need to generate the perfect AI build prompt.

#AI #idea validation +1
	
goHeather AI Contract Review
for Legal
Verified
Lawyer-trained AI that reviews contracts, generates redlines, and applies custom playbooks - fast and inexpensive.

#AI #Legal Contracts +1
	
MCP Showcase
for Development and DevOps
Verified Free Tool
Gain real-time insights into how prospects use your MCP servers to refine features and improve your product in days, not weeks.

#generative AI #mcp +1

	
Motif
for Cryptocurrency Wallets Software
Verified
Motif is your personal wealth manager for on-chain finance. Agent-powered and working for you – See for yourself.

#crypto #Cryptocurrency Wallet +2
	
TalentSprout
for Hiring and HRMS
Verified
AI voice interviews that screen, score, and rank candidates automatically—saving hours on hiring.

#HR #Recruitment +1
	
Proposal Pilot
for Sales
Verified
Generate complete, accurate RFP responses in minutes using your company’s past proposals. Built for speed, compliance, and GovCon growth.

#proposals #Sales conversions
	
Botpool
for Development and DevOps
Verified Free Tool
Botpool is a freelance marketplace built specifically for AI professionals.

#AI Freelancer #Botpool +1
	
AI Newsletter Generator
for Email Marketing Software
Verified
Effortlessly grow your business with AI-powered newsletters. Automate content creation, leverage media monitoring, and deliver engaging newsletters.

#Automation #Email Automation +2

	
Convoso
for Lead Generation Software
Verified
The dialer built for closers, with AI-powered tools to supercharge your outbound sales.

#Call Centre #Contact Centre Support +1
	
Forage Mail
for Productivity Tools
Verified
Invisible AI that filters distractions, identifies important messages & cleans your inbox. Replace email clutter with elegant daily summaries—right in Gmail.

#email #Email Automation +1
	
Secta Labs
for Photo Editing Software
Verified
Get hundreds of realistic headshots in minutes—Secta Labs offers instant style customization, pro-grade editing, and a complete portrait studio experience.

#AI Headshots #image generation
	
Clerk
for Development and DevOps
Verified Free Tool
Clerk is a comprehensive user authentication and management platform designed for modern web and mobile applications.

#authentication #SaaS +1
	
Persimi
for Market Research Software
Verified Free Tool
Persimi is a research simulator that lets users conduct realistic interviews with AI personas — for insight, empathy, and clarity.

#AI #Feedback +2

	
Refiner
for Survey and Feedback Software
Verified
Gather customer insights with perfectly-timed web & mobile in-product microsurveys. Get higher response rates and actionable feedback.

#Engagement #Startup +1
	
Skycloak
for Development and DevOps
Verified
Simplify identity management with Skycloak's managed Keycloak hosting, secure and scalable IAM solutions.

#Identity Access Management #IDP +1
	
Undetectable AI
for Content Marketing Software
Verified
Undetectable AI offers the #1 rated AI detector and humanization tool to check and transform AI-written content into undetectable human-like text.

#AI Humanizer #AI Marketing +1
	
MemeGen AI
for Social Tools
Verified Free Tool
A tool to transform your photos into funny GIF memes.

#AI #Gifs +1
	
ReadPartner
for Productivity Tools
Verified Free Tool
An AI assistant for automated news digests and quick summaries of websites, videos and documents. Works as a browser extension and an online portal.

#Content AI #Summarizer +1

	
BoloSign
for Digital Signature Software
Verified Free Tool
Unlimited signatures, templates, forms, and team members. One fixed price. No extra charges, ever.

#digital signature #e-sign +1
	
Solvely
for Learning
Verified Free Tool
Your Best AI Study Companion. Solvely offers AI tools designed to support students in enhancing their writing and learning efficiency.

#AI Homework Help #AI Writing +1
	
Datagram
for Dashboard Software
Verified Free Tool
A great tool with an API and mobile app to easily distribute beautiful data.

#Analytics #API +1
	
Helpfull
for Domain Name Tools
Verified Free Tool
A free AI business name generator that helps you instantly create catchy business names that resonate with your audience.

#Business Services #Domain Name Suggestion +1
	
getimg.ai
for Design
Verified Free Tool
getimg.ai offers AI-powered tools to easily create, edit, and transform images with text commands. Perfect for all your creative needs.

#AI #AI Design +1

	
SummarAIze
for Content Automation Software
Verified
SummarAIze repurposes long-form audio and video content into blogs, social posts, newsletters, clips, and more with AI.

#Content AI #Content Creation +1
	
Entrepreneur DNA Assessment
for Startup Launch Tools
Verified Free Tool
Unlock your full potential with Founder Institute's Entrepreneur DNA test. See how you stack up against 180,000+ entrepreneurs worldwide.

#Entrepreneur #entrepreneur traits +1
	
Atlas HXM
for Payroll Software
Verified
Atlas HXM is the largest Direct Employer of Record (EOR) technology platform.

#Employee Management #HR +1
	Featured
Notion For Startups
for Collaboration Tools
Verified Free Tool
Build your company and team with Notion. Centralise all your knowledge, communicate more efficiently, and manage any type of project, no matter the team size.

#Collaboration Tool #Team Collaboration
	
Qonqur
for Learning
Verified
Apple Vision-like hand-gestures meets ChatGPT with no need for a headset. Explore and present ideas using gesture controls with Qonqur's virtual hands.

#Gesture Control #Learning +1

	
Superblocks
for Low Code Development Tools
Verified Free Tool
Superblocks is a low-code platform for developers to rapidly build custom enterprise-grade internal applications.

#development #Low Code +1
	
Outverse
for Customer Service Software
Verified Free Tool
Outverse is the self-serve support platform for modern SaaS startups. Support your customers at scale with help docs, customer forums and AI assistance.

#AI #Community +1
	
Syncly
for Analytics
Verified
Syncly is an Y Combinator-backed AI Feedback Analysis Tool, surfacing real customer pains by analyzing customer chat, calls, reviews and surveys.

#AI #Analytics +1
	
Aikido Security
for Website Security Software
Verified Free Tool
Aikido is an all-in-one application security solution for cloud-native companies. They help you get your web app secured in no time.

#application testing #appsec +1
	
UI Bakery
for Low Code Development Tools
Verified
UI Bakery is a low-code platform to build internal web apps & tools.

#application development #development +1

	
davinci
for Patents Drafting and Analysis Software
Verified Free Tool
davinci is the most performant and secure AI patent drafting tool that helps draft better patents in half of the time.

#Patents Analysis #Patents Drafting
	
DJ.Studio
for Productivity Tools
Verified
DJ.Studio is a timeline-based DAW for DJs to make DJ mixes on your laptop in one third of the time. Order playlists, tune transitions and export your DJ mix.

#audio software #background music +1
	
ChaosSearch
for Database Software
Verified
ChaosSearch seamlessly transforms cloud storage into a live analytical database, delivering actionable insights at scale through Search+SQL+GenAI analytics.

#data analytics #Databases
	
Testiny
for Test Management Tools
Verified
Testiny is a cloud-based test management solution for manual and automated test cases with test runs, plans, issue-tracker integrations and more.

#Automated Testing #Test Management +1
	
HelpWire
for Remote Desktop Access Software
Verified Free Tool
HelpWire is a simple service for instant remote support. Control remote computers to fix IT issues fast, anytime, and anywhere.

#Desktop Sharing #Remote Desktop Access +1

	
SpiffWorkflow
for Workflow Management Software
Verified
SpiffWorkflow is a tool for business process automation. It has a Python3 library for executing business workflows using BPMN.

#Automation #python +1
	
UTMStack
for Development and DevOps
Verified Free Tool
A log management and threat prevention tool that merges SIEM and XDR technologies into a unified platform, surpassing the boundaries of traditional systems.

#log management #SIEM +1
	
Walnut
for Product Demo Automation
Verified
A no-code platform for SaaS companies to build and deliver personalized interactive demos throughout the sales funnel to improve buyer experience and conversion

#demo automation #live demo +1
	
Saleo
for Product Demo Automation
Verified
A demo experience platform that brings your product to life in its native environment.

#demo automation #live demo +1
	
Storylane
for Product Demo Automation
Verified Free Tool
A no-code platform to create and automate guided demo experiences for your website.

#demo automation #live demo +1

	
Consensus
for Product Demo Automation
Verified
Consensus is a SaaS platform that creates video demos to accelerate sales.

#demo automation #live demo +1
	
Navattic
for Product Demo Automation
Verified
A tool to create interactive website demos and empower product marketing teams to increase website conversions.

#demo automation #live demo +1
	
Reprise
for Product Demo Automation
Verified
A platform for sales and marketing teams to create product demos.

#demo automation #live demo +1
	
Demostack
for Product Demo Automation
Verified
Demostack is a no-code platform that helps you create product replicas and demos that showcase your product in the best light.

#demo automation #live demo +1
	
All In One Accessibility Pro
for Customer Service Software
Verified
Get quick WCAG 2.1 website accessibility remediation with All in One Accessibility. Install the tool in 2 minutes.

#Accessibility #Customer Support +1

	
Agora
for Real Estate Investor Software
Verified
Agora is a real estate investment platform helping investors, GPs and LPs track high-quality investment opportunities and maintain investor relations.

#Investment #Investor Relations +1
	
Cash Flow Portal
for Real Estate Investor Software
Verified Free Tool
Cash Flow Portal is a real-estate syndication software for managing your investor network and raising capital faster.

#Investment #Investor Relations +1
	
SponsorCloud
for Real Estate Investor Software
Verified
SponsorCloud serves investment firms and deal sponsors to adopt digital transformation, grow their businesses, and better serve their investors.

#Investment #Investor Relations +1
"""

lines = [l.strip() for l in text.split('\n') if l.strip()]
tools = []
i = 0
while i < len(lines):
    # Skip "Featured" line if it appears
    if lines[i] == "Featured":
        i += 1
        continue
        
    name = lines[i]
    i += 1
    
    category = "General"
    if i < len(lines) and lines[i].startswith("for "):
        category = lines[i][4:]
        i += 1
        
    # Skip verification line
    if i < len(lines) and (lines[i].startswith("Verified") or lines[i] == "Verified Free Tool"):
        i += 1
        
    description = "No description available"
    if i < len(lines):
        description = lines[i]
        i += 1
        
    # Skip tags line
    if i < len(lines) and lines[i].startswith("#"):
        i += 1
        
    # Guess URL if it looks like a domain name
    url = "#"
    if "." in name and " " not in name:
        url = f"https://{name.lower()}"
    elif name.lower() == "stripo":
        url = "https://stripo.email"
    # ... more guesses if needed, but # is safe
    
    tools.append({
        "name": name,
        "description": description,
        "logo": "https://via.placeholder.com/150",
        "category": category,
        "url": url
    })

with open('temp_tools.json', 'w') as f:
    json.dump(tools, f, indent=4)
