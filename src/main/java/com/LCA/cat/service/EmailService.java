package com.LCA.cat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Service for sending email invitations via Resend API (HTTP-based, no SMTP needed)
 */
@Service
public class EmailService {

    @Value("${resend.api.key:re_dummy}")
    private String resendApiKey;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String fromEmail;

    /**
     * Send group invitation email via Resend HTTP API
     */
    public void sendInvitation(String groupName, String groupKey, String inviterName, 
                              String inviterEmail, String recipientEmail) throws Exception {
        
        String htmlContent = buildEmailContent(groupName, groupKey, inviterName, inviterEmail);
        String subject = "You're invited to join " + groupName + " on LCA!";

        // Build JSON payload for Resend API
        String jsonPayload = String.format(
            "{\"from\":\"%s\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":%s}",
            fromEmail,
            recipientEmail,
            escapeJson(subject),
            toJsonString(htmlContent)
        );

        // Send HTTP POST to Resend API
        URL url = new URL("https://api.resend.com/emails");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + resendApiKey);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            // Read error response
            java.io.InputStream errorStream = conn.getErrorStream();
            String errorBody = "";
            if (errorStream != null) {
                errorBody = new String(errorStream.readAllBytes(), StandardCharsets.UTF_8);
            }
            throw new RuntimeException("Resend API error (HTTP " + responseCode + "): " + errorBody);
        }

        conn.disconnect();
    }

    private String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String toJsonString(String s) {
        StringBuilder sb = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default: sb.append(c);
            }
        }
        sb.append("\"");
        return sb.toString();
    }

    /**
     * Build HTML email content
     */
    private String buildEmailContent(String groupName, String groupKey, 
                                     String inviterName, String inviterEmail) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>");
        sb.append("<html><head><style>");
        sb.append("body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#333;background-color:#f4f4f4;margin:0;padding:0;}");
        sb.append(".container{max-width:600px;margin:20px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,0.1);}");
        sb.append(".header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;text-align:center;}");
        sb.append(".header h1{margin:0;font-size:28px;}");
        sb.append(".content{padding:30px;}");
        sb.append(".invitation-box{background:#f8f9fa;border-left:4px solid #667eea;padding:20px;margin:20px 0;border-radius:5px;}");
        sb.append(".group-key{font-size:32px;font-weight:bold;color:#667eea;text-align:center;letter-spacing:4px;padding:15px;background:white;border-radius:5px;margin:15px 0;border:2px dashed #667eea;}");
        sb.append(".steps{background:#f8f9fa;padding:20px;border-radius:5px;margin:20px 0;}");
        sb.append(".steps ol{margin:10px 0;padding-left:20px;}");
        sb.append(".steps li{margin:10px 0;}");
        sb.append(".footer{text-align:center;padding:20px;background:#f8f9fa;color:#666;font-size:14px;}");
        sb.append("</style></head><body>");
        sb.append("<div class='container'>");
        sb.append("<div class='header'><h1>🎉 Group Invitation</h1></div>");
        sb.append("<div class='content'>");
        sb.append("<h2>Hello!</h2>");
        sb.append("<p><strong>").append(inviterName).append("</strong> (").append(inviterEmail).append(") has invited you to join their group on LCA!</p>");
        sb.append("<div class='invitation-box'>");
        sb.append("<h3 style='margin-top:0;'>Group Name</h3>");
        sb.append("<p style='font-size:18px;margin:5px 0;'><strong>").append(groupName).append("</strong></p>");
        sb.append("</div>");
        sb.append("<h3>Your Group Access Key:</h3>");
        sb.append("<div class='group-key'>").append(groupKey).append("</div>");
        sb.append("<div class='steps'>");
        sb.append("<h3>How to Join:</h3>");
        sb.append("<ol>");
        sb.append("<li>Visit the LCA application</li>");
        sb.append("<li>Login to your account (or register if you're new)</li>");
        sb.append("<li>Enter the group key: <strong>").append(groupKey).append("</strong></li>");
        sb.append("<li>Click \"Join Group\" to connect with your friends!</li>");
        sb.append("</ol></div>");
        sb.append("<p>We're excited to have you join the group! If you have any questions, feel free to reach out to ").append(inviterName).append(".</p>");
        sb.append("<p style='color:#666;font-size:14px;margin-top:30px;'>");
        sb.append("<em>Note: This group key is unique to this group. Keep it safe and only share it with people you trust.</em></p>");
        sb.append("</div>");
        sb.append("<div class='footer'>");
        sb.append("<p>This is an automated message from LCA Group Management System</p>");
        sb.append("<p>&copy; 2026 LCA. All rights reserved.</p>");
        sb.append("</div></div></body></html>");
        return sb.toString();
    }
}
