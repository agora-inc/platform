from client import Client
import time

client1 = Client("Shaquille ONeil")
client2 = Client("Kobe Bryant")
client3 = Client("Bill Gates")

client1.send_msg("sup")
time.sleep(3)
client2.send_msg("yoyo")
time.sleep(3)
client3.send_msg("sup fuckers")
