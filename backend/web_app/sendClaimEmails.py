from repository import AgoraClaimRepository

SEND_DATE_TIME = "put something here"

INTERVALS = [7, 14, 21, 28]

ClaimRepo = AgoraClaimRepository.AgoraClaimRepository()

def generate_reminders():
    for channel in ClaimRepo.get_all_fetched_channels():
        ClaimRepo.generate_reminders(SEND_DATE_TIME, INTERVALS, channel)