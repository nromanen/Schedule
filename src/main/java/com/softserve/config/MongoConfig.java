//package com.softserve.config;
//
//import com.mongodb.client.MongoClient;
//import com.mongodb.client.MongoClients;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.context.annotation.Profile;
//import org.springframework.data.mongodb.core.MongoTemplate;
//
//@Configuration
//@Slf4j
//@Profile("!test")
//public class MongoConfig {
//
//    @Value("${spring.data.mongodb.uri}")
//    private String mongoUri;
//
//    @Value("${spring.data.mongodb.database}")
//    private String database;
//
//    @Bean
//    @Primary
//    public MongoClient mongoClient() {
//        log.info("Connecting to MongoDB...");
//        return MongoClients.create(mongoUri);
//    }
//
//    @Bean
//    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
//        return new MongoTemplate(mongoClient, database);
//    }
//}
