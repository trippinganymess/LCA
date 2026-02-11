package com.LCA.cat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

/**
 * Service for sending email invitations via Gmail SMTP directly
 */
@Service
public class EmailService {

    @Value("${mail.username:dummy@gmail.com}")
    private String username;

    @Value("${mail.password:dummy-password}")
    private String password;

    /**
     * Send group invitation email via Gmail SMTP
     */
    public void sendInvitation(String groupName, String groupKey, String inviterName, 
                              String inviterEmail, String recipientEmail) throws Exception {
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.connectiontimeout", "30000");
        props.put("mail.smtp.timeout", "30000");
        props.put("mail.smtp.writetimeout", "30000");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
        message.setSubject("You're invited to join " + groupName + " on LCA!");
        message.setContent(buildEmailContent(groupName, groupKey, inviterName, inviterEmail), "text/html; charset=UTF-8");

        Transport.send(message);
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
