from repository import AgoraClaimRepository
from datetime import datetime
from app.databases import agora_db

SEND_DATE_TIME = datetime.now()

INTERVALS = [7, 14, 21, 28]

DELTA_TIME_WINDOW = 2  # Reminders are sent with an imprecision of 2 hours

assert DELTA_TIME_WINDOW == 2 , 'Imprecision is more than 2 hours'

ClaimRepo = AgoraClaimRepository.AgoraClaimRepository(db = agora_db)

def generate_reminders():
    for channel in ClaimRepo.get_all_fetched_channels():
        ClaimRepo.generate_claim_reminders(SEND_DATE_TIME, INTERVALS, channel)

# generate_reminders()

print(ClaimRepo.getUnclaimedChannelDetails(673))