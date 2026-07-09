const diffReportData = [
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "1",
    "q2026_number": "1",
    "text_2025": "Please list any data centers including address or upload a listing to the data room.",
    "text_2026": "Please list any data centers including address or upload a listing to the data room.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "NONE"
  },
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "2",
    "q2026_number": "2",
    "text_2025": "Please list any cloud providers and regions in use.",
    "text_2026": "Please list any cloud providers and regions in use.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Provider: AWS, Azure Regions: United States (N. Virginia) United States( US - East)",
    "comments_2026": "Cloud Provider: AWS Regions: US - East - 1 US - East - 2 US - West - 1 US - West - 2"
  },
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "3",
    "q2026_number": "3",
    "text_2025": "Please provide a list of all regions where the business operates.",
    "text_2026": "Please provide a list of all regions where the business operates.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "US - East US - Central US - West Canada",
    "comments_2026": "Regions: US - East - 1 US - East - 2"
  },
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "4",
    "q2026_number": "4",
    "text_2025": "Please provide a list and rationale for all applicable regulatory requirements for the organization. (e.g. California Privacy Rights Act or other U.S. state privacy laws, General Data Protection Regulation or other international privacy or security laws, New York Department of Financial Services Cybersecurity Regulation, Financial Industry Regulatory Authority (FINRA), Health Insurance Portability and Accountability Act, etc.)",
    "text_2026": "Please provide a list and rationale for all applicable regulatory requirements for the organization. (e.g. California Privacy Rights Act or other U.S. state privacy laws, General Data Protection Regulation or other international privacy or security laws, New York Department of Financial Services Cybersecurity Regulation, Financial Industry Regulatory Authority (FINRA), Health Insurance Portability and Accountability Act, etc.)",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Regulatory requirements: 1. GDPR 2. CPRA",
    "comments_2026": "CPRA is applicable since our company is based in California and must adhere to local regulations. GDPR is applicable because we work internationally and must adhere to European regulations."
  },
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "5",
    "q2026_number": "5",
    "text_2025": "Please provide a list of all applicable compliance certifications or security standards. (e.g. Payment Card Industry Data Security Standard, ISO, SOC, NIST, etc.). Please upload the latest two years o audit reports for applicable certifications or standards to the data room.",
    "text_2026": "Please provide a list of all applicable compliance certifications or security standards. (e.g. Payment Card Industry Data Security Standard, ISO, SOC, NIST, etc.). Please upload the latest two years o audit reports for applicable certifications or standards to the data room.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Compliance: 1. PCI DSS Standards: 1. NIST framework f",
    "comments_2026": "We maintain internal security policies and controls aligned with recognized security frameworks; however, we do not currently hold formal certifications such as SOC 2, ISO 27001, PCI DSS, or NIST certification, and therefore do not have external audit reports for the past two years to provide. f"
  },
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "6",
    "q2026_number": "6",
    "text_2025": "Please provide a list of IT and Security service providers in use (e.g. Managed IT provider, Managed Security Service Provider).",
    "text_2026": "Please provide a list of IT and Security service providers in use (e.g. Managed IT provider, Managed Security Service Provider).",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2026": "Microsoft 365 Microsoft Entra ID Microsoft Defender"
  },
  {
    "category": "COMPANY INFORMATION",
    "q2025_number": "7",
    "q2026_number": "7",
    "text_2025": "Please provide a listing of key applications used by the company.",
    "text_2026": "Please provide a listing of key applications used by the company.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Amazon Web Services Atlassian Dhango Google Cloud Microsoft Azure Namecheap Network Solution Paylocity Payrix Plaid Scalegrid Stripe Zoom",
    "comments_2026": "AWS Atlassian Dhango Google Cloud Microsoft Namecheap Network Solutions Paylocity Payrix Plaid Rippling Scalegrid Stripe Zoom"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "8",
    "q2026_number": "8",
    "text_2025": "Please list the tool(s) in place to manage the network firewall(s).",
    "text_2026": "Please list the tool(s) in place to manage the network firewall(s).",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Defender, AWS WAF, NordLayer",
    "comments_2026": "AWS WAF and Microsoft Defender"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "9",
    "q2026_number": "9",
    "text_2025": "Please list the tool(s) in place to manage intrusion detection / prevention.",
    "text_2026": "Please list the tool(s) in place to manage intrusion detection / prevention.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Defender, AWS Guard duty",
    "comments_2026": "Microsoft Defender and AWS Cloudwatch"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "10",
    "q2026_number": "10",
    "text_2025": "Please list the tool(s) in place to manage remote access.",
    "text_2026": "Please list the tool(s) in place to manage remote access.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Entra ID",
    "comments_2026": "Microsoft Defender for endpoint"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "11",
    "q2026_number": "11",
    "text_2025": "Please list the tool(s) in place to manage multi-factor authentication.",
    "text_2026": "Please list the tool(s) in place to manage multi-factor authentication.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Entra ID, Google authentication app, Microsoft Authentication app",
    "comments_2026": "Microsoft Entra ID and AWS IAM"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "12",
    "q2026_number": "12",
    "text_2025": "Please list the email security gateway tool(s) in place.",
    "text_2026": "Please list the email security gateway tool(s) in place.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Defender, Microsoft Exchange",
    "comments_2026": "Microsoft Defender"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "13",
    "q2026_number": "13",
    "text_2025": "Please list the tool(s) in place to manage identity and access management.",
    "text_2026": "Please list the tool(s) in place to manage identity and access management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Entra ID",
    "comments_2026": "Microsoft Entra ID and AWS IAM"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "14",
    "q2026_number": "14",
    "text_2025": "Please list the tool(s) in place to manage privileged access management",
    "text_2026": "Please list the tool(s) in place to manage privileged access management",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Entra ID",
    "comments_2026": "Microsoft Entra ID and AWS IAM"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "15",
    "q2026_number": "15",
    "text_2025": "Please list the tool(s) in place to manage endpoint device encryption",
    "text_2026": "Please list the tool(s) in place to manage endpoint device encryption",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": ", Microsoft Entra ID, Microsoft Intune",
    "comments_2026": ", Microsoft Intune"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "16",
    "q2026_number": "16",
    "text_2025": "Please list the tool(s) in place to manage endpoint protection (antivirus or EDR).",
    "text_2026": "Please list the tool(s) in place to manage endpoint protection (antivirus or EDR).",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Defender",
    "comments_2026": "Microsoft Defender for Endpoint"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "17",
    "q2026_number": "17",
    "text_2025": "Please list the tool(s) in place to manage server disk / device encryption.",
    "text_2026": "Please list the tool(s) in place to manage server disk / device encryption.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Intune",
    "comments_2026": "Microsoft Intune"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "18",
    "q2026_number": "18",
    "text_2025": "Please list the tool(s) in place to manage server protection (antivirus or EDR)",
    "text_2026": "Please list the tool(s) in place to manage server protection (antivirus or EDR)",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "AWS Guard duty , Microsoft Azure",
    "comments_2026": "AWS Cloudwatch"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "19",
    "q2026_number": "19",
    "text_2025": "Please list the tool(s) in place to manage mobile device management of company-provided devices",
    "text_2026": "Please list the tool(s) in place to manage mobile device management of company-provided devices",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Intune",
    "comments_2026": "Microsoft Intune"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "20",
    "q2026_number": "20",
    "text_2025": "Please list the tool(s) in place to manage mobile device management of personal user devices.",
    "text_2026": "Please list the tool(s) in place to manage mobile device management of personal user devices.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Intune",
    "comments_2026": "N/A"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "21",
    "q2026_number": "21",
    "text_2025": "Please list the tool(s) in place to manage endpoint patch management.",
    "text_2026": "Please list the tool(s) in place to manage endpoint patch management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Intune",
    "comments_2026": "Microsoft Intune"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "22",
    "q2026_number": "22",
    "text_2025": "Please list the tool(s) in place to manage server and network patch management.",
    "text_2026": "Please list the tool(s) in place to manage server and network patch management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Intune, AWS",
    "comments_2026": "AWS RDS"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "23",
    "q2026_number": "23",
    "text_2025": "Please list the tool(s) in place to manage server and data backup.",
    "text_2026": "Please list the tool(s) in place to manage server and data backup.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "AWS RDS for databases,",
    "comments_2026": "AWS flyway"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "24",
    "q2026_number": "24",
    "text_2025": "Please list the tool(s) in place to manage network vulnerability management.",
    "text_2026": "Please list the tool(s) in place to manage network vulnerability management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "AWS guard duty, Microsoft Defender",
    "comments_2026": "Microsoft Defender and AWS Security Hub"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "25",
    "q2026_number": "25",
    "text_2025": "Please list the tool(s) in place to manage application vulnerability management.",
    "text_2026": "Please list the tool(s) in place to manage application vulnerability management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Defender",
    "comments_2026": "Microsoft Defender Vulnerability Management"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "26",
    "q2026_number": "26",
    "text_2025": "Please list the tool(s) in place to manage log management.",
    "text_2026": "Please list the tool(s) in place to manage log management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft entra Id, Microsoft Intune, Microsoft Defender, AWS guard duty",
    "comments_2026": "AWS Cloud watch and Microsoft Defender/Microsoft Azure"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "27",
    "q2026_number": "27",
    "text_2025": "Please list the tool(s) in place to manage security information and event management.",
    "text_2026": "Please list the tool(s) in place to manage security information and event management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Microsoft Defender",
    "comments_2026": "Microsoft Defender and AWS Cloudwatch"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "28",
    "q2026_number": "28",
    "text_2025": "Please list the vendor used for independent penetration testing.",
    "text_2026": "Please list the vendor used for independent penetration testing.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "Internal Penetration testing",
    "comments_2026": "none"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "29",
    "q2026_number": "29",
    "text_2025": "Please list the tool(s) in place to manage security training.",
    "text_2026": "Please list the tool(s) in place to manage security training.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "HoxHunt, Paylocity",
    "comments_2026": "Paylocity and HoxHunt"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "30",
    "q2026_number": "30",
    "text_2025": "Please list the tool(s) in place to manage simulated phishing testing.",
    "text_2026": "Please list the tool(s) in place to manage simulated phishing testing.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "HoxHunt",
    "comments_2026": "HoxHunt"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "31",
    "q2026_number": "31",
    "text_2025": "Please list any third-party managetd security providers in use and the type of services performed.",
    "text_2026": "Please list any third-party managetd security providers in use and the type of services performed.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "none",
    "comments_2026": "none"
  },
  {
    "category": "SECURITY TOOLS",
    "q2025_number": "32",
    "q2026_number": "32",
    "text_2025": "Please list the tool(s) in place for cloud security posture management.",
    "text_2026": "Please list the tool(s) in place for cloud security posture management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "AWS security hub",
    "comments_2026": "AWS Security Hub and AWS Cloud Watch"
  },
  {
    "category": "ORGANIZATION AND PLANNING",
    "q2025_number": "33",
    "q2026_number": "33",
    "text_2025": "Which of the following are in place relating to the assignment of responsibilities for security?",
    "text_2026": "Which of the following are in place relating to the assignment of responsibilities for security?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "4.4",
    "comments_2026": "All roles and responsibilities of IR team members are outlined in the IR policy for Studio Designer. These roles are defined but are only given in times of emergency. The principle for all Cybersecurity is the Analyst and CTO.",
    "attachments_2025": [
      "Leader of Security program.png",
      "roles and responsibilities.png"
    ],
    "attachments_2026": [
      "Aretstapcohnmsiebniltit:i eAsn.aplnygst.png",
      "Studio Designer Incident Response Policy.pdf",
      "roles and"
    ],
    "options_diff": [
      {
        "text": "Responsibilities have not been assigned for the security program.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Named individual(s) are in place with ultimate responsibility and accountability for the security program.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Which of the following security responsibilities have been assigned?",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "- overall roadmap and program oversight,",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "- program budget management or oversight,",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "- security policy and procedure management,",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "- cyber insurance accountability.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "None of the above or other. Please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "The names of the individual(s) responsible for the security program. Please check when listed below or uploaded to the data room.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A listing of the roles and responsibilities. Please check when listed below or uploaded to the data room.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "ORGANIZATION AND PLANNING",
    "q2025_number": "34",
    "q2026_number": "34",
    "text_2025": "Which of the following are in place to ensure data privacy accountability is assigned and a regular schedule of maintenance activities is performed to facilitate compliance through regulatory and company environment changes?",
    "text_2026": "Which of the following are in place to ensure data privacy accountability is assigned and a regular schedule of maintenance activities is performed to facilitate compliance through regulatory and company environment changes?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2025": "We do not maintain a schedule for maintaining or reviewing our privacy policy.",
    "attachments_2025": [
      "Privacyofficer.png",
      "Privacy Policy _ Studio Designer.html"
    ],
    "attachments_2026": [
      "APrtitvaacchym_ePnrot:g Prarimva_cPyoolifcfyic.deor.cpxng",
      "Privacy Policy _ Studio Designer.html"
    ],
    "options_diff": [
      {
        "text": "The privacy policy is approved by the person with overall privacy responsibility.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A review of applicability of regulatory changes is performed at least annually by the individual responsible for data privacy along with inside or outside counsel.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "A review and confirmation of data processing activities is performed.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A review and approval of the company's privacy policy is performed.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or alternative controls are in place. Please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "The name of the individual(s) ultimately accountable for privacy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A copy of the companyʼs privacy policy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A schedule of activities performed to maintain the privacy program including owners.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "ORGANIZATION AND PLANNING",
    "q2025_number": "35",
    "q2026_number": "35",
    "text_2025": "Please indicate which of the following apply relating to cybersecurity insurance.",
    "text_2026": "Please indicate which of the following apply relating to cybersecurity insurance.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "options_diff": [
      {
        "text": "The organization does not maintain cyber liability insurance.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "The organization maintains cybersecurity insurance.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "There are no policy exclusions or all policy exclusions have been addressed through appropriate risk mitigation measures. Please list any exclusions that have not been mitigated.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Select all of the following that are covered in the policy.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– data breach and privacy",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– network security",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– business interruption",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– cyber extortion",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– crisis management",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– support for public relations",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "The companyʼs current cyber insurance policy including any exclusions to the policy coverage. Please check when uploaded to the data room.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Evidence that any resolvable exclusion criteria have been reviewed and are remediated. Please check when uploaded to the data room.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "ORGANIZATION AND PLANNING",
    "q2025_number": "36",
    "q2026_number": "36",
    "text_2025": "Which of the following are in place relating to the usage of generative AI in the organization?",
    "text_2026": "Which of the following are in place relating to the usage of generative AI in the organization?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2025": "Version control for the document is at the bottom of the page. - An apnanguea.l schedule on the footer of the",
    "comments_2026": "The schedule is located in Section 4.",
    "attachments_2025": [
      "AIofficer.png",
      "Studio Designer GenAI Policy.pdf"
    ],
    "attachments_2026": [
      "AIofficer.png",
      "Studio Designer GenAI Policy.pdf"
    ],
    "options_diff": [
      {
        "text": "An AI usage policy exists.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Which of the following are included in the AI policy?",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "- A statement specifying particular usage is explicitly allowed, and it is denied by default.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "- Explicit forbidding of uploading company confidential, internal use, or intellectual property (including code) to third-party services without explicit approval.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "The AI policy is signed off.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Review of applicability of regulatory changes is performed at least annually by the individual responsible for AI along with inside or outside counsel.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "A periodic review and confirmation of GenAI usage activities is performed.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "An AI usage policy and practices are not in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "The names of the individual(s) accountable for generative AI governance. Please check when uploaded.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A copy of the companyʼs generative AI policy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A schedule of activities performed to maintain the AI policy compliance including owners.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "37",
    "q2026_number": "37",
    "text_2025": "Please indicate which of the following are in place to support backup management and testing.",
    "text_2026": "Please indicate which of the following are in place to support backup management and testing.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2025": "We utilize Jira Assests manager to track all business-critical applications.",
    "comments_2026": "We do not have a formal list for self- managed business-critical systems. But our two are AWS and Microsoft Business.",
    "attachments_2025": [
      "List of ITSM.png",
      "Assestsbackuphistory.png",
      "backups.png"
    ],
    "attachments_2026": [
      "Assestsbackuphistory.png",
      "backups.png"
    ],
    "options_diff": [
      {
        "text": "We use only third-party systems and the providers manage backups.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Backups occur at an appropriate recurrence based on application or data criticality,",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Backups are successfully completing,",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Backups are encrypted at rest.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Backups are immutable and cannot be deleted, altered, or overwritten OR backups are stored in a secure location offsite that are inaccessible from the primary hosting location.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Full test restoration of backups is performed at least annually.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above are in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A list of business-critical systems and applications that are self-managed (on-premise, data center, or public cloud). Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Backup schedule, configuration, and storage locations of backups for business-critical applications and systems, including immutability configuration. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Historical backup job reports for business-critical applications and systems. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "38",
    "q2026_number": "38",
    "text_2025": "Which of the following are in place to support multi-factor authentication for critical applications?",
    "text_2026": "Which of the following are in place to support multi-factor authentication for critical applications?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "4.0",
    "comments_2025": "The list of users and roles is located in the CSV. - Assets are tracked in Jira Asset manager.",
    "comments_2026": "We do not have any exceptions for MFA within our critical services. Dhango is sunset, and Google Cloud does not have a portal to show MFA.",
    "attachments_2025": [
      "A26tt.accshvment: mfapolicy.png",
      "configuration.png",
      "exportUserRegistrationDetails_2025-6-"
    ],
    "attachments_2026": [
      "AAtWtaSc_hMmFeAn_tU: MSEFRAS_.Npentgsuite.png",
      "list of critical business systems.png"
    ],
    "options_diff": [
      {
        "text": "MFA is not in place for critical applications",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "A systems inventory is maintained that identifies critical systems.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "MFA is enabled and enforced for critical systems via SSO/SAML or within the system itself.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "MFA authentication is enforced for every administrative access attempt.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "MFA authentication is required a minimum of every 72 hours for non- administrative access or upon ˮimpossible travelˮ.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "There are no exceptions to use of MFA or exceptions are documented and approved by the individual designated to have ultimate security accountability.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A list of all back-office, corporate, and hosted systems with business-critical systems identified and the type of MFA enabled for regular users and administrative users (e.g. Netsuite, SalesForce, Amazon AWS). Please check when provided.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "For systems with MFA enabled, provide the configuration and policy. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "For systems enabled with MFA, provide a list of users showing mode of authentication. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Provide a list of users, role, or team-based exceptions to MFA including rationale and approval. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "39",
    "q2026_number": "39",
    "text_2025": "Which of the following are in place to support email security, filtering, and protection to enhance email security?",
    "text_2026": "Which of the following are in place to support email security, filtering, and protection to enhance email security?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "4.0",
    "comments_2025": "All emails are inspected by Microsoft Defender. We do not make any exceptions.",
    "comments_2026": "We do not make any exceptions to our email inspections therefore, there is no valuable evidence.",
    "attachments_2025": [
      "Phishingprotection.png",
      "blockedemails.png"
    ],
    "attachments_2026": [
      "blockedemails.png",
      "Allowed Emails.csv",
      "DefenderPhishing.png"
    ],
    "options_diff": [
      {
        "text": "We do not use an enhanced email scanning system or similar tools to inspect and filter email content and attachments.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "We use an email gateway tool or similar enhanced level of scanning to inspect email content and attachments.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Email policy configurations are enforced across the organization.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Exceptions to email inspection are documented including the rationale and are approved by the individual designated to have ultimate security accountability.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Warning banners are implemented for external emails.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "External email auto-forwarding of a users email account is disabled or ​ alerts are sent ​if a email rule is created.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of the phishing protection tooling console(s), policy configuration, and event logs. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list of users, role, or team-based exceptions to email inspection including rationale and approval. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A historical report of blocked versus allowed email over the past 6 months. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "40",
    "q2026_number": "40",
    "text_2025": "Which of the following apply to the management of bring-your-own- device (BYOD) user devices?",
    "text_2026": "Which of the following apply to the management of bring-your-own- device (BYOD) user devices?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2026": "Studio Designer doesnt manage a BYOB policy. Therefore, there is no evidence to provide for BYOB.",
    "attachments_2025": [
      "byod_2025-6-27.csv",
      "compliancedevices.png"
    ],
    "options_diff": [
      {
        "text": "The use personal (BYOD) devices is not permitted and mechanisms are in place to prevent connection to applications or networks.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Tools are not utilized to manage BYOD user devices.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "A tool is in place to centrally manage personal devices that connect to company systems and networks.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Encryption-at-rest is enforced for all devices in management.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Strong passcodes are enforced to unlock devices.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Software update and patching policies are enforced.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Audit and event logging is enabled and are retained for at least 90 days.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Exceptions to bring-your-own-device management are documented and approved by the individual designated to have ultimate security accountability.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Screenshots or export of the end-user device management tooling console(s), policy configuration, and the central console event summary or audit log. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list of devices enrolled in mobile device management. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Compliance report against the defined policy. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "41",
    "q2026_number": "41",
    "text_2025": "Which of the following apply to endpoint protection for end-user devices?",
    "text_2026": "Which of the following apply to endpoint protection for end-user devices?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2025": "All devices and users listed in the.csv are enrolled in Defender for Endpoint.",
    "attachments_2025": [
      "screenshotofprotection.png",
      "byod_2025-6-27.csv",
      "Eventlog.png"
    ],
    "attachments_2026": [
      "Alotgta.pcnhgment: endpoint protection console.png",
      "Enrolled end-user devices.csv",
      "endpoint"
    ],
    "options_diff": [
      {
        "text": "Endpoint protection is not in place.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Endpoint protection management is centralized (even if across multiple vendors).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Software and signature updates occur automatically and at least every 24 hours.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "There are no exceptions to endpoint protection for end-user devices OR exceptions to endpoint protection on servers are documented and approved by the individual designated to have ultimate security accountability and have risk-mitigating compensating controls in place",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Screenshots or export of the endpoint protection tooling console(s). Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Enrolled end-user device and server listing, Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Event log. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list of user endpoints. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "42",
    "q2026_number": "42",
    "text_2025": "Which of the following apply to endpoint protection for servers?",
    "text_2026": "Which of the following apply to endpoint protection for servers?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "attachments_2025": [
      "AexttpaocrhtUmseenrtR: eAgWisStrsaetriovneDrpertoatielsc_t2io0n2.5p-n6g-",
      "2 s6c.rcesevn",
      "sAhWotSoefpvreonttelocgti.opnn.gp",
      "n Sge",
      "rEvveernst.lpongg.png"
    ],
    "attachments_2026": [
      "A(5t)t.apcnhgment: Endpoint protection for servers.png",
      "list of servers.png",
      "event log.png",
      "image"
    ],
    "options_diff": [
      {
        "text": "Endpoint protection for servers is not in place.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Endpoint protection management is centralized (even if across multiple vendors).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Software and signature updates occur automatically and at least every 24 hours.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "There are no exceptions to endpoint protection for servers OR exceptions to endpoint protection on servers are documented and approved by the individual designated to have ultimate security accountability and have risk-mitigating compensating controls in place.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Screenshots or export of the endpoint protection tooling console(s) and software or signature update configuration. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Enrolled end-user device and server listing, Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Event log. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list servers. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "43",
    "q2026_number": "43",
    "text_2025": "Which of the following are in place for user device configuration and patch management?",
    "text_2026": "Which of the following are in place for user device configuration and patch management?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2025": "We do not make any exceptions in our endpoint protection.",
    "comments_2026": "We do not have any exceptions to the endpoint protection. Therefore, there isnt any evidenve to report.",
    "attachments_2025": [
      "APottlaiccyh.mdoecnxt: configuration.png",
      "buildchecklist.png",
      "Studio Designer Patch Mangement"
    ],
    "attachments_2026": [
      "EAnttraocllhemd eEnntd: pSotuindtiso.Dpnegsi",
      "g pnaetrc_hP aretcphoirntg.pVnuglnerabilityPolicy.pdf",
      "Configuration Console.png"
    ],
    "options_diff": [
      {
        "text": "Configuration and patch management for end-user devices is not in place or is informally managed.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Configuration management is centralized for end-user devices (even if across multiple vendors).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A documented patch management policy exists and requires patching of critical and high severity patches for end-user devices within 30 days of release by the vendor.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Exceptions to endpoint configuration management are documented and approved by the individual designated to have ultimate security responsibility.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of Configuration management tooling console(s), Enrolled endpoint and server listing, Examples of polic(ies) applied to endpoints including patching policy, Event log, and Patch report",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Documented patch management policy. Please check when provided.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Documented build checklist or policy. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list of endpoint exceptions to the endpoint protection scope including rationale and approval, this includes endpoints and servers that are not patched to the latest versions. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "44",
    "q2026_number": "44",
    "text_2025": "Which of the following are in place for server configuration and patch management?",
    "text_2026": "Which of the following are in place for server configuration and patch management?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "3.3",
    "comments_2025": "We do not have any exceptions on our server configuration.",
    "comments_2026": "We do not have any exceptions to the endpoint protection. Therefore, there isnt any evidence to report.",
    "attachments_2025": [
      "Servers.png",
      "Studio Designer Patch Mangement Policy.docx"
    ],
    "attachments_2026": [
      "APatttacchhmmaennatg: eSmtuedniot_DUepsdigantee_rR_Pinagtcs.hpinnggVulnerabilityPolicy.pdf"
    ],
    "options_diff": [
      {
        "text": "Configuration and patch management for servers is not in place or is informally managed.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Configuration management is centralized for servers (even if across multiple vendors).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A documented patch management policy exists and requires patching of critical and high severity patches for servers within 30 days of release by the vendor.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Exceptions to server configuration management are documented and approved by the individual designated to have ultimate security responsibility.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of Configuration management tooling console(s), Enrolled server listing, Examples of polic(ies) applied to servers including patching policy, Event log, and Patch report",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Documented patch management policy. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list of server exceptions to the endpoint protection scope including rationale and approval, this includes endpoints and servers that are not patched to the latest versions. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "45",
    "q2026_number": "45",
    "text_2025": "Which of the following are in place for network device hardening and patch management.",
    "text_2026": "Which of the following are in place for network device hardening and patch management.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "attachments_2025": [
      "byod_2025-6-27.csv",
      "buildchecklist.png"
    ],
    "options_diff": [
      {
        "text": "Processes to harden and patch network devices are not in place or are primarily informal.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Only the SSH and HTTPS remote management protocols are used.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Management and administrative interfaces are not exposed to the public Internet.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Multi-factor authentication is required for administration.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Default and root accounts are disabled or have strong, non-default passwords",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Network devices are patched in alignment with documented policy",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Exceptions to network hardening and patch management are documented and approved by the individual designated to have ultimate security responsibility.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above are in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      }
    ],
    "evidence_diff": [
      {
        "text": "Network device asset list. Please check when provided.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Network device patch level report. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Documented build checklist or process. Please check when provided.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Network device patch management policy. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "46",
    "q2026_number": "46",
    "text_2025": "Which of the following apply to the management of accounts with administrative privileges?",
    "text_2026": "Which of the following apply to the management of accounts with administrative privileges?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "3.3",
    "attachments_2025": [
      "exportUsers_2025-6-27.csv",
      "export16241652988638895140.csv"
    ],
    "attachments_2026": [
      "business critical systems.csv",
      "Global Admins.png",
      "Global Activity Log.png"
    ],
    "options_diff": [
      {
        "text": "Individuals with global administrator rights across systems are limited and appropriate.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Administrator accounts are not shared.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "All administrator account activity is logged and monitored regularly.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Individuals use different credentials to log in to accounts with global administration rights versus day-to-day accounts.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Multi-factor authentication is enabled without exception.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Administrators do not use service accounts for performing administrative actions.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "None of the above are in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A list of all back-office, corporate, and hosted systems with business-critical systems identified (e.g. Active Directory, Office365, Netsuite, SalesForce, Amazon AWS).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of the list, titles, and employment status (FTE, contractor, MSP) of the Domain Administrators group for Active Directory, root accounts for cloud providers, and equivalent for back-office systems.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Global account activity log.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "47",
    "q2026_number": "47",
    "text_2025": "Which of the following are in place to support network segregation?",
    "text_2026": "Which of the following are in place to support network segregation?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "attachments_2025": [
      "AWSWAF.png",
      "internalfirewall.png"
    ],
    "attachments_2026": [
      "internal firewall.png",
      "AWSWAF.png",
      "AWSserverprotection.png"
    ],
    "options_diff": [
      {
        "text": "The network is not adequately segregated.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Perimeter firewalls or security groups have “default denyˮ enabled and only allow explicitly approved traffic (public / private DMZ exists).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Internal firewalls or security groups have “default denyˮ enabled and only allow explicitly approved traffic (public / private DMZ exists).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of perimeter firewall(s) policies and configuration displaying ports and services open to the Internet. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of internal firewall(s) policies and configuration. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "48",
    "q2026_number": "48",
    "text_2025": "Which of the following are in place to support secure remote access?",
    "text_2026": "Which of the following are in place to support secure remote access?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "N/A",
    "comments_2026": "Remote Access is not permitted.",
    "attachments_2025": [
      "Endpointcheck.png",
      "RemoteAudit.png"
    ],
    "options_diff": [
      {
        "text": "Remote access is not permitted.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "​IPSec-based VPN connections using key exchange are not used to support user remote access.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "SSL VPN access terminates after a period of 60 minutes of inactivity.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Multi-factor authentication is required for all VPN or other remote access mechanisms.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Email is not used to provide the multi-factor authentication token.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Access is granted using role or group-based permissions.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Audit logs of user connectivity is kept for at least 90 days.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Block listing of embargoed countries and non-primary workforce locations via geo-restrictions is enabled.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Exceptions to remote access requirements are documented and approved by the individual designated to have ultimate security responsibility,",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      }
    ],
    "evidence_diff": [
      {
        "text": "Remote access tooling configuration including a screenshot or export of userʼs allowed to access the environment remotely, multi-factor authentication enforcement, encryption algorithms, audit logging, geo-restriction configuration, and timeout.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Endpoint checks for systems (up to date patching, AV running, etc.). Please check when provided.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "A screenshot or export of the audit log including user connections. Please check when provided.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "49",
    "q2026_number": "49",
    "text_2025": "Which of the following are in place to support monitoring, alerting and timely response to security events?",
    "text_2026": "Which of the following are in place to support monitoring, alerting and timely response to security events?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "3.3",
    "attachments_2025": [
      "Aticttkaecthemxaemntp: lien.cpindgents-queue-20250630.csv",
      "IR FlowCharts - IR Plan.pdf"
    ],
    "attachments_2026": [
      "IR FlowCharts - IR Plan.pdf",
      "event log.png",
      "ticketexample.png",
      "call tree.png"
    ],
    "options_diff": [
      {
        "text": "Monitoring processes are not in place or are informal.,An outsourced managed services provider is responsible for monitoring alerts, events, and audit logs.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "A call tree is documented specifying the order in which key stakeholders in the organization are notified, when, and how.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Runbooks and tooling include the ability for the security operations center or similar team to take immediate action to quarantine or isolate infections.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Call tree for alerting that requires attention. Please check when provided.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "A screenshot or export of a reporting dashboard showing last 3 months of log activity. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Documented processes for response: SLAs, checklists, and runbooks. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Example tickets for response. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "50",
    "q2026_number": "50",
    "text_2025": "Which of the following are in place to support remote tooling hardening?",
    "text_2026": "Which of the following are in place to support remote tooling hardening?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "comments_2025": "We do not support remote tooling for administrators.",
    "options_diff": [
      {
        "text": "Individuals with administrative rights access to tooling is limited and appropriate.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Administrator accounts are not shared.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Administrative access requires multifactor authentication on every login.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "All administrative activity and support sessions are logged and stored for 1 year.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Remote support sessions automatically log off or require reconnection after 30 minutes.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Initiating remote support sessions requires one of: One-time passcode or pin; Certificate-based authentication; or Biometric verification.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A list of all remote support tools used internally or by third-parties (MSP) including but not limited to: TeamViewer, Splashtop, GoToMyPC, AnyDesk, RemotePC, Zoho Assist, VNC Connect.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Remote support tooling configuration including logging configuration.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "A list of employees and contractors and access levels for each of the remote support tools.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "51",
    "q2026_number": "51",
    "text_2025": "Which of the following are in place to support encryption at rest o end user devices?",
    "text_2026": "Which of the following are in place to support encryption at rest o end user devices?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "attachments_2025": [
      "byod_2025-6-27.csv",
      "Revoverykeys.png"
    ],
    "attachments_2026": [
      "ADtetvaicchemsWenitth: IDnevveincteoEryn_c1r6yfp1t4iobn5V43-2_d999e4f-f455234c-b-bcf26ff--440107f81-0b0752024-3f33.6ziap7",
      "3 rce3c0ovee9r1y.z kipe",
      "y access"
    ],
    "options_diff": [
      {
        "text": "Encryption-at-rest is deployed on all hard disks on all end-user devices. fCentralized, industry recognized tooling is used to manage encryption (even if multiple vendors).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Deprecated encryption and hashing algorithms, including the below, are not utilized for the encryption process. - DES - 3DES - RC4 - MD5 - SHA1",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Recovery keys are only accessible by authorized personnel.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of: - Encryption at rest tooling console(s) - Enrolled end-user device listing.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "End-user device asset list including laptops, desktops, tablets, and mobile devices.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Recovery key access list. list.png",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "52",
    "q2026_number": "52",
    "text_2025": "Which of the following are in place to centrally manage public cloud account structure?",
    "text_2026": "Which of the following are in place to centrally manage public cloud account structure?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "2.5",
    "comments_2025": "All cloud accounts are managed by our Principal Cloud Architect. Each account is correlated with its specific functions.",
    "attachments_2025": [
      "hiearchy.png",
      "cloudaccounts.png"
    ],
    "attachments_2026": [
      "cloudaccounts.png"
    ],
    "options_diff": [
      {
        "text": "Accounts are consolidated in the multi-account structure without exception.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Accounts have a designated and documented owner and purpose.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "None of the above are in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Inventory of cloud accounts including owner, purpose, and whether they are centrally managed or not.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of organizational hierarchy or structure from cloud console.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "53",
    "q2026_number": "53",
    "text_2025": "Which of the following are in place to support network access control?",
    "text_2026": "Which of the following are in place to support network access control?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "attachments_2025": [
      "networkaccesspolicy.png",
      "networktracking.png",
      "networkassesttracking.png"
    ],
    "attachments_2026": [
      "network access control dashboard.png",
      "Assest Tracking.png"
    ],
    "options_diff": [
      {
        "text": "Unauthorized and unknown devices are, by default, not allowed on company networks.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Certificates or user authentication are used to identify and authenticate known devices.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Real-time visibility of the assets on networks is available.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Stakeholders are notified immediately when an unauthorized device attempts to connect to company networks (excluding guest networks).",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of network access control tooling configuration including policy enforcement or checks performed prior to allowing an asset on the network.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of asset tracking of the network(s) in real-time.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "54",
    "q2026_number": "54",
    "text_2025": "Please indicate which of the following are in place to secure LLM training data.",
    "text_2026": "Please indicate which of the following are in place to secure LLM training data.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "comments_2025": "We do not utilize LLMs for training.",
    "comments_2026": "Studio Designer does not train LLMs or maintain any LLMS.",
    "options_diff": [
      {
        "text": "Security training is not in place or is performed informally.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "All sources of training data are licensed for use and fit for purpose.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "The access control list aligns to the least privilege principle based on roles or groups.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Training data is encrypted at rest at the repository, disk, or data level using AES256 or another modern algorithm.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Encryption keys are managed by authorized personnel only.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      }
    ],
    "evidence_diff": [
      {
        "text": "An inventory of training data including the source of the data, license for use, and where it is stored. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Access control lists for training data repositories including name and role. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Access control lists for training data repositories including name and role. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "55",
    "q2026_number": "55",
    "text_2025": "Please indicate which of the following are in place to secure the LLM environment.",
    "text_2026": "Please indicate which of the following are in place to secure the LLM environment.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "comments_2025": "We do not utilize LLMS.",
    "comments_2026": "SLLtuMdsio. Designer does not train",
    "options_diff": [
      {
        "text": "Security training is not in place or is performed informally.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Authentication is centralized across accounts.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Strong password policy is in place that requires twelve characters.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Multifactor authentication is enforced and re-authentication is enabled.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Group or role structures are in place to grant permissions.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Administrative accounts, groups, or roles are separate from day-to-day use.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Least privilege and role-based access principles are enforced via policies.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Filtering devices (e.g. firewall, software firewall, WAF, etc.) exist between network housing model file and development, staging, and other environments.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Access to the environment is “default denyˮ.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Model files are immutable (read-only) and not directly accessible.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of authentication and authorization requirements for model or model environment are accessed for inference, training, or management. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of firewall(s) or system policies and configuration displaying how models or the model environment are accessed for inference, training, or management. Please check when provided.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2025_number": "56",
    "q2026_number": "56",
    "text_2025": "Please indicate which of the following are in place to ensure base model integrity.",
    "text_2026": "Please indicate which of the following are in place to ensure base model integrity.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "comments_2025": "We do not utilize LLMS.",
    "comments_2026": "Studio Designer does not manage and LLMs.",
    "options_diff": [
      {
        "text": "Base models are not managed or are informally managed.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "All base model signature and sources are verified prior to use.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Validity and bias testing of the base model is performed prior to deployment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Security testing of the base model is performed prior to deployment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Records of security and validity testing.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "TECHNICAL AND TOOLING",
    "q2026_number": "57",
    "text_2026": "AI/LLM Visibility",
    "isNew": true,
    "isDeleted": false,
    "score_2026": "3.6",
    "comments_2026": "All approved AI have a metric dashboard that shows all usage.",
    "options_diff": [
      {
        "text": "A documented inventory of approved generative AI tools and associated business use cases is maintained and reviewed at least annually.",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Technical controls are implemented to detect or restrict unauthorized (“shadowˮ) use of generative AI tools.",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "GenAI use cases are risk-classified based on data sensitivity and business impact",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "An approval and risk review process exists for onboarding new generative AI tools or use cases.",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Logging and monitoring mechanisms provide visibility into enterprise- approved GenAI usage",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Sensitive data monitoring controls (e.g., DLP, CASB, proxy controls) are configured to address external AI platforms.",
        "checked_2026": false,
        "status": "added"
      },
      {
        "text": "None of these are in place (please comment)",
        "checked_2026": false,
        "status": "added"
      }
    ]
  },
  {
    "category": "SECURE PROCESS",
    "q2025_number": "57",
    "q2026_number": "58",
    "text_2025": "Please indicate which of the following procedures and protection mechanisms are in place to protect high risk transactions.",
    "text_2026": "Please indicate which of the following procedures and protection mechanisms are in place to protect high risk transactions.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "comments_2025": "Our company has signed a contract with Silicon Valley Bank authorizing two primary account holders. This contract requires SMS MFA from authorized account owners, and a screenshot is attached as evidence. The online banking system does not allow configuration of MFA-enabled features. That security is built into the platform. For sensitive or key transactions, the user requesting the transaction must be authenticated using MFA and cannot approve the transaction. Transactions must be approved by another user with MFA authentication within the banking platform.",
    "attachments_2025": [
      "APottlaiccyh.mdoecnxt:",
      "SSttuuddiioo  AVcecnoduonr tRsi sPka yPaoblilcey P.dooliccxy",
      ". dVoecnxd",
      "o Srt Puadyiom Peanytms.denotc xP",
      "r oScVcBeMssFiAng.png"
    ],
    "attachments_2026": [
      "SVBMFA.png",
      "Studio Payment Proccessing Policy.docx",
      "example invoice .png"
    ],
    "options_diff": [
      {
        "text": "A procedure for high-risk transactions is in place and requires known- voice verification or the equivalent for inbound and outbound money exchange processes including: Payroll, bank account changes, changes to payable account bank information, and changes to receivable account bank information",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Multi-factor authentication is required for login to all bank accounts across the enterprise.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Ad-hoc wire transfers need multi-stage and multi-party approval.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Invoices state the company will never ask you to change remittance information via email.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above are in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Procedure documenting the requirements for high- risk transactions including, payroll, bank account changes, changes to payable account bank information, and changes to receivable account bank information. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of multi-factor authentication configuration for bank account(s) (redact out non-applicable information). Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A copy of example invoices. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "SECURE PROCESS",
    "q2025_number": "58",
    "q2026_number": "59",
    "text_2025": "Which of the following are in place for high risk transaction policy accountability, and training?",
    "text_2026": "Which of the following are in place for high risk transaction policy accountability, and training?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "2.0",
    "attachments_2026": [
      "APottlaiccyh.mdoecnxt:",
      "SExtuadmiop lPea Pyamyemnet nPtr .opcncgessing Policy.docx",
      "Studio Accounts Payable"
    ],
    "options_diff": [
      {
        "text": "A policy is in place for high risk transactions that contains the statement \"No changes to financial systems shall occur through email exchanges, or without known-voice verification. These systems include but may not be limited to payroll, vendor payables, and bank accounts.ˮ",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "The policy has been updated within the past year.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "The policy states that all employees and contractors with access to financial systems are required to sign off on the policy at onboarding and prior to being granted access to any financial system.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Is signed off on by the Chief Financial Officer of the company.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "All employees and contractors with access to or ability to change financial systems have digitally or physically signed off on their responsibility relative to the policy during onboarding and at least annually thereafter.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment below.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "A screenshot or export of a training tool or copies of paperwork showing that members of the above list have signed off on the company policy.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      }
    ],
    "evidence_diff": [
      {
        "text": "Documentation showing the policy around high risk transaction systems including payroll and bank account changes.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "A listing of employees and contractors with access to or ability to request changes to financial systems (e.g. - payroll systems, vendor payables, and bank accounts).",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      }
    ]
  },
  {
    "category": "SECURE PROCESS",
    "q2025_number": "59",
    "q2026_number": "60",
    "text_2025": "Please indicate which of the following are in place to support preparedness to respond to a security incident, have a documented plan, and test that plan at least annually.",
    "text_2026": "Please indicate which of the following are in place to support preparedness to respond to a security incident, have a documented plan, and test that plan at least annually.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "3.1",
    "comments_2025": "A tabletop Simulation has not been done yet.",
    "comments_2026": "A tabletop has now been done for the IR plan this year, but is planned.",
    "attachments_2025": [
      "Studio Designer Incident Response Policy Updated.docx"
    ],
    "attachments_2026": [
      "Studio Designer Incident Response Policy.pdf"
    ],
    "options_diff": [
      {
        "text": "We do not have an incident response plan or supporting procedures.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Documented incident management and response plan and procedure(s) exist.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Which of the following are documented in the plan and procedures? (Select all that apply)",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "- roles and responsibilities",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "- external communication strategy",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "- internal communication strategy including notification procedures to the PE firm at the time of incident",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "- communication templates",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "The test has been facilitated and documented by a third-party.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "The incident response plan has been tested within the past 12 months.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "The test includes ransomware and business email compromise scenarios.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "The test Involved all stakeholders – Exec leadership, Security, IT, HR, Counsel, client-facing roles, PE firm leadership",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "The test includes documented lessons learned and improvements to be made with action owners.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "AI-related incident scenarios are tested through tabletop or simulation exercises",
        "checked_2026": false,
        "status": "added"
      },
      {
        "text": "The incident response plan explicitly includes AI-related incident scenarios",
        "checked_2026": false,
        "status": "added"
      },
      {
        "text": "AI-related incident scenarios are tested through tabletop or simulation exercises",
        "checked_2026": false,
        "status": "added"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Provide a copy of your incident response plan. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Provide a third-party or internal report or written overview describing the last test of the plan (tabletop being sufficient).",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      }
    ]
  },
  {
    "category": "SECURE PROCESS",
    "q2025_number": "60",
    "q2026_number": "61",
    "text_2025": "Please indicate which of the following are in place so support preparedness to respond to a security incident or disaster, recover critical systems and data, have a backup management program in place with documented recovery procedure(s), and test that plan at least annually.",
    "text_2026": "Please indicate which of the following are in place so support preparedness to respond to a security incident or disaster, recover critical systems and data, have a backup management program in place with documented recovery procedure(s), and test that plan at least annually.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "3.8",
    "attachments_2025": [
      "AWS Region Failure DR Playbook.md"
    ],
    "attachments_2026": [
      "AWS Regional Failure Disaster Recovery Playbook - Overview.pdf"
    ],
    "options_diff": [
      {
        "text": "We do not maintain any systems, all systems are cloud-based or outsourced.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "We do not have processes in place to adequately respond to security events or disasters and recover systems.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Technical recovery procedures or runbooks exist for critical systems.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Technical recovery procedures or runbooks are adequately up-to-date.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "An offline copy of the runbooks has been saved in a secure location.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Which of the following are documented in the procedures / runbooks? (Select all that apply)",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "- a listing of key stakeholders including IT, networking, security, and critical third-party or vendor contacts",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "- the locations of data backups if applicable",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "- the locations of server / infrastructure backups",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "- prescriptive instructions on how to rebuild network and server environment including system dependencies, recovery ordering, validation steps, and system requirements.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "An offline copy of the runbooks has been saved in a secure location (e.g. with Private Equity)",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above are in place or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A copy of technical recovery runbooks for critical systems and applications.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "SECURE PROCESS",
    "q2025_number": "61",
    "q2026_number": "62",
    "text_2025": "Please indicate which of the following are in place to support associate onboarding and offboarding processes.",
    "text_2026": "Please indicate which of the following are in place to support associate onboarding and offboarding processes.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "attachments_2025": [
      "contractoronboarding.png"
    ],
    "attachments_2026": [
      "AOtFtFaBchOmAeRnDtI:N OGN_BTOICAKREDTI.NpGng_PROCESS.png",
      "OFFBOARDING_PROCESS.png"
    ],
    "options_diff": [
      {
        "text": "Onboarding and offboarding procedures are not in place or are informal.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Documented onboarding and offboarding procedures exist.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Separation of duties is in place between those requesting the onboarding or offboarding and those approving access to systems.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A checklist of critical systems access is validated during onboarding and offboarding.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Procedures are in place to obtain a return of assets during offboarding.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Offboarding of access to systems occurs within 24 hours of request and within 4 hours for IT administrative users.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Personal devices are wiped of company data as part of the process or checklist for offboarding.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Provide a copy of your onboarding and offboarding process. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export example of onboarding and offboarding requests (tickets) for new and terminated employees, contractors, or vendors. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "SECURE PROCESS",
    "q2026_number": "63",
    "text_2026": "Secure agentic engineering review",
    "isNew": true,
    "isDeleted": false,
    "score_2026": "3.6",
    "options_diff": [
      {
        "text": "Human review is mandatory for AI-generated code prior to merge or deployment",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "AI-generated code is subject to secure coding standards and automated security testing prior to release",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "AI-generated changes cannot bypass standard peer review and change management processes",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Developers are required to disclose or tag AI-assisted code contributions",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Reviewers are trained to identify AI-specific risks (e.g., hallucinated logic, insecure defaults, licensing concerns)",
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "Licensing and intellectual property risks of AI-generated code are evaluated prior to release",
        "checked_2026": false,
        "status": "added"
      },
      {
        "text": "None of these are in place (please comment)",
        "checked_2026": false,
        "status": "added"
      }
    ]
  },
  {
    "category": "RECURRING HYGIENE",
    "q2025_number": "62",
    "q2026_number": "64",
    "text_2025": "Which of the following are in place to ensure automated or manual security testing of code occurs prior to release of changes. Issues identified by security testing are resolved in a timely manner?",
    "text_2026": "Which of the following are in place to ensure automated or manual security testing of code occurs prior to release of changes. Issues identified by security testing are resolved in a timely manner?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "5.0",
    "attachments_2025": [
      "Aquttaalcithymasesnutr:a SnAcSeT.psncgreenshot.png",
      "Development Lifecycle - Overview.html"
    ],
    "attachments_2026": [
      "SAST_Screenshot.png",
      "SDLC_POLICY.png",
      "QA_Test.png"
    ],
    "options_diff": [
      {
        "text": "All code and dependencies for client-facing software is manually QA tested or scanned via automation for security issues.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Documented software development process or policy exists and requires resolution of critical and high severity security issues within 30 days of identification.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Critical or high severity vulnerabilities have been reviewed, triaged, and have been resolved or will be resolved within the next 30 days.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of tooling utilized for security testing such as SAST, DAST, dependency scanning, or automated QA.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of quality assurance tests that are specific to security.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Documented software development lifecycle process or policy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "RECURRING HYGIENE",
    "q2025_number": "63",
    "q2026_number": "65",
    "text_2025": "Please indicate which of the following are in place to support security and AI training.",
    "text_2026": "Please indicate which of the following are in place to support security and AI training.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "3.1",
    "comments_2026": "Employees are currently not required to sign off on the AI/Security Policy. A mandatory training with the Cybersecurity Analyst is required upon hiring.",
    "attachments_2025": [
      "AAtIStaigcnhamtuernet:. pcnegn",
      "t rsaelcizuerdittyrpaionliincgys.pignnga",
      "tturarein.pinnggc",
      "actoamlopgl.eptnegd",
      "t trraaininininggmfroedqu.plen.gp",
      "ng"
    ],
    "attachments_2026": [
      "ARettqaucihremde_nTtr:a Cineinntgr_aSliczheedd turalein.pinngg.",
      "p 2n0g2",
      "R6 eCqoumirepdlia_Tnrcaei nTinragi_nCinagt aRloegsu.pltnsg (",
      "1).xlsx"
    ],
    "options_diff": [
      {
        "text": "Security training is not in place or is performed informally.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "AI training is not in place or is performed informally.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "The training policy requires training during onboarding and at least annually thereafter.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "A record of attendance is generated for those participating in the training.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Required training includes security best practices.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes phishing, smishing, and vishing.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes social engineering.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes business email compromise.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes generative AI overview.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes the responsible use of GenAI.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes risks of GenAI.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "Required training includes company-specific GenAI policy.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "All employees and relevant contractors are required to, and have signed off on the companyʼs Generative AI policy.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "All employees and relevant contractors are required to, and have signed off on the companyʼs Security or Acceptable Use policy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "A screenshot or export of centralized training or learning management system if applicable. Please check when provided.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of title and table of contents of required training module(s) or content.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of policy or recurrence of training.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of most recent sign-off of employees on the AI policy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of most recent sign-off of employees on the security policy.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "If applicable, screenshot of previously completed training campaigns.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "RECURRING HYGIENE",
    "q2025_number": "64",
    "q2026_number": "66",
    "text_2025": "Which of the following are in place for third-party network penetration testing?",
    "text_2026": "Which of the following are in place for third-party network penetration testing?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "comments_2026": "All penetration testing is handled internally. We are working with a company this year to complete a third-party pentest.",
    "options_diff": [
      {
        "text": "Penetration is performed by a qualified third-party against all public- facing infrastructure and includes manual testing and verification of issues.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "The scope of the testing is non-credentialed external network testing and includes: - All domains of the company and its acquisitions - DNS enumeration (reconnaissance) of domains in scope - IP addresses or hostnames of all sites not tied to DNS including offices, manufacturing locations, data centers, and cloud infrastructure.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "The penetration testing report is within the last 12 months.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Critical and high severity vulnerabilities identified in the report have been remediated and third-party re-test has taken place to confirm fixes.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "An export of the domains, IP addresses, and hostnames being scanned on a recurring basis.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Inventory of acquisitions made over the past 5 years.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "The organizationʼs most recent third-party external network penetration report if available.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "RECURRING HYGIENE",
    "q2025_number": "65",
    "q2026_number": "67",
    "text_2025": "Which of the following are in place for third-party application penetration testing?",
    "text_2026": "Which of the following are in place for third-party application penetration testing?",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "comments_2026": "Studio Designer has not had a Third-Party Pentest.",
    "options_diff": [
      {
        "text": "An application vulnerablity managment policy is in place.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "The application vulnerability management policy requires a credentialed third-party penetration testing of developed and hosted SaaS software at least annually.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Critical or high severity findings in the tests have been reviewed, triaged, and have been resolved or will be resolved within 60 days of indentification.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "None of the above or other, please comment.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ],
    "evidence_diff": [
      {
        "text": "Please provide a copy of your vulnerability management policy and process.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "If applicable, provide historical copies of detailed non-credentialed application penetration testing reports including scope and findings.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "If applicable, provide historical copies of detailed credentialed application penetration testing reports including scope and findings.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "* If applicable, provide copies of remediation plans and progress against the findings reported in penetration tests.",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "RECURRING HYGIENE",
    "q2025_number": "66",
    "q2026_number": "68",
    "text_2025": "Please indicate which of the following apply to the contracting and onboarding of vendors that have access to company systems or data.",
    "text_2026": "Please indicate which of the following apply to the contracting and onboarding of vendors that have access to company systems or data.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "1.0",
    "attachments_2025": [
      "AApttparcohvmael Mnta: tcroixn 2tr0a2c5to.xrolsnxb",
      "oVaernddinogr. pRnisgk",
      "Mexaptroixrt.1x6ls2x41652988638895140.csv",
      "Vendor"
    ],
    "attachments_2026": [
      "APottlaiccyh.mpdefnt: Vendorlist.png",
      "Vendor_ticket.png",
      "Studio Designer Contractor Onboarding"
    ],
    "options_diff": [
      {
        "text": "We do not engage vendors that have access to company systems or data",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "Vendor onboarding processes are informal or undocumented.",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "A documented process for onboarding new vendors or renewing existing vendors is in place.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Vendor access provisioning is performed in alignment with a documented process.",
        "checked_2025": true,
        "checked_2026": false,
        "status": "removed"
      },
      {
        "text": "Which of the following acceptable contractual security criteria are documented? (Check all that apply)",
        "checked_2025": false,
        "checked_2026": false,
        "status": "unchanged"
      },
      {
        "text": "– incident notification period,",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "– audit rights of the company",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      },
      {
        "text": "– service level agreements,",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "– subcontractor security",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "– data retention and destruction,",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "– confidentiality",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "– data breach liability",
        "checked_2025": false,
        "checked_2026": true,
        "status": "added"
      }
    ],
    "evidence_diff": [
      {
        "text": "Documentation of the process for onboarding new vendors or renewing existing vendors.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A list of active IT vendors, service providers, or contractors with access to company systems or data.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      },
      {
        "text": "A screenshot or export of tickets for onboarding the above vendors, service providers, and contractors.",
        "checked_2025": true,
        "checked_2026": true,
        "status": "unchanged"
      }
    ]
  },
  {
    "category": "VALIDATION CALL",
    "q2025_number": "67",
    "q2026_number": "69",
    "text_2025": "Please provide several one-hour times starting after one week that you are available to meet to discuss questions the Crosslake practitioner may have about the assessment results.",
    "text_2026": "Please provide several one-hour times starting after one week that you are available to meet to discuss questions the Crosslake practitioner may have about the assessment results.",
    "isNew": false,
    "isDeleted": false,
    "score_2026": "Not Scored",
    "comments_2025": "7/14 - 2:00 PM 7/16 - 3:00 PM 7/17 - 2:30 PM 7/18 - 3:00 PM 7/21 - 4:00 PM 7/22 - 12:00 PM 7/23 - 12:00 PM Timezone - CST",
    "comments_2026": "06/ 29 - 4:00 PM 6/30 - 4:00 PM 7/1 - 4:00 PM 7/2 - 4:00 PM 7/6 - 4:00 PM 7/7 - 4:00 PM 7/8 - 4:00 PM"
  }
];
