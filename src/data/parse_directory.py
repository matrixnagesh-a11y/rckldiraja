import json
import re

import os

dir_path = os.path.dirname(os.path.abspath(__file__))
raw_path = os.path.join(dir_path, 'raw_pdf_text.txt')

with open(raw_path, 'r', encoding='utf-8') as f:
    raw = f.read()

pages = raw.split('=== PAGE ')

# 1. Club Metadata
club_info = {
    "name": "Rotary Club of Kuala Lumpur DiRaja",
    "charter_no": "3268",
    "club_no": "16222",
    "district": "3300",
    "founded": "1928",
    "chartered": "15 January 1930",
    "king": "Seri Paduka Baginda Yang Di-Pertuan Agong Sultan Ibrahim",
    "royal_patron": "H.R.H. Sultan Sharafuddin Idris Shah Alhaj Ibni Almarhum Sultan Salahuddin Abdul Aziz Shah Alhaj (Sultan of Selangor)",
    "ri_president": "Francesco Arezzo (2025-2026)",
    "district_governor": "Edward Khoo Toh Hock (2025-2026)",
    "club_president": "Dato Dr. Prakash Rao (2025-2026)",
    "address": "Level 3, Bangunan Sultan Salahuddin Abdul Aziz Shah, 16 Jalan Utara, Petaling Jaya, 46200 Selangor, Malaysia",
    "email": "rckldiraja@gmail.com",
    "website": "www.rotarykldiraja.org",
    "meetings": "1st and 3rd Wednesdays at 12:45 PM (Lunch Meeting)"
}

# 2. Board of Directors
board = [
    {"role": "President", "name": "Dato Dr. Prakash Rao"},
    {"role": "Vice President", "name": "Rajendra Kulasegaran"},
    {"role": "Immediate Past President", "name": "PAG Amir Izwan Mohd Dahan"},
    {"role": "President Elect / Club Administration", "name": "PAG Hardeep Singh"},
    {"role": "Honorary Secretary", "name": "PAG A T Kumararajah"},
    {"role": "Honorary Treasurer", "name": "Surinderdeep Singh"},
    {"role": "Vocational Service Director", "name": "Aiman Manan"},
    {"role": "Community Service Director", "name": "Mohd Azmal Khan"},
    {"role": "International Service Director", "name": "Nadeem Mahmood Shaikh"},
    {"role": "Youth Service Director", "name": "Darween Singh"},
    {"role": "Fellowship Service Director", "name": "Pradeep Balaram"},
    {"role": "Rotary Foundation Director", "name": "PP Datuk Chan Kam Fatt"},
    {"role": "Membership Director", "name": "PAG Ajit Singh Johl"},
    {"role": "Sergeant-at-Arms", "name": "Alaric Asir Nathan"}
]

# 3. Active Members List from Page 12 & 13
active_member_names = [
    "AHMED A HASSAN", "AIMAN FAKHRULLAH BIN MOHD MANAN", "AJIT SINGH JOHL", "AJITPAL SINGH",
    "AKBAR KHAN MOHD KHAN", "ALARIC ASIR NATHAN", "ALVIN NIGEL PAUL", "AMIR IZWAN MOHD DAHAN",
    "ANDREW CHIA KONG LAM", "ASHVINTHAN ANAMALAI", "A T KUMARARAJAH TAMBYRAJA", "BADIL ZAMAN KHAN AHMED MAIDEEN",
    "BEH LYE HUAT", "CHAN KAM FATT", "CHANDRASEKARAN RAMASAMY", "DARWEEN SINGH A/L SUKHDEV SINGH",
    "DINESH V K RAGHAVAN", "FABIAN TEJA BOEGERSHAUSEN", "FONG SEOW KEE", "GUS TAKOW ETENGENG",
    "HALIM HARUN", "HARDEEP SINGH A/L RAM SINGH", "ISMAIL BIN ZAKARIA", "JAGJIT SINGH A/L KANWAL SINGH",
    "JASDEV SINGH A/L TARA SINGH", "JASVINDER SINGH BRAR", "JASPAL SINGH SEHRA", "JAYARAJAN VALUTHANAM",
    "JEYASINGAM A/L C RAMANATHAN", "JONATHAN TSU BING YIN", "K SUBHASH JOSHI", "K. JAYABALAN K. GOBAL",
    "KARTHIK KANAGASABAPATHI", "KARTHIK KASINATHAN", "KENNETH WONG KIAN LING", "KHOR HOW LOONG",
    "KULASINGAM A/L S THANGIAH", "LEONG WEI THYE", "LIM ENG KHOON", "LOW BOON LIANG",
    "MAN MOHAN SINGH A/L HARBANS SINGH", "MATHEW MATHAI CUNNIMPURATHU", "MICHAEL K H HEAH",
    "MOHAMED HARIS BIN ALAUDIN", "MOHAMED MUSTAFA BIN SHAFIE", "MOHAMED RIZAL AL-AMIN TUN SARDON",
    "MOHD AZMAL KHAN AHMED MAIDEEN", "MOHD HANIF SHER MOHAMED", "MURTAZA SHAFIE MUNTAZ AHMAD",
    "MUSTAPHA MA CHI", "NADEEM MAHMOOD SHAIKH", "NAGESH MAHAJAN", "NEIL TAN WEI SHIN",
    "ONG YU JIAN", "OTOHIKO ABE", "PETER BILITSCH", "PETER VOGT", "PRAKASH RAO A/L T. S. SAMY",
    "PRADEEP BALARAM", "R JEYAKUMAR A/L N RAMIAH", "RABINDAR SINGH A/L MUKHTIAR SINGH",
    "RAHMAT ABDULLAH", "RAJENDRA KULASEGARAN", "RAMANATHAN N. S. A/L A. NANJAPPAN",
    "S LOGANATHAN A/L SEENIVASAGAM", "S RAMACHANDRAN A/L SUNDRAM", "SANJEEV BALACHANDRAN A/L GOPALA KRISHNAN",
    "SARAVANAN CHELLIAH", "SIVAKUMAR S/O KRISHNAN", "SREENIVASAN A/L N VASUDEVAN",
    "SUBRAMANIAM CHANDRASEKARAN", "SUBRAMANIAN A/L T ARUNACHALAM", "SURINDERDEEP SINGH A/L RANJIT SINGH",
    "SURESH GOBINDRAM SADHWANI", "SURESH NARAINDAS AMARNANI", "T LOGANATHAN",
    "TAN BAN ENG", "TAN BOON CHUAN", "TEH LEONG SENG", "THEN SHEE SOON",
    "V S K RAGHAVAN", "VASANTHAN A/L SHANMUGAM", "VINCENT HOE CHEE CHEONG", "VIJAYA KUMAR S/O BALAKRISHNAN",
    "WONG CHEE WING", "YAP CHEE KEONG", "YIP YEW CHUNG"
]

