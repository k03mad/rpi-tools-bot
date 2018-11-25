import serial
import smbus2
import bme280

# bme280

def hPa_to_mmHg(hPa):
    return hPa * 0.75006375541921

address = 0x76
bus = smbus2.SMBus(1)
calibration_params = bme280.load_calibration_params(bus, address)
data = bme280.sample(bus, address, calibration_params)

# mhz19

ser = serial.Serial(
    '/dev/serial0',
    baudrate = 9600,
    bytesize = serial.EIGHTBITS,
    parity = serial.PARITY_NONE,
    stopbits = serial.STOPBITS_ONE,
    timeout = 1.0
)

ser.write('\xff\x01\x86\x00\x00\x00\x00\x00\x79')
s = ser.read(9)
ppm = ord(s[2]) * 256 + ord(s[3])

# output

print '{"temp":%s,"hum":%s,"press":%s,"ppm":%s}' % (
    data.temperature, data.humidity, hPa_to_mmHg(data.pressure), ppm
)
