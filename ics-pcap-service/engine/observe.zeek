@load base/protocols/modbus
@load policy/tuning/json-logs
@load policy/frameworks/analyzer/debug-logging

# A completion marker distinguishes empty logs from interrupted/missing output.
global connection_rows: count = 0;
global modbus_rows: count = 0;
event Conn::log_conn(rec: Conn::Info) { ++connection_rows; }
event Modbus::log_modbus(rec: Modbus::Info) { ++modbus_rows; }
event zeek_done()
    {
    local marker = open("complete.marker");
    print marker, fmt("ics-zeek-p0-v1 %d %d", connection_rows, modbus_rows);
    close(marker);
    }
