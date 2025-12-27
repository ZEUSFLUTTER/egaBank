package com.ega.bank.bank_management_system.servives;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async 
    public void envoyerNotification(String destinataire, String sujet, String message) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(destinataire);
            email.setSubject(sujet);
            email.setText(message);
            email.setFrom("no-reply@egabank.com");
            
            mailSender.send(email);
            System.out.println("Email envoyé avec succès à : " + destinataire);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }
}