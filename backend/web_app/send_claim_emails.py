from repository.AgoraClaimRepository import AgoraClaimRepository

# Script to be run by cron
claimEmails = AgoraClaimRepository()

unclaimedChannels = claimEmails.getUnclaimedChannels()