# 4. Detailed Member Profiles Parsing from text
members = []
member_pages_text = '\n'.join(pages[13:55])
member_blocks = re.split(r'\n(?=\d+\.\s+[A-Z])', member_pages_text)

for b in member_blocks:
    lines = [l.strip() for l in b.split('\n') if l.strip()]
    if not lines: continue
    
    m_name_match = re.match(r'^(\d+)\.\s+(.*)', lines[0])
    if not m_name_match: continue
    
    m_id = int(m_name_match.group(1))
    m_name = m_name_match.group(2).strip()
    
    # Clean up name if header leaked
    if "CLUB DIRECTORY" in m_name:
        m_name = m_name.split("CLUB DIRECTORY")[0].strip()
        
    info = {
        "id": m_id,
        "name": m_name,
        "classification": "",
        "office_addr": "",
        "office_tel": "",
        "mobile": "",
        "email": "",
        "birthday": "",
        "wedding_anniversary": "",
        "spouse": "",
        "phf": "PHF" in b or "BENEFACTOR" in b or "JRF" in b,
        "past_president": "PP" in b or "PDG" in b or "CP" in b
    }
    
    for l in lines[1:]:
        if "CLASSIFICATION:" in l:
            info["classification"] = l.split("CLASSIFICATION:")[1].strip()
        elif "OFFICE ADDR:" in l:
            info["office_addr"] = l.split("OFFICE ADDR:")[1].strip()
        elif "OFFICE TEL:" in l:
            info["office_tel"] = l.split("OFFICE TEL:")[1].strip()
        elif "MOBILE:" in l:
            info["mobile"] = l.split("MOBILE:")[1].strip()
        elif "EMAIL:" in l:
            info["email"] = l.split("EMAIL:")[1].strip()
        elif "BIRTHDAY:" in l:
            info["birthday"] = l.split("BIRTHDAY:")[1].strip()
        elif "WEDDING ANNIVERSARY:" in l:
            info["wedding_anniversary"] = l.split("WEDDING ANNIVERSARY:")[1].strip()
        elif "WIFE:" in l or "HUSBAND:" in l or "SPOUSE:" in l:
            sep = "WIFE:" if "WIFE:" in l else ("HUSBAND:" if "HUSBAND:" in l else "SPOUSE:")
            info["spouse"] = l.split(sep)[1].strip()
            
    members.append(info)

# 5. Four-Way Test
four_way_test = [
    "Is it the TRUTH?",
    "Is it FAIR to all concerned?",
    "Will it build GOODWILL and BETTER FRIENDSHIPS?",
    "Will it be BENEFICIAL to all concerned?"
]

# 6. Past Presidents Summary
past_presidents = [
    {"year": "1928-1929", "name": "F. A. Punter (Founding President)"},
    {"year": "1929-1930", "name": "A. J. Pannekoek"},
    {"year": "1950-1951", "name": "Tun Sir Henry H. S. Lee"},
    {"year": "1962-1963", "name": "Tan Sri Dato Jamil Rais"},
    {"year": "1978-1979", "name": "Dato Dr. K. A. Menon"},
    {"year": "2000-2001", "name": "Dato Beh Lye Huat"},
    {"year": "2023-2024", "name": "Datuk Chan Kam Fatt"},
    {"year": "2024-2025", "name": "Amir Izwan Mohd Dahan"},
    {"year": "2025-2026", "name": "Dato Dr. Prakash Rao"}
]

data = {
    "club_info": club_info,
    "board": board,
    "members": members,
    "four_way_test": four_way_test,
    "past_presidents": past_presidents
}

out_path = os.path.join(dir_path, 'club_directory.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Successfully generated club_directory.json with {len(members)} member profiles!")
