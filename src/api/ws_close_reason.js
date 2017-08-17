// credit: https://stackoverflow.com/questions/18803971/websocket-onerror-how-to-read-error-description
function getCloseReason(code){
  console.log(`getting close reason for code ${code}`);
  var reason;
  // See http://tools.ietf.org/html/rfc6455#section-7.4.1
  if (code == 1000)
    reason = "The websocket client was closed successfully!";
  else if (code == 1001)
    reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
  else if (code == 1002)
    reason = "An endpoint is terminating the connection due to a protocol error";
  else if (code == 1003)
    reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
  else if (code == 1004)
    reason = "Reserved. The specific meaning might be defined in the future.";
  else if (code == 1005)
    reason = "No status code was actually present.";
  else if (code == 1006)
    reason = "Websocket code: 1006. Most Likely the target websocket server is not up. Full message: The connection was closed abnormally, e.g., without sending or receiving a Close control frame.";
  else if (code == 1007)
    reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
  else if (code == 1008)
    reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
  else if (code == 1009)
    reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
  else if (code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
    reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + reason;
  else if (code == 1011)
    reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
  else if (code == 1015)
    reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
  else
    reason = "Unknown reason";
  return reason;
}